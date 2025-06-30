"use client"

import type { ReactNode } from "react"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { useTheme } from "next-themes"

interface MainLayoutProps {
  children: ReactNode
  userRole?: "admin" | "user"
  userName?: string
  userEmail?: string
}

export function MainLayout({
  children,
  userRole = "user",
  userName = "User",
  userEmail = "user@example.com",
}: MainLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen bg-background ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar userRole={userRole} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header userName={userName} userEmail={userEmail} userRole={userRole} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
