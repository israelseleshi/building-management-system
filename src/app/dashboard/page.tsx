"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heading, Text, Large, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { supabase } from "@/lib/supabaseClient"
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Settings,
  Building2,
  Users
} from "lucide-react"

export default function LandlordDashboard() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [metrics, setMetrics] = useState([
    { title: "Tenants", value: "0", change: "+0%", trend: "up", color: "success" },
    { title: "Vacant Units", value: "0", change: "+0%", trend: "down", color: "error" },
    { title: "Active Listings", value: "0", change: "+0 this month", trend: "up", color: "success" },
    { title: "Revenue", value: "$0", change: "+0% from last month", trend: "up", color: "success" }
  ])
  const [loading, setLoading] = useState(true)

  // Fetch dashboard metrics from Supabase
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)

        if (error) throw error

        const properties = data || []
        const totalRevenue = properties.reduce((sum: number, prop: any) => sum + (prop.monthly_rent || 0), 0)
        const activeListings = properties.length

        setMetrics([
          {
            title: "Tenants",
            value: activeListings.toString(),
            change: "+11.01%",
            trend: "up",
            color: "success"
          },
          {
            title: "Vacant Units",
            value: Math.max(0, Math.floor(activeListings * 0.25)).toString(),
            change: "-9.05%",
            trend: "down",
            color: "error"
          },
          {
            title: "Active Listings",
            value: activeListings.toString(),
            change: "+4 this month",
            trend: "up",
            color: "success"
          },
          {
            title: "Revenue",
            value: `$${(totalRevenue / 1000).toFixed(1)}K`,
            change: "+15.3% from last month",
            trend: "up",
            color: "success"
          }
        ])
      } catch (err) {
        console.error('Error fetching metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: true
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: false
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false
    }
  ]

  const handleLogout = () => {
    // Clear authentication state from localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    
    // Clear authentication state from cookies
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    // Redirect to sign-in page
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          onNavigate={handleSidebarNavigation}
        />

        <div className="flex-1 transition-all duration-300 ease-in-out">
          <DashboardHeader
            title="Dashboard"
            subtitle="Loading your dashboard..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="p-6 flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Text className="text-muted-foreground">Loading dashboard metrics...</Text>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome back to your landlord dashboard"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {metrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className="rounded-2xl p-5 md:p-6 border-0"
                    style={{ 
                      backgroundColor: 'var(--card)', 
                      boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                    }}
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <Text size="sm" className="text-muted-foreground">
                          {metric.title}
                        </Text>
                        <Large className="mt-2" style={{ color: 'var(--foreground)' }}>
                          {metric.value}
                        </Large>
                      </div>
                      <Badge 
                        variant={metric.color === 'success' ? 'default' : 'destructive'}
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <RevenueChart />

              {/* Recent Activity */}
              <div 
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Heading level={3} className="text-foreground">Recent Activity</Heading>
                    <MutedText className="mt-1">Latest updates from your properties</MutedText>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <Text weight="medium" className="text-foreground">New tenant application received</Text>
                      <MutedText>Apartment 2A - 2 hours ago</MutedText>
                    </div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <Text weight="medium" className="text-foreground">Maintenance request submitted</Text>
                      <MutedText>Unit 3B - Plumbing issue - 4 hours ago</MutedText>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <Text weight="medium" className="text-foreground">Rent payment received</Text>
                      <MutedText>John Doe - Studio 5 - 1 day ago</MutedText>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-4">
              {/* Quick Actions */}
              <div 
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Heading level={3} className="text-foreground">Quick Actions</Heading>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                    style={{ 
                      backgroundColor: '#7D8B6F', 
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Listing
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                    style={{ 
                      backgroundColor: 'transparent',
                      color: '#7D8B6F',
                      border: '2px solid #7D8B6F',
                      boxShadow: '0 4px 12px rgba(125, 139, 111, 0.2)'
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Messages
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                    style={{ 
                      backgroundColor: 'transparent',
                      color: '#7D8B6F',
                      border: '2px solid #7D8B6F',
                      boxShadow: '0 4px 12px rgba(125, 139, 111, 0.2)'
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Request Payout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
