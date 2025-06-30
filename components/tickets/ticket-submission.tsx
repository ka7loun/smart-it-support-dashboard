"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/upload/file-upload"
import { AITicketSuggestions } from "@/components/ai/ai-ticket-suggestions"
import { Loader2, Send, Lightbulb, AlertCircle, CheckCircle } from "lucide-react"
import { createTicket } from "@/app/actions/tickets"
import { useNotifications } from "@/components/notifications/notification-provider"

interface TicketSubmissionProps {
  onTicketCreated?: (ticketId: string) => void
  className?: string
}

export function TicketSubmission({ onTicketCreated, className }: TicketSubmissionProps) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { addNotification } = useNotifications()
  const formRef = useRef<HTMLFormElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitStatus("idle")
  }

  const handleSuggestionApply = (suggestion: any) => {
    if (suggestion.subject) {
      setFormData((prev) => ({ ...prev, subject: suggestion.subject }))
    }
    if (suggestion.category) {
      setFormData((prev) => ({ ...prev, category: suggestion.category }))
    }
    if (suggestion.priority) {
      setFormData((prev) => ({ ...prev, priority: suggestion.priority }))
    }
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.description.trim()) {
      setSubmitStatus("error")
      addNotification({
        id: Date.now().toString(),
        type: "error",
        title: "Validation Error",
        message: "Please fill in all required fields",
        timestamp: new Date(),
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const result = await createTicket({
        subject: formData.subject,
        description: formData.description,
        category: formData.category || "other",
        priority: formData.priority,
        attachments: files.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      })

      if (result.success && result.ticket) {
        setSubmitStatus("success")
        addNotification({
          id: Date.now().toString(),
          type: "success",
          title: "Ticket Created",
          message: `Ticket #${result.ticket.id} has been created successfully`,
          timestamp: new Date(),
        })

        // Reset form
        setFormData({
          subject: "",
          description: "",
          category: "",
          priority: "medium",
        })
        setFiles([])
        formRef.current?.reset()

        if (onTicketCreated) {
          onTicketCreated(result.ticket.id)
        }
      } else {
        throw new Error(result.error || "Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      setSubmitStatus("error")
      addNotification({
        id: Date.now().toString(),
        type: "error",
        title: "Error",
        message: "Failed to create ticket. Please try again.",
        timestamp: new Date(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.subject.trim() && formData.description.trim()

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="glass-panel border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Send className="w-5 h-5 mr-2 text-leoni-accent" />
            Create Support Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground">
                Subject *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Brief description of your issue"
                className="bg-muted border-border text-foreground"
                required
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="printing">Printing</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-foreground">
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-green-600 border-green-600">
                          Low
                        </Badge>
                        Can wait
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-yellow-600 border-yellow-600">
                          Medium
                        </Badge>
                        Normal priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-orange-600 border-orange-600">
                          High
                        </Badge>
                        Urgent
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-red-600 border-red-600">
                          Urgent
                        </Badge>
                        Critical issue
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Please provide detailed information about your issue..."
                className="bg-muted border-border text-foreground min-h-[120px]"
                required
              />
              {formData.description.length > 20 && !showSuggestions && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSuggestions(true)}
                  className="mt-2"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </Button>
              )}
            </div>

            {/* AI Suggestions */}
            {showSuggestions && (
              <AITicketSuggestions
                description={formData.description}
                onSuggestionApply={handleSuggestionApply}
                onClose={() => setShowSuggestions(false)}
              />
            )}

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-foreground">Attachments</Label>
              <FileUpload
                onFilesChange={setFiles}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
                acceptedTypes={["image/*", ".pdf", ".doc", ".docx", ".txt"]}
              />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Ticket created successfully! You will receive updates via email.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  Please fill in all required fields and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    subject: "",
                    description: "",
                    category: "",
                    priority: "medium",
                  })
                  setFiles([])
                  setSubmitStatus("idle")
                  formRef.current?.reset()
                }}
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-leoni-accent hover:bg-leoni-accent/80 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketSubmission
