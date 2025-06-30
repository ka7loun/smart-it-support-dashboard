"use server"

import { supabaseAdmin } from "@/lib/database"
import { revalidatePath } from "next/cache"
import type { Ticket, TicketStats } from "@/lib/types/database"

export async function createTicket(formData: FormData): Promise<{
  success: boolean
  ticket?: Ticket
  error?: string
}> {
  try {
    const subject = formData.get("subject") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const type = formData.get("type") as string
    const userEmail = formData.get("userEmail") as string

    if (!subject || !description || !priority || !type || !userEmail) {
      return { success: false, error: "All fields are required" }
    }

    // Get or create user
    let { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("email", userEmail).single()

    if (userError && userError.code === "PGRST116") {
      // User doesn't exist, create them
      const { data: newUser, error: createUserError } = await supabaseAdmin
        .from("users")
        .insert({
          email: userEmail,
          name: userEmail.split("@")[0],
          role: "user",
        })
        .select()
        .single()

      if (createUserError) {
        return { success: false, error: "Failed to create user" }
      }
      user = newUser
    } else if (userError) {
      return { success: false, error: "Failed to find user" }
    }

    // Create ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .insert({
        subject,
        description,
        priority,
        type,
        user_id: user.id,
        status: "open",
      })
      .select(`
        *,
        user:users(*)
      `)
      .single()

    if (ticketError) {
      return { success: false, error: "Failed to create ticket" }
    }

    // Create notification
    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      title: "Ticket Created",
      message: `Your ticket "${subject}" has been submitted successfully`,
      type: "success",
      ticket_id: ticket.id,
    })

    revalidatePath("/")
    return { success: true, ticket }
  } catch (error) {
    console.error("Create ticket error:", error)
    return { success: false, error: "Failed to create ticket" }
  }
}

export async function getTickets(filters?: {
  status?: string
  priority?: string
  assigneeId?: string
  userId?: string
}): Promise<Ticket[]> {
  try {
    let query = supabaseAdmin
      .from("tickets")
      .select(`
        *,
        user:users(*),
        assignee:users!tickets_assignee_id_fkey(*)
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.priority) {
      query = query.eq("priority", filters.priority)
    }
    if (filters?.assigneeId) {
      query = query.eq("assignee_id", filters.assigneeId)
    }
    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Get tickets error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Get tickets error:", error)
    return []
  }
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select(`
        *,
        user:users(*),
        assignee:users!tickets_assignee_id_fkey(*),
        comments:ticket_comments(
          *,
          user:users(*)
        ),
        attachments:ticket_attachments(
          *,
          user:users!ticket_attachments_uploaded_by_fkey(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Get ticket by ID error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Get ticket by ID error:", error)
    return null
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string,
  assigneeId?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status }
    if (assigneeId) {
      updateData.assignee_id = assigneeId
    }

    const { error } = await supabaseAdmin.from("tickets").update(updateData).eq("id", ticketId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Get ticket details for notification
    const { data: ticket } = await supabaseAdmin.from("tickets").select("*, user:users(*)").eq("id", ticketId).single()

    if (ticket) {
      // Create notification
      await supabaseAdmin.from("notifications").insert({
        user_id: ticket.user_id,
        title: "Ticket Updated",
        message: `Your ticket "${ticket.subject}" status changed to ${status}`,
        type: "info",
        ticket_id: ticketId,
      })
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Update ticket status error:", error)
    return { success: false, error: "Failed to update ticket" }
  }
}

export async function addTicketComment(
  ticketId: string,
  content: string,
  userId: string,
  isInternal = false,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.from("ticket_comments").insert({
      ticket_id: ticketId,
      user_id: userId,
      content,
      is_internal: isInternal,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Add ticket comment error:", error)
    return { success: false, error: "Failed to add comment" }
  }
}

export async function getTicketStats(): Promise<TicketStats> {
  try {
    const { data: tickets, error } = await supabaseAdmin.from("tickets").select("status, priority, type")

    if (error) {
      console.error("Get ticket stats error:", error)
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
        byType: {},
      }
    }

    const stats: TicketStats = {
      total: tickets.length,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      byType: {},
    }

    tickets.forEach((ticket) => {
      // Count by status
      switch (ticket.status) {
        case "open":
          stats.open++
          break
        case "in-progress":
          stats.inProgress++
          break
        case "resolved":
          stats.resolved++
          break
        case "closed":
          stats.closed++
          break
      }

      // Count by priority
      if (ticket.priority in stats.byPriority) {
        stats.byPriority[ticket.priority as keyof typeof stats.byPriority]++
      }

      // Count by type
      stats.byType[ticket.type] = (stats.byType[ticket.type] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error("Get ticket stats error:", error)
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      byType: {},
    }
  }
}
