"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TicketSubmission } from "@/components/tickets/ticket-submission"
import { EnhancedAIChatbot } from "@/components/ai/enhanced-ai-chatbot"
import {
  Ticket,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  TrendingUp,
  Calendar,
} from "lucide-react"

interface UserDashboardProps {
  onLogout: () => void
  onViewTicket: (ticketId: string) => void
}

export function UserDashboard({ onLogout, onViewTicket }: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - replace with real data from your backend
  const userStats = {
    totalTickets: 12,
    openTickets: 3,
    resolvedTickets: 8,
    pendingTickets: 1,
  }

  const recentTickets = [
    {
      id: "TK-001",
      subject: "VPN Connection Issues",
      status: "open",
      priority: "high",
      createdAt: "2024-01-15",
      category: "Network",
    },
    {
      id: "TK-002",
      subject: "Software Installation Request",
      status: "in-progress",
      priority: "medium",
      createdAt: "2024-01-14",
      category: "Software",
    },
    {
      id: "TK-003",
      subject: "Email Configuration",
      status: "resolved",
      priority: "low",
      createdAt: "2024-01-13",
      category: "Email",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredTickets = recentTickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <MainLayout userRole="user" onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your support tickets and get help</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-panel border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tickets</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalTickets}</p>
                </div>
                <div className="w-12 h-12 bg-leoni-accent/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-leoni-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Open Tickets</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.openTickets}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Resolved</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.resolvedTickets}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.pendingTickets}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="create">Create Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="glass-panel border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-leoni-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.id} • {ticket.createdAt}
                        </p>
                      </div>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-panel border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-leoni-accent" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="w-full justify-start bg-leoni-accent hover:bg-leoni-accent/80 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Ticket
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with AI Assistant
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Knowledge Base
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card className="glass-panel border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-foreground">My Support Tickets</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted border-border"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:border-leoni-accent/50 transition-colors cursor-pointer"
                      onClick={() => onViewTicket(ticket.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{ticket.id}</span>
                            <span>{ticket.category}</span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {ticket.createdAt}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <TicketSubmission onTicketCreated={(ticketId) => onViewTicket(ticketId)} />
          </TabsContent>
        </Tabs>

        {/* AI Assistant */}
        <EnhancedAIChatbot
          userContext={{
            role: "user",
            ticketHistory: recentTickets.map((t) => ({
              id: t.id,
              title: t.subject,
              status: t.status,
              category: t.category,
            })),
          }}
        />
      </div>
    </MainLayout>
  )
}

export default UserDashboard
