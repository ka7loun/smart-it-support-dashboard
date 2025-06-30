import { checkDatabaseTables, checkDemoData } from "./simple-database-check"

export async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...")

    // Check if required tables exist
    const tableCheck = await checkDatabaseTables()

    if (!tableCheck.success) {
      const missingTables = tableCheck.tables.filter((table) => !table.exists).map((table) => table.name)

      console.log(`⚠️  Missing tables: ${missingTables.join(", ")}`)
      return {
        success: false,
        error: `Missing required tables: ${missingTables.join(", ")}. Please run the SQL scripts first.`,
        details: tableCheck.tables,
      }
    }

    // Check demo data
    const dataCheck = await checkDemoData()

    if (!dataCheck.success) {
      return {
        success: false,
        error: dataCheck.error,
      }
    }

    if (!dataCheck.hasUsers || !dataCheck.hasTickets) {
      return {
        success: true,
        message: "Database structure is ready. Run the seed script to add demo data.",
        needsSeeding: true,
        userCount: dataCheck.userCount,
        ticketCount: dataCheck.ticketCount,
      }
    }

    console.log("✅ Database is properly initialized with demo data")
    return {
      success: true,
      message: "Database is ready!",
      userCount: dataCheck.userCount,
      ticketCount: dataCheck.ticketCount,
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    return { success: false, error: "Failed to initialize database" }
  }
}

export async function checkAIConfiguration() {
  try {
    console.log("🤖 Checking AI configuration...")

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY not found in environment variables. Please add it to your .env.local file.",
      }
    }

    // Test API connection with a simple request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Test connection. Respond with: OK",
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`

      try {
        const errorData = await response.json()
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        }
      } catch (e) {
        // Use the HTTP status message
      }

      return {
        success: false,
        error: `AI API test failed: ${errorMessage}`,
      }
    }

    const result = await response.json()
    console.log("✅ AI configuration is working")
    return {
      success: true,
      message: "AI is ready!",
      model: "gemini-2.0-flash-exp",
    }
  } catch (error) {
    console.error("❌ AI configuration error:", error)
    return {
      success: false,
      error: `Failed to test AI configuration: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function runSystemCheck() {
  console.log("🔍 Running system check...")

  const dbCheck = await initializeDatabase()
  const aiCheck = await checkAIConfiguration()

  return {
    database: dbCheck,
    ai: aiCheck,
    overall: dbCheck.success && aiCheck.success,
  }
}
