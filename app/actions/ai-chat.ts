"use server"

import { generateAIResponse } from "@/lib/ai/gemini-service"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface UserContext {
  role?: "admin" | "user"
  ticketHistory?: Array<{
    id: string
    title: string
    status: string
    category: string
  }>
}

export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[],
  userContext?: UserContext,
): Promise<ChatMessage> {
  try {
    const response = await generateAIResponse(message, conversationHistory, userContext)

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error("Error in AI chat:", error)

    return {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to submit a support ticket for immediate assistance.",
      timestamp: new Date(),
    }
  }
}

export async function generateTicketSuggestions(
  description: string,
): Promise<{ success: boolean; suggestions?: any; error?: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return {
        success: false,
        error: "AI service not available",
        suggestions: ["Please fill out the form manually - our team will review your ticket."],
      }
    }

    const { GeminiAIService } = await import("@/lib/ai/gemini-service")
    const aiService = new GeminiAIService(apiKey)

    const suggestions = await aiService.generateTicketSuggestions(description)

    return { success: true, suggestions: [suggestions] }
  } catch (error) {
    console.error("Ticket Suggestions Error:", error)
    return {
      success: false,
      error: "Failed to generate suggestions",
      suggestions: ["Please provide as much detail as possible about your issue."],
    }
  }
}
