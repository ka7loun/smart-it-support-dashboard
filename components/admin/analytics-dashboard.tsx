"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react"

// Mock data for charts
const ticketTrendsData = [
  { name: "Mon", total: 12, resolved: 8 },
  { name: "Tue", total: 18, resolved: 12 },
  { name: "Wed", total: 15, resolved: 10 },
  { name: "Thu", total: 25, resolved: 18 },
  { name: "Fri", total: 20, resolved: 15 },
  { name: "Sat", total: 8, resolved: 7 },
  { name: "Sun", total: 5, resolved: 4 },
]

const categoryData = [
  { name: "Network", value: 35 },
  { name: "Software", value: 25 },
  { name: "Hardware", value: 20 },
  { name: "Access", value: 15 },
  { name: "Other", value: 5 },
]

const resolutionTimeData = [
  { name: "Network", time: 4.2 },
  { name: "Software", time: 2.8 },
  { name: "Hardware", time: 6.5 },
  { name: "Access", time: 1.5 },
  { name: "Other", time: 3.2 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-white/70">Monitor performance metrics and identify trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 backdrop-blur-md border-white/20">
            <SelectItem value="24h" className="text-white hover:bg-white/10">
              Last 24 Hours
            </SelectItem>
            <SelectItem value="7d" className="text-white hover:bg-white/10">
              Last 7 Days
            </SelectItem>
            <SelectItem value="30d" className="text-white hover:bg-white/10">
              Last 30 Days
            </SelectItem>
            <SelectItem value="90d" className="text-white hover:bg-white/10">
              Last Quarter
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-white/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">Average Resolution Time</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-white">3.5</h3>
                  <span className="text-white/70 ml-1">hours</span>
                </div>
                <div className="flex items-center mt-2">
                  <ArrowDownRight className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs font-medium">12% improvement</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">First Response Time</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-white">28</h3>
                  <span className="text-white/70 ml-1">minutes</span>
                </div>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-3 h-3 text-red-400 mr-1" />
                  <span className="text-red-400 text-xs font-medium">5% slower</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-yellow-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">Resolution Rate</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-white">94</h3>
                  <span className="text-white/70 ml-1">%</span>
                </div>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs font-medium">2% improvement</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">AI Resolution Rate</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-white">42</h3>
                  <span className="text-white/70 ml-1">%</span>
                </div>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs font-medium">8% improvement</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="bg-white/5 backdrop-blur-sm">
          <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Ticket Trends
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Issue Categories
          </TabsTrigger>
          <TabsTrigger value="resolution" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Resolution Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-0">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Ticket Volume & Resolution</CardTitle>
              <CardDescription className="text-white/70">
                Number of tickets created vs resolved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    total: {
                      label: "Total Tickets",
                      color: "hsl(var(--chart-1))",
                    },
                    resolved: {
                      label: "Resolved Tickets",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ticketTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--color-total)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="var(--color-resolved)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-0">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Issue Categories Distribution</CardTitle>
              <CardDescription className="text-white/70">Breakdown of tickets by issue type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    value: {
                      label: "Number of Tickets",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolution" className="space-y-0">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Average Resolution Time by Category</CardTitle>
              <CardDescription className="text-white/70">
                Time taken to resolve issues by category (in hours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    time: {
                      label: "Hours",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resolutionTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="time" fill="var(--color-time)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription className="text-white/70">
            Automatically detected patterns and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border-l-4 border-yellow-400">
            <h4 className="text-white font-medium mb-1">Potential Network Issue Detected</h4>
            <p className="text-white/80 text-sm">
              There's been a 35% increase in network-related tickets from the Marketing department in the last 48 hours.
              Consider checking the network switches on the 3rd floor.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="text-white font-medium mb-1">Knowledge Base Opportunity</h4>
            <p className="text-white/80 text-sm">
              20% of all tickets this week relate to VPN connection issues. Consider creating a detailed troubleshooting
              guide in the knowledge base to reduce ticket volume.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="text-white font-medium mb-1">Resource Allocation Suggestion</h4>
            <p className="text-white/80 text-sm">
              Monday mornings show 40% higher ticket volume. Consider scheduling additional support staff during this
              peak period to maintain response times.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
