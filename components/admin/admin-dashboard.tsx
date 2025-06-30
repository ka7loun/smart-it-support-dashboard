"use client"

import { useState } from "react"
import { MainLayout } from "../layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ticket, Clock, CheckCircle, AlertCircle, TrendingUp, Search, Eye, UserCheck } from "lucide-react"

interface AdminDashboardProps {
  onLogout?: () => void
  onViewTicket?: (ticketId: string) => void
}

interface TicketData {
  id: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
  updatedAt: string
  description: string
  category: string
  assignedTo?: string
  requester: string
}

export function AdminDashboard({ onLogout, onViewTicket }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<"overview" | "tickets" | "analytics" | "users">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock ticket data
  const tickets: TicketData[] = [
    {
      id: "T-001",
      subject: "VPN Connection Issues",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T14:20:00Z",
      description: "Unable to connect to company VPN from home office",
      category: "Network",
      assignedTo: "John Smith",
      requester: "Sarah Johnson",
    },
    {
      id: "T-002",
      subject: "Software Installation Request",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-01-12T09:15:00Z",
      updatedAt: "2024-01-13T16:45:00Z",
      description: "Need Adobe Creative Suite installed on workstation",
      category: "Software",
      assignedTo: "Mike Davis",
      requester: "Tom Wilson",
    },
    {
      id: "T-003",
      subject: "Email Access Problem",
      status: "open",
      priority: "medium",
      createdAt: "2024-01-10T11:20:00Z",
      updatedAt: "2024-01-10T11:20:00Z",
      description: "Cannot access email on mobile device",
      category: "Access",
      requester: "Lisa Brown",
    },
    {
      id: "T-004",
      subject: "Printer Not Working",
      status: "open",
      priority: "low",
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
      description: "Office printer is not responding to print jobs",
      category: "Hardware",
      requester: "David Lee",
    },
    {
      id: "T-005",
      subject: "System Crash",
      status: "in-progress",
      priority: "critical",
      createdAt: "2024-01-16T08:30:00Z",
      updatedAt: "2024-01-16T09:15:00Z",
      description: "Workstation crashes randomly during work",
      category: "Hardware",
      assignedTo: "John Smith",
      requester: "Emma Davis",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400"
      case "resolved":
        return "bg-green-500/20 text-green-400"
      case "closed":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500/20 text-green-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "high":
        return "bg-orange-500/20 text-orange-400"
      case "critical":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    critical: tickets.filter((t) => t.priority === "critical").length,
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-leoni-accent/10 to-leoni-blue/10 rounded-lg p-6 border border-leoni-accent/20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage tickets, monitor performance, and oversee IT support operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Ticket className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.open}</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Tickets</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest support requests requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm">{ticket.subject}</h4>
                      <Badge className={getStatusColor(ticket.status)} variant="secondary">
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ticket.requester} • {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewTicket?.(ticket.id)}
                    className="border-border hover:bg-accent"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Team Performance</CardTitle>
            <CardDescription className="text-muted-foreground">Current week statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <UserCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">John Smith</p>
                    <p className="text-sm text-muted-foreground">Senior Technician</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mike Davis</p>
                    <p className="text-sm text-muted-foreground">IT Specialist</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Avg. Resolution Time</p>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">2.4h</p>
                  <p className="text-xs text-green-400">-15% from last week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Tickets</h1>
          <p className="text-muted-foreground">Manage and track all support tickets</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tickets, users, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-border text-foreground"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-muted border-border text-foreground">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <Card className="glass-panel border-border">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className={`p-6 hover:bg-muted/50 transition-colors ${
                  index !== filteredTickets.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("-", " ")}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <span className="text-sm text-muted-foreground">#{ticket.id}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Requester: {ticket.requester}</span>
                      {ticket.assignedTo && <span>Assigned: {ticket.assignedTo}</span>}
                      <span>Category: {ticket.category}</span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewTicket?.(ticket.id)}
                      className="border-border hover:bg-accent"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-border hover:bg-accent bg-transparent">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case "tickets":
        return renderTickets()
      case "analytics":
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Detailed analytics and reporting coming soon...</p>
          </div>
        )
      case "users":
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">User Management</h2>
            <p className="text-muted-foreground">User management features coming soon...</p>
          </div>
        )
      default:
        return renderOverview()
    }
  }

  return (
    <MainLayout userRole="admin" onLogout={onLogout}>
      <div className="p-6">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">All Tickets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value={currentView} className="mt-0">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

export default AdminDashboard
