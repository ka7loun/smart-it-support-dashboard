interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface UserContext {
  role?: "admin" | "user"
  ticketHistory?: Array<{
    id: string
    title: string
    status: string
    category: string
  }>
}

export class GeminiAIService {
  private apiKey: string
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      // Use the correct model name for v1beta API
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages.map((msg) => ({
            parts: [{ text: msg.content }],
            role: msg.role === "assistant" ? "model" : "user",
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API Error Response:", errorData)
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      console.log("Gemini API Success Response:", data)

      if (!data.candidates || data.candidates.length === 0) {
        return "I apologize, but I couldn't generate a response at this time."
      }

      return data.candidates[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response."
    } catch (error) {
      console.error("Gemini API Error:", error)
      throw error
    }
  }

  async generateITSupportResponse(userMessage: string, context?: any): Promise<string> {
    const systemPrompt = `You are an expert IT Support Assistant for Leoni, a leading automotive technology company. Your role is to:

1. Provide helpful, accurate technical support
2. Guide users through troubleshooting steps
3. Suggest when to escalate issues to human technicians
4. Help users create detailed support tickets
5. Offer preventive maintenance tips

Guidelines:
- Be professional, friendly, and patient
- Ask clarifying questions when needed
- Provide step-by-step instructions
- Suggest multiple solutions when possible
- Know when to recommend creating a support ticket
- Focus on common IT issues: network, software, hardware, access problems

Context:
${context?.userRole ? `User Role: ${context.userRole}` : ""}
${context?.issueType ? `Issue Type: ${context.issueType}` : ""}
${context?.ticketHistory?.length ? `Previous Tickets: ${context.ticketHistory.map((ticket) => `${ticket.id} - ${ticket.title}`).join(", ")}` : ""}

User message: ${userMessage}

Respond helpfully to the user's question or issue.`

    try {
      const response = await this.generateResponse([{ role: "user", content: systemPrompt }])
      return response
    } catch (error) {
      console.error("Error generating IT support response:", error)
      return "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment, or feel free to create a support ticket for immediate assistance."
    }
  }

  async generateTicketSuggestions(description: string): Promise<{
    category: string
    priority: "low" | "medium" | "high" | "urgent"
    suggestedSolution?: string
  }> {
    try {
      const prompt = `Analyze this IT support ticket description and provide:
1. Most appropriate category (Hardware, Software, Network, Email, Printing, Security, Other)
2. Priority level (low, medium, high, urgent)
3. Brief suggested solution if it's a common issue

Ticket description: "${description}"

Respond in JSON format:
{
  "category": "category_name",
  "priority": "priority_level",
  "suggestedSolution": "brief_solution_or_null"
}`

      const response = await this.generateResponse([{ role: "user", content: prompt }])

      try {
        return JSON.parse(response)
      } catch {
        // Fallback if JSON parsing fails
        return {
          category: "Other",
          priority: "medium" as const,
        }
      }
    } catch (error) {
      console.error("Error generating ticket suggestions:", error)
      return {
        category: "Other",
        priority: "medium" as const,
      }
    }
  }
}

// Export the function that was being imported
export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userContext?: UserContext,
): Promise<string> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCwgbd_3PNT0DSWV3b1e6PJLwkL4kyVfqw"

    if (!apiKey) {
      return "🔧 **AI Assistant Setup Required**\n\nTo enable AI-powered support, please:\n\n1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)\n2. Add it to your environment variables as `GEMINI_API_KEY`\n3. Restart the application\n\nIn the meantime, I can still help you navigate the platform and provide general IT support guidance!"
    }

    const aiService = new GeminiAIService(apiKey)

    // Build context for the AI
    const systemPrompt = `You are an intelligent IT support assistant for Leoni, a leading automotive technology company. You help employees with technical issues, software problems, hardware troubleshooting, and IT-related questions.

Key guidelines:
- Be professional, helpful, and concise
- Provide step-by-step solutions when appropriate
- Ask clarifying questions if needed
- Suggest creating a support ticket for complex issues
- Focus on common IT problems: software issues, hardware problems, network connectivity, email, printing, etc.
- If you don't know something, be honest and suggest contacting IT support

User context:
- Role: ${userContext?.role || "employee"}
- Previous tickets: ${userContext?.ticketHistory?.length || 0}

Conversation history:
${conversationHistory
  .slice(-3)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

User: ${userMessage}
`

    const response = await aiService.generateResponse([{ role: "user", content: systemPrompt }])
    return response
  } catch (error) {
    console.error("Error generating AI response:", error)
    return "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment, or feel free to create a support ticket for immediate assistance."
  }
}
