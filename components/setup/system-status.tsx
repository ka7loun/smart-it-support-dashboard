"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Bot, Settings, AlertTriangle } from "lucide-react"

interface SystemStatus {
  database: {
    success: boolean
    message?: string
    error?: string
    needsSeeding?: boolean
    userCount?: number
    ticketCount?: number
    details?: Array<{
      name: string
      description: string
      exists: boolean
      error?: string
    }>
  }
  ai: {
    success: boolean
    message?: string
    error?: string
    model?: string
  }
  overall: boolean
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkSystemStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/system-check")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("System check failed:", error)
      setStatus({
        database: { success: false, error: "Failed to check database" },
        ai: { success: false, error: "Failed to check AI" },
        overall: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const getStatusIcon = (success: boolean, loading = false) => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
    return success ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean, warning = false) => {
    if (warning) {
      return <Badge className="bg-yellow-500/20 text-yellow-400">Warning</Badge>
    }
    return (
      <Badge className={success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
        {success ? "Ready" : "Error"}
      </Badge>
    )
  }

  return (
    <Card className="glass-panel border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Settings className="w-5 h-5 mr-2 text-leoni-accent" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && !status && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-leoni-accent mr-2" />
            <span className="text-muted-foreground">Checking system status...</span>
          </div>
        )}

        {status && (
          <>
            {/* Database Status */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <h4 className="text-foreground font-medium">Database</h4>
                  <p className="text-muted-foreground text-sm">
                    {status.database.success
                      ? status.database.message || "Connected and ready"
                      : status.database.error || "Connection failed"}
                  </p>
                  {status.database.success && status.database.userCount !== undefined && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {status.database.userCount} users, {status.database.ticketCount} tickets
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(status.database.success, status.database.needsSeeding)}
                {status.database.needsSeeding ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  getStatusIcon(status.database.success)
                )}
              </div>
            </div>

            {/* Show table details if there are issues */}
            {status.database.details && !status.database.success && (
              <div className="ml-8 space-y-2">
                {status.database.details.map((table) => (
                  <div key={table.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {table.name} - {table.description}
                    </span>
                    {table.exists ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* AI Status */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5 text-purple-500" />
                <div>
                  <h4 className="text-foreground font-medium">AI Assistant</h4>
                  <p className="text-muted-foreground text-sm">
                    {status.ai.success
                      ? status.ai.message || "Gemini AI connected"
                      : status.ai.error || "AI service unavailable"}
                  </p>
                  {status.ai.success && status.ai.model && (
                    <p className="text-muted-foreground text-xs mt-1">Model: {status.ai.model}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(status.ai.success)}
                {getStatusIcon(status.ai.success)}
              </div>
            </div>

            {/* Overall Status */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground font-medium">Overall System Status</h4>
                  <p className="text-muted-foreground text-sm">
                    {status.overall
                      ? "All systems operational"
                      : status.database.needsSeeding
                        ? "System ready, demo data recommended"
                        : "Some services need attention"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(status.overall, status.database.needsSeeding)}
                  {status.database.needsSeeding ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    getStatusIcon(status.overall)
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={checkSystemStatus}
                disabled={isLoading}
                className="bg-leoni-accent hover:bg-leoni-accent/80 text-white"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Refresh Status
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
