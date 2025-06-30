"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "../navigation/header"
import MainLayout from "../layout/main-layout"
import { FilePreview, type UploadedFile } from "../upload/file-preview"
import { ArrowLeft, User, Send, Bot, CheckCircle, Paperclip } from "lucide-react"

interface TicketDetailPageProps {
  ticketId: string | null
  userRole: "admin" | "user" | null
  onLogout: () => void
  onBack: () => void
}

export function TicketDetailPage({ ticketId, userRole, onLogout, onBack }: TicketDetailPageProps) {
  const [newComment, setNewComment] = useState("")
  const [ticketStatus, setTicketStatus] = useState("in-progress")

  // Mock attached files
  const attachedFiles: UploadedFile[] = [
    {
      id: "1",
      file: new File([""], "error-screenshot.png", { type: "image/png" }),
      name: "error-screenshot.png",
      size: 245760,
      type: "image/png",
      url: "/placeholder.svg?height=400&width=600",
      uploadProgress: 100,
      status: "completed",
    },
    {
      id: "2",
      file: new File([""], "system-logs.txt", { type: "text/plain" }),
      name: "system-logs.txt",
      size: 15360,
      type: "text/plain",
      uploadProgress: 100,
      status: "completed",
    },
  ]

  const ticketData = {
    id: ticketId || "TK-002",
    subject: "Laptop screen flickering intermittently",
    user: {
      name: "Mike Chen",
      email: "mike.chen@leoni.com",
    },
    status: "in-progress",
    priority: "medium",
    type: "hardware",
    created: "2024-01-15 08:15",
    updated: "2024-01-15 14:30",
    assignee: "Tech Team A",
    description: `Hi IT Support,

I'm experiencing an issue with my laptop screen that started yesterday. The screen flickers intermittently, especially when I'm working with multiple applications open.

The flickering seems to happen more frequently when:
- Using video conferencing tools (Teams, Zoom)
- Working with graphics-intensive applications
- When the laptop has been running for more than 2 hours

I've tried restarting the laptop multiple times, but the issue persists.

My laptop model: Dell Latitude 7420
OS: Windows 11 Pro

Please let me know if you need any additional information.

Best regards,
Mike Chen`,
  }

  const comments = [
    {
      id: 1,
      author: "AI Assistant",
      type: "ai",
      timestamp: "2024-01-15 08:20",
      content:
        "Based on the description, this appears to be a hardware-related display issue. I recommend checking the display drivers and running hardware diagnostics.",
    },
    {
      id: 2,
      author: "John Smith (Tech Team A)",
      type: "technician",
      timestamp: "2024-01-15 09:45",
      content:
        "Hi Mike, I've reviewed your case. Let's start with updating your display drivers and running Windows Memory Diagnostic. I'll schedule a remote session with you this afternoon.",
    },
    {
      id: 3,
      author: "Mike Chen",
      type: "user",
      timestamp: "2024-01-15 11:30",
      content:
        "Thanks John! I've updated the display drivers as suggested. The flickering seems to have reduced but hasn't completely stopped.",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-blue-500/20 text-blue-400",
      "in-progress": "bg-yellow-500/20 text-yellow-400",
      resolved: "bg-green-500/20 text-green-400",
      closed: "bg-gray-500/20 text-gray-400",
    }
    return <Badge className={`${variants[status as keyof typeof variants]}`}>{status.replace("-", " ")}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      high: "bg-orange-500/20 text-orange-400",
      critical: "bg-red-500/20 text-red-400",
    }
    return <Badge className={`${variants[priority as keyof typeof variants]}`}>{priority}</Badge>
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setTicketStatus(newStatus)
    // In a real app, this would make an API call
    console.log("Status changed to:", newStatus)
  }

  const handleFileDownload = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <Header
          userName={userRole === "admin" ? "Admin User" : "Sarah Johnson"}
          userRole={userRole || "user"}
          onLogout={onLogout}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tickets
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{ticketData.subject}</h1>
                  <p className="text-muted-foreground">Ticket #{ticketData.id}</p>
                </div>
              </div>
              {userRole === "admin" && (
                <Button className="bg-leoni-accent hover:bg-leoni-accent/80 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Ticket Details */}
                <Card className="glass-panel border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <User className="w-5 h-5 mr-2 text-leoni-accent" />
                      Ticket Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-leoni-accent text-white">
                          {ticketData.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground font-medium">{ticketData.user.name}</p>
                        <p className="text-muted-foreground text-sm">{ticketData.user.email}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{ticketData.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* File Attachments */}
                <Card className="glass-panel border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Paperclip className="w-5 h-5 mr-2 text-leoni-accent" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilePreview files={attachedFiles} onDownload={handleFileDownload} showActions={true} />
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card className="glass-panel border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          {comment.type === "ai" ? (
                            <div className="w-full h-full bg-leoni-accent rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <AvatarFallback className="bg-gray-600 text-white text-xs">
                              {comment.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <p className="text-foreground font-medium text-sm">{comment.author}</p>
                            <p className="text-muted-foreground text-xs">{comment.timestamp}</p>
                            {comment.type === "ai" && (
                              <Badge className="bg-leoni-accent/20 text-leoni-accent text-xs">AI</Badge>
                            )}
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-foreground/90 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Add Comment */}
                <Card className="glass-panel border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Add Comment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add a comment or update..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-leoni-accent resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          className="bg-leoni-accent hover:bg-leoni-accent/80 text-white"
                          onClick={handleAddComment}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticket Info */}
                <Card className="glass-panel border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Ticket Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Status</span>
                        {getStatusBadge(ticketData.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Priority</span>
                        {getPriorityBadge(ticketData.priority)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Type</span>
                        <Badge className="bg-muted text-foreground capitalize">{ticketData.type}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Created</span>
                        <span className="text-foreground/90 text-sm">{ticketData.created}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Assignee</span>
                        <span className="text-foreground/90 text-sm">{ticketData.assignee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                {userRole === "admin" && (
                  <Card className="glass-panel border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-foreground/90 text-sm block mb-2">Change Status</label>
                        <Select value={ticketStatus} onValueChange={handleStatusChange}>
                          <SelectTrigger className="bg-muted border-border text-foreground focus:border-leoni-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-md border-border">
                            <SelectItem value="open" className="text-foreground hover:bg-accent">
                              Open
                            </SelectItem>
                            <SelectItem value="in-progress" className="text-foreground hover:bg-accent">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved" className="text-foreground hover:bg-accent">
                              Resolved
                            </SelectItem>
                            <SelectItem value="closed" className="text-foreground hover:bg-accent">
                              Closed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-leoni-accent hover:bg-leoni-accent/80 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
