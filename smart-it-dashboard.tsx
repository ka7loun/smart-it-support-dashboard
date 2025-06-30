"use client"

import { useState } from "react"
import { LoginPage } from "./components/auth/login-page"
import { UserDashboard } from "./components/user/user-dashboard"
import { AdminDashboard } from "./components/admin/admin-dashboard"
import { TicketDetailPage } from "./components/tickets/ticket-detail"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "./components/theme/theme-provider"
import { NotificationProvider } from "./components/notifications/notification-provider"
import Image from "next/image"
import { Shield, Users, Ticket, BarChart3 } from "lucide-react"
import { EnhancedAIChatbot } from "./components/ai/enhanced-ai-chatbot"

type PageType = "demo" | "login" | "user-dashboard" | "admin-dashboard" | "ticket-detail"
type UserRole = "admin" | "user" | null

export default function SmartITDashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("demo")
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (role: UserRole) => {
    setUserRole(role)
    setIsAuthenticated(true)
    if (role === "admin") {
      setCurrentPage("admin-dashboard")
    } else {
      setCurrentPage("user-dashboard")
    }
  }

  const handleLogout = () => {
    setUserRole(null)
    setIsAuthenticated(false)
    setCurrentPage("demo")
    setSelectedTicketId(null)
  }

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setCurrentPage("ticket-detail")
  }

  const handleBackToTickets = () => {
    if (userRole === "admin") {
      setCurrentPage("admin-dashboard")
    } else {
      setCurrentPage("user-dashboard")
    }
    setSelectedTicketId(null)
  }

  const renderPage = () => {
    // Only show authenticated pages if user is actually authenticated
    if (isAuthenticated && userRole) {
      switch (currentPage) {
        case "user-dashboard":
          return <UserDashboard onLogout={handleLogout} onViewTicket={handleViewTicket} />
        case "admin-dashboard":
          return <AdminDashboard onLogout={handleLogout} onViewTicket={handleViewTicket} />
        case "ticket-detail":
          return (
            <TicketDetailPage
              ticketId={selectedTicketId}
              userRole={userRole}
              onLogout={handleLogout}
              onBack={handleBackToTickets}
            />
          )
        default:
          return <UserDashboard onLogout={handleLogout} onViewTicket={handleViewTicket} />
      }
    }

    // Show login page
    if (currentPage === "login") {
      return <LoginPage onLogin={handleLogin} />
    }

    // Show demo/landing page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <Image src="/logo-leoni.svg" alt="Leoni Logo" width={180} height={50} priority />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-4">Smart IT Support Assistant</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                AI-powered IT helpdesk platform for efficient support management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50 border-border hover:border-leoni-accent/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Ticket className="w-5 h-5 mr-2 text-leoni-accent" />
                      Smart Ticketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Submit and track support tickets</li>
                      <li>• Automated priority assignment</li>
                      <li>• Real-time status updates</li>
                      <li>• File attachments support</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border hover:border-leoni-accent/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Users className="w-5 h-5 mr-2 text-leoni-accent" />
                      Role-Based Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Employee portal for ticket submission</li>
                      <li>• Admin dashboard for IT staff</li>
                      <li>• Secure authentication</li>
                      <li>• Permission-based features</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border hover:border-leoni-accent/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-leoni-accent" />
                      Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Performance dashboards</li>
                      <li>• Ticket volume tracking</li>
                      <li>• Response time metrics</li>
                      <li>• Team productivity insights</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border hover:border-leoni-accent/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-leoni-accent" />
                      AI-Powered Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Intelligent ticket categorization</li>
                      <li>• Automated responses</li>
                      <li>• Smart routing to technicians</li>
                      <li>• Knowledge base suggestions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center space-y-4">
                <p className="text-foreground/90">Try the Smart IT Support platform:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setCurrentPage("login")}
                    className="bg-leoni-blue hover:bg-leoni-navy text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    🔐 Login
                  </Button>
                  <Button
                    onClick={() => handleLogin("user")}
                    className="bg-leoni-accent hover:bg-leoni-accent/80 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    👤 User Demo
                  </Button>
                  <Button
                    onClick={() => handleLogin("admin")}
                    className="bg-leoni-blue hover:bg-leoni-navy text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    👨‍💼 Admin Demo
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <EnhancedAIChatbot
                  userContext={{
                    role: userRole || undefined,
                    ticketHistory: [],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="leoni-ui-theme">
      <NotificationProvider>{renderPage()}</NotificationProvider>
    </ThemeProvider>
  )
}
