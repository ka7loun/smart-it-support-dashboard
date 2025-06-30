"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { generateTicketSuggestions } from "@/app/actions/ai-chat"

interface AITicketSuggestionsProps {
  description: string
  onApplySuggestion: (suggestion: {
    subject?: string
    category?: string
    priority?: string
    additionalInfo?: string
  }) => void
  className?: string
}

export function AITicketSuggestions({ description, onApplySuggestion, className }: AITicketSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (description.length > 50) {
      generateSuggestions()
    }
  }, [description])

  const generateSuggestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await generateTicketSuggestions(description)

      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions[0])
      } else {
        setError(result.error || "Failed to generate suggestions")
      }
    } catch (err) {
      setError("Failed to generate suggestions")
    } finally {
      setIsLoading(false)
    }
  }

  if (!description || description.length < 50) {
    return null
  }

  return (
    <Card className={`glass-panel border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center text-lg">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-leoni-accent mr-2" />
            <span className="text-muted-foreground">Analyzing your issue...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSuggestions}
              className="mt-2 text-red-400 hover:text-red-300"
            >
              Try Again
            </Button>
          </div>
        )}

        {suggestions && !isLoading && (
          <div className="space-y-4">
            <div className="bg-leoni-accent/10 border border-leoni-accent/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-foreground font-medium text-sm">AI Analysis Complete</span>
              </div>

              <div className="space-y-3">
                {suggestions.subject && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">Suggested Subject:</label>
                    <div className="mt-1 bg-muted/50 rounded-md p-2">
                      <p className="text-foreground text-sm">{suggestions.subject}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {suggestions.category && (
                    <div>
                      <label className="text-muted-foreground text-xs font-medium">Category:</label>
                      <div className="mt-1">
                        <Badge className="bg-blue-500/20 text-blue-400 capitalize">{suggestions.category}</Badge>
                      </div>
                    </div>
                  )}

                  {suggestions.priority && (
                    <div>
                      <label className="text-muted-foreground text-xs font-medium">Priority:</label>
                      <div className="mt-1">
                        <Badge
                          className={`capitalize ${
                            suggestions.priority === "critical"
                              ? "bg-red-500/20 text-red-400"
                              : suggestions.priority === "high"
                                ? "bg-orange-500/20 text-orange-400"
                                : suggestions.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {suggestions.priority}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {suggestions.additionalInfo && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      Additional Information to Include:
                    </label>
                    <div className="mt-1 bg-muted/50 rounded-md p-2">
                      <p className="text-foreground text-sm">{suggestions.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(suggestions)}
                  className="bg-leoni-accent hover:bg-leoni-accent/80 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Suggestions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSuggestions}
                  className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
