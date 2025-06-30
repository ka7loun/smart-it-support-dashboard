"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, FileText, Video, ThumbsUp, ArrowRight, Clock } from "lucide-react"

interface ArticleProps {
  title: string
  description: string
  category: string
  views: number
  helpful: number
  date: string
  type: "text" | "video" | "guide"
}

const articles: ArticleProps[] = [
  {
    title: "How to Reset Your Password",
    description: "Step-by-step guide to reset your password through the company portal",
    category: "Access",
    views: 1245,
    helpful: 92,
    date: "2023-12-15",
    type: "guide",
  },
  {
    title: "Connecting to the VPN",
    description: "Instructions for setting up and troubleshooting VPN connections",
    category: "Network",
    views: 987,
    helpful: 88,
    date: "2024-01-10",
    type: "text",
  },
  {
    title: "Setting Up Multi-Factor Authentication",
    description: "Learn how to secure your account with MFA",
    category: "Security",
    views: 756,
    helpful: 95,
    date: "2024-01-05",
    type: "video",
  },
  {
    title: "Troubleshooting Printer Issues",
    description: "Common printer problems and their solutions",
    category: "Hardware",
    views: 1102,
    helpful: 85,
    date: "2023-11-28",
    type: "guide",
  },
  {
    title: "Installing Approved Software",
    description: "Process for requesting and installing company-approved software",
    category: "Software",
    views: 632,
    helpful: 79,
    date: "2024-01-18",
    type: "text",
  },
  {
    title: "Email Troubleshooting Guide",
    description: "Solutions for common email issues and errors",
    category: "Software",
    views: 1532,
    helpful: 91,
    date: "2023-12-05",
    type: "guide",
  },
]

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && article.type === activeTab
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-5 h-5 text-blue-400" />
      case "video":
        return <Video className="w-5 h-5 text-red-400" />
      case "guide":
        return <BookOpen className="w-5 h-5 text-green-400" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-white/70">Find solutions to common IT issues</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <Input
          placeholder="Search for solutions, guides, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary text-lg"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="bg-white/5 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              All Resources
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Articles
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Step-by-Step Guides
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Video Tutorials
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-0">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <Card
                  key={index}
                  className="glass-panel border-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-white/5">{getTypeIcon(article.type)}</div>
                      <Badge
                        className={`${
                          article.category === "Network"
                            ? "bg-blue-500/20 text-blue-400"
                            : article.category === "Security"
                              ? "bg-red-500/20 text-red-400"
                              : article.category === "Hardware"
                                ? "bg-orange-500/20 text-orange-400"
                                : article.category === "Software"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-white mt-3">{article.title}</CardTitle>
                    <CardDescription className="text-white/70">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{article.helpful}% helpful</span>
                      </div>
                    </div>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
              <p className="text-white/70 max-w-md mx-auto">
                We couldn't find any resources matching your search. Try using different keywords or browse all
                categories.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Popular Topics */}
      <div className="mt-8">
        <h3 className="text-xl font-medium text-white mb-4">Popular Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Password Reset",
            "Email Issues",
            "VPN Access",
            "Printer Setup",
            "Software Installation",
            "Network Connectivity",
            "Account Access",
            "Mobile Device",
          ].map((topic, index) => (
            <Button
              key={index}
              variant="outline"
              className="border-white/20 text-white/90 hover:bg-white/10 hover:text-white justify-start"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {topic}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
