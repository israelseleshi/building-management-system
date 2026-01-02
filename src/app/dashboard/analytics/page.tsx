"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Metric {
  id: string
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  color: string
  bgColor: string
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <AnalyticsContent />
    </ProtectedRoute>
  )
}

function AnalyticsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const timeRanges = [
    { id: "week", label: "Last 7 Days" },
    { id: "month", label: "Last 30 Days" },
    { id: "quarter", label: "Last Quarter" },
    { id: "year", label: "Last Year" },
  ]

  const getDynamicData = () => {
    const dataRanges: Record<string, any> = {
      week: {
        metrics: [
          { id: "revenue", title: "Total Revenue", value: "ETB 245,689", change: "+2.1%", trend: "up", icon: <DollarSign className="w-6 h-6" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
          { id: "listings", title: "Active Listings", value: "38", change: "+0.5%", trend: "up", icon: <Building2 className="w-6 h-6" />, color: "text-blue-600", bgColor: "bg-blue-50" },
          { id: "inquiries", title: "Total Inquiries", value: "89", change: "+8.4%", trend: "up", icon: <Users className="w-6 h-6" />, color: "text-purple-600", bgColor: "bg-purple-50" },
          { id: "views", title: "Property Views", value: "3,456", change: "+1.2%", trend: "up", icon: <Eye className="w-6 h-6" />, color: "text-orange-600", bgColor: "bg-orange-50" },
        ],
        performanceData: [
          { day: "Mon", revenue: 15000, listings: 32, inquiries: 8 },
          { day: "Tue", revenue: 28000, listings: 38, inquiries: 15 },
          { day: "Wed", revenue: 22000, listings: 35, inquiries: 12 },
          { day: "Thu", revenue: 45000, listings: 42, inquiries: 25 },
          { day: "Fri", revenue: 38000, listings: 40, inquiries: 20 },
          { day: "Sat", revenue: 52000, listings: 45, inquiries: 30 },
          { day: "Sun", revenue: 25689, listings: 38, inquiries: 18 },
        ],
      },
      month: {
        metrics: [
          { id: "revenue", title: "Total Revenue", value: "ETB 2,456,890", change: "+12.5%", trend: "up", icon: <DollarSign className="w-6 h-6" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
          { id: "listings", title: "Active Listings", value: "38", change: "+3.2%", trend: "up", icon: <Building2 className="w-6 h-6" />, color: "text-blue-600", bgColor: "bg-blue-50" },
          { id: "inquiries", title: "Total Inquiries", value: "1,247", change: "+18.7%", trend: "up", icon: <Users className="w-6 h-6" />, color: "text-purple-600", bgColor: "bg-purple-50" },
          { id: "views", title: "Property Views", value: "45,892", change: "-2.4%", trend: "down", icon: <Eye className="w-6 h-6" />, color: "text-orange-600", bgColor: "bg-orange-50" },
        ],
        performanceData: [
          { week: "Week 1", revenue: 420000, listings: 30, inquiries: 220 },
          { week: "Week 2", revenue: 580000, listings: 37, inquiries: 315 },
          { week: "Week 3", revenue: 698000, listings: 42, inquiries: 402 },
          { week: "Week 4", revenue: 756890, listings: 45, inquiries: 350 },
        ],
      },
      quarter: {
        metrics: [
          { id: "revenue", title: "Total Revenue", value: "ETB 8,234,567", change: "+28.3%", trend: "up", icon: <DollarSign className="w-6 h-6" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
          { id: "listings", title: "Active Listings", value: "42", change: "+8.1%", trend: "up", icon: <Building2 className="w-6 h-6" />, color: "text-blue-600", bgColor: "bg-blue-50" },
          { id: "inquiries", title: "Total Inquiries", value: "4,892", change: "+34.2%", trend: "up", icon: <Users className="w-6 h-6" />, color: "text-purple-600", bgColor: "bg-purple-50" },
          { id: "views", title: "Property Views", value: "156,789", change: "+15.6%", trend: "up", icon: <Eye className="w-6 h-6" />, color: "text-orange-600", bgColor: "bg-orange-50" },
        ],
        performanceData: [
          { month: "Month 1", revenue: 1856789, listings: 35, inquiries: 1247 },
          { month: "Month 2", revenue: 2678901, listings: 42, inquiries: 1456 },
          { month: "Month 3", revenue: 3698777, listings: 48, inquiries: 2189 },
        ],
      },
      year: {
        metrics: [
          { id: "revenue", title: "Total Revenue", value: "ETB 28,456,890", change: "+45.2%", trend: "up", icon: <DollarSign className="w-6 h-6" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
          { id: "listings", title: "Active Listings", value: "48", change: "+18.5%", trend: "up", icon: <Building2 className="w-6 h-6" />, color: "text-blue-600", bgColor: "bg-blue-50" },
          { id: "inquiries", title: "Total Inquiries", value: "18,247", change: "+67.8%", trend: "up", icon: <Users className="w-6 h-6" />, color: "text-purple-600", bgColor: "bg-purple-50" },
          { id: "views", title: "Property Views", value: "545,892", change: "+89.3%", trend: "up", icon: <Eye className="w-6 h-6" />, color: "text-orange-600", bgColor: "bg-orange-50" },
        ],
        performanceData: [
          { month: "Jan", revenue: 1250000, listings: 28, inquiries: 690 },
          { month: "Feb", revenue: 1650000, listings: 32, inquiries: 820 },
          { month: "Mar", revenue: 1480000, listings: 30, inquiries: 750 },
          { month: "Apr", revenue: 1920000, listings: 35, inquiries: 980 },
          { month: "May", revenue: 2340000, listings: 38, inquiries: 1140 },
          { month: "Jun", revenue: 1980000, listings: 34, inquiries: 1020 },
          { month: "Jul", revenue: 2450000, listings: 40, inquiries: 1467 },
          { month: "Aug", revenue: 2870000, listings: 44, inquiries: 1789 },
          { month: "Sep", revenue: 3190000, listings: 47, inquiries: 2240 },
          { month: "Oct", revenue: 2980000, listings: 45, inquiries: 2023 },
          { month: "Nov", revenue: 2560000, listings: 42, inquiries: 1887 },
          { month: "Dec", revenue: 3856890, listings: 48, inquiries: 3456 },
        ],
      },
    }

    return dataRanges[timeRange as keyof typeof dataRanges]
  }

  const currentData = getDynamicData()

  const exportToCSV = () => {
    const headers = ["Period", "Revenue", "Listings", "Inquiries"]
    const csvContent = [
      headers.join(","),
      ...currentData.performanceData.map((item: any) => {
        const period = Object.keys(item)[0]
        const data = item as any
        return `${data[period]},${data.revenue},${data.listings},${data.inquiries}`
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `analytics_${timeRange}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const demographicData = [
    { category: "Commercial", percentage: 45, count: 17 },
    { category: "Office", percentage: 30, count: 11 },
    { category: "Retail", percentage: 15, count: 6 },
    { category: "Warehouse", percentage: 10, count: 4 },
  ]

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard", active: false },
    { icon: <Building2 className="w-5 h-5" />, name: "My Listings", path: "/dashboard/listings", active: false },
    { icon: <PlusCircle className="w-5 h-5" />, name: "Create Listing", path: "/dashboard/create", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat", active: false },
    { icon: <Users className="w-5 h-5" />, name: "Reports", path: "/dashboard/reports", active: false },
    { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts", active: false },
    { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics", active: true },
    { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings", active: false },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Analytics"
          subtitle="Track your property performance and market insights"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Time Range & Export */}
            <div className="flex justify-between items-center">
              <div>
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {timeRanges.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <Button onClick={exportToCSV} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentData.metrics.map((metric: Metric) => (
                <div key={metric.id} className="rounded-2xl p-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>{metric.icon}</div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                      {metric.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {metric.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{metric.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Heading level={3} className="text-lg font-bold text-foreground">
                      Revenue Overview
                    </Heading>
                    <Text className="text-sm text-muted-foreground">Performance trends</Text>
                  </div>
                  <div className="flex gap-2">
                    {["revenue", "listings", "inquiries"].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedMetric === metric
                            ? "bg-emerald-600 text-white"
                            : "text-muted-foreground hover:bg-background"
                        }`}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {currentData.performanceData.map((data: any, index: number) => {
                    const periodKey = Object.keys(data)[0]
                    const periodLabel = data[periodKey]
                    const metricValue = data[selectedMetric as keyof typeof data] as number
                    const maxValue = Math.max(...currentData.performanceData.map((d: any) => d[selectedMetric as keyof typeof d] as number))
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-emerald-600 rounded-t-lg transition-all duration-300 hover:bg-emerald-700"
                          style={{
                            height: `${(metricValue / maxValue) * 100}%`,
                            minHeight: "20px",
                          }}
                        />
                        <span className="text-xs text-muted-foreground">{periodLabel}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Property Distribution */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div className="mb-6">
                  <Heading level={3} className="text-lg font-bold text-foreground">
                    Property Distribution
                  </Heading>
                  <Text className="text-sm text-muted-foreground">Breakdown by property type</Text>
                </div>
                <div className="space-y-4">
                  {demographicData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index],
                          }}
                        />
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index],
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

              {/* Market Trends */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
              <div className="mb-6">
                <Heading level={3} className="text-lg font-bold text-foreground">
                  Market Trends
                </Heading>
                <Text className="text-sm text-muted-foreground">Addis Ababa real estate insights</Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Average Rent/sqm</p>
                    <p className="text-sm text-muted-foreground">Commercial properties</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">ETB 450</p>
                    <p className="text-xs text-emerald-600">+5.2% vs last month</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Occupancy Rate</p>
                    <p className="text-sm text-muted-foreground">City average</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">87.3%</p>
                    <p className="text-xs text-emerald-600">+2.1% vs last month</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Days on Market</p>
                    <p className="text-sm text-muted-foreground">Average listing time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">42 days</p>
                    <p className="text-xs text-red-600">-3 days vs last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
