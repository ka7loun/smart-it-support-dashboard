import { supabaseAdmin } from "@/lib/database"

interface TableCheck {
  name: string
  description: string
  exists: boolean
  error?: string
}

export async function checkDatabaseTables(): Promise<{
  success: boolean
  tables: TableCheck[]
}> {
  const requiredTables = [
    { name: "users", description: "User accounts and roles" },
    { name: "tickets", description: "Support tickets" },
    { name: "ticket_comments", description: "Ticket comments and updates" },
    { name: "ticket_attachments", description: "File attachments" },
    { name: "notifications", description: "User notifications" },
  ]

  const tableChecks: TableCheck[] = []

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabaseAdmin.from(table.name).select("*").limit(1)

      tableChecks.push({
        name: table.name,
        description: table.description,
        exists: !error,
        error: error?.message,
      })
    } catch (err) {
      tableChecks.push({
        name: table.name,
        description: table.description,
        exists: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  const allTablesExist = tableChecks.every((table) => table.exists)

  return {
    success: allTablesExist,
    tables: tableChecks,
  }
}

export async function checkDemoData(): Promise<{
  success: boolean
  hasUsers: boolean
  hasTickets: boolean
  userCount: number
  ticketCount: number
  error?: string
}> {
  try {
    // Check users
    const { data: users, error: usersError } = await supabaseAdmin.from("users").select("id")

    if (usersError) {
      return {
        success: false,
        hasUsers: false,
        hasTickets: false,
        userCount: 0,
        ticketCount: 0,
        error: `Users check failed: ${usersError.message}`,
      }
    }

    // Check tickets
    const { data: tickets, error: ticketsError } = await supabaseAdmin.from("tickets").select("id")

    if (ticketsError) {
      return {
        success: false,
        hasUsers: users?.length > 0,
        hasTickets: false,
        userCount: users?.length || 0,
        ticketCount: 0,
        error: `Tickets check failed: ${ticketsError.message}`,
      }
    }

    return {
      success: true,
      hasUsers: users?.length > 0,
      hasTickets: tickets?.length > 0,
      userCount: users?.length || 0,
      ticketCount: tickets?.length || 0,
    }
  } catch (error) {
    return {
      success: false,
      hasUsers: false,
      hasTickets: false,
      userCount: 0,
      ticketCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
