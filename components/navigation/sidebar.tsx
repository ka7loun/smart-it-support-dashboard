"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Ticket,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bot,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "user"
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: any
  badge?: string
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "My Tickets",
    href: "/tickets",
    icon: Ticket,
    badge: "3",
  },
  {
    title: "Create Ticket",
    href: "/tickets/new",
    icon: FileText,
  },
  {
    title: "AI Assistant",
    href: "/ai-chat",
    icon: Bot,
  },
  {
    title: "Knowledge Base",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    title: "All Tickets",
    href: "/admin/tickets",
    icon: AlertTriangle,
    adminOnly: true,
    badge: "12",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    title: "Recent Activity",
    href: "/activity",
    icon: Clock,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
]

export function Sidebar({ userRole, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || userRole === "admin")

  return (
    <div
      className={cn(
        "relative flex flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-leoni-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Leoni IT</h2>
              <p className="text-xs text-muted-foreground">Support Portal</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed && "justify-center px-2",
                    isActive && "bg-leoni-accent/10 text-leoni-accent border-leoni-accent/20",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Badge
              variant={userRole === "admin" ? "default" : "secondary"}
              className={userRole === "admin" ? "bg-leoni-accent" : ""}
            >
              {userRole === "admin" ? "Administrator" : "User"}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
