"use server"

import { supabaseAdmin } from "@/lib/database"
import type { User } from "@/lib/types/database"

export async function authenticateUser(
  email: string,
  password: string,
): Promise<{
  success: boolean
  user?: User
  error?: string
}> {
  try {
    // For demo purposes, we'll use simple email-based authentication
    // In production, you'd use proper password hashing and verification

    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function createUser(userData: {
  email: string
  name: string
  role?: "user" | "admin"
}): Promise<{
  success: boolean
  user?: User
  error?: string
}> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        email: userData.email,
        name: userData.name,
        role: userData.role || "user",
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Get users error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Get users error:", error)
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error("Get user by ID error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Get user by ID error:", error)
    return null
  }
}
