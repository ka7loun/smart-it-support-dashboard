"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  ticketId?: string
  userId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Ticket Updated",
      message: "Your ticket #TK-001 has been assigned to Tech Team A",
      type: "info",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      ticketId: "TK-001",
    },
    {
      id: "2",
      title: "Ticket Resolved",
      message: "Your ticket #TK-002 has been marked as resolved",
      type: "success",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      ticketId: "TK-002",
    },
    {
      id: "3",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 2-4 AM",
      type: "warning",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
  ])

  const { toast } = useToast()

  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
      const notification: Notification = {
        ...notificationData,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [notification, ...prev])

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "error" ? "destructive" : "default",
      })

      // Play notification sound
      if (typeof window !== "undefined") {
        try {
          const audio = new Audio("/notification-sound.mp3")
          audio.volume = 0.3
          audio.play().catch(() => {
            // Fallback: create a simple beep sound
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)
          })
        } catch (error) {
          console.log("Could not play notification sound")
        }
      }
    },
    [toast],
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        unreadCount,
      }}
    >
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
