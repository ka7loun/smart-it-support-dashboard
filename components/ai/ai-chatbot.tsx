"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, X, Maximize2, Minimize2, ChevronRight } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface AIChatbotProps {
  initialOpen?: boolean
}

export function AIChatbot({ initialOpen = false }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your IT Support Assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I'll help you troubleshoot that issue. Could you provide more details?",
        "Let me check our knowledge base for solutions to this problem.",
        "I understand your issue. Would you like me to create a support ticket for you?",
        "Have you tried restarting the application? That often resolves this type of problem.",
        "I've found several similar issues in our database. The most common solution is to clear your browser cache.",
      ]
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-600 text-white shadow-lg z-50"
      >
        <Bot className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${isMinimized ? "w-72" : "w-96"}`}
    >
      <Card className="glass-panel border-white/10 shadow-xl overflow-hidden">
        <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-white text-sm font-medium">IT Support Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`flex max-w-[80%] ${
                        msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                      } items-end space-x-2`}
                    >
                      {msg.sender === "ai" && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-primary text-white rounded-br-none"
                            : "bg-white/10 text-white/90 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {msg.sender === "user" && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gray-600 text-white text-xs">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-end space-x-2">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </Avatar>
                      <div className="rounded-2xl px-4 py-3 bg-white/10 text-white/90 rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your IT issue here..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-primary hover:bg-primary-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-white/50 text-center">
                Try asking about common IT issues or type "create ticket" for help
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <CardContent className="p-3">
            <Button
              variant="ghost"
              className="w-full justify-between text-white/90 hover:text-white hover:bg-white/10"
              onClick={() => setIsMinimized(false)}
            >
              <span>Continue conversation</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
