import { NextResponse } from "next/server"
import { runSystemCheck } from "@/lib/setup/database-setup"

export async function GET() {
  try {
    const systemStatus = await runSystemCheck()
    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error("System check API error:", error)
    return NextResponse.json(
      {
        database: { success: false, error: "Failed to check database" },
        ai: { success: false, error: "Failed to check AI" },
        overall: false,
      },
      { status: 500 },
    )
  }
}
