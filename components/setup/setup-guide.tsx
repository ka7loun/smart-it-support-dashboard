"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Bot, Settings, Copy, ExternalLink, CheckCircle, AlertTriangle, Info } from "lucide-react"

export function SetupGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000`

  return (
    <Card className="glass-panel border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Settings className="w-5 h-5 mr-2 text-leoni-accent" />
          Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>Follow these steps to complete your Smart IT Support Dashboard setup.</AlertDescription>
        </Alert>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="database" className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              AI Setup
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Database Setup</h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-500/20 text-blue-400 mt-1">1</Badge>
                  <div>
                    <p className="text-foreground font-medium">Create Supabase Project</p>
                    <p className="text-muted-foreground text-sm">
                      Go to{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-leoni-accent hover:underline"
                      >
                        supabase.com
                      </a>{" "}
                      and create a new project
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-500/20 text-blue-400 mt-1">2</Badge>
                  <div>
                    <p className="text-foreground font-medium">Run SQL Scripts</p>
                    <p className="text-muted-foreground text-sm mb-2">
                      Execute these scripts in your Supabase SQL Editor:
                    </p>
                    <div className="space-y-2">
                      <div className="bg-muted p-2 rounded text-sm font-mono">scripts/01-create-tables.sql</div>
                      <div className="bg-muted p-2 rounded text-sm font-mono">scripts/02-seed-data.sql</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="bg-blue-500/20 text-blue-400 mt-1">3</Badge>
                  <div>
                    <p className="text-foreground font-medium">Get API Keys</p>
                    <p className="text-muted-foreground text-sm">
                      Copy your project URL and API keys from Settings → API
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">AI Assistant Setup</h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge className="bg-purple-500/20 text-purple-400 mt-1">1</Badge>
                  <div>
                    <p className="text-foreground font-medium">Get Gemini API Key</p>
                    <p className="text-muted-foreground text-sm mb-2">Visit Google AI Studio to get your API key:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
                      className="text-leoni-accent border-leoni-accent hover:bg-leoni-accent/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get API Key
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="bg-purple-500/20 text-purple-400 mt-1">2</Badge>
                  <div>
                    <p className="text-foreground font-medium">Add to Environment</p>
                    <p className="text-muted-foreground text-sm">Add your Gemini API key to your .env.local file</p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The AI assistant will work in fallback mode without the API key, but won't provide intelligent
                  responses.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Environment Variables</h3>

              <p className="text-muted-foreground text-sm">
                Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root with these
                variables:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{envTemplate}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(envTemplate, "environment")}
                >
                  {copiedText === "environment" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Replace the placeholder values with your actual API keys and URLs from Supabase and Google AI Studio.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
