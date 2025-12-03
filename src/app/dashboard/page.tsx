"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heading, Text, MutedText, Large } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Building2
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

  const metrics = [
    {
      title: "Tenants",
      value: "385",
      change: "+11.01%",
      trend: "up",
      color: "success"
    },
    {
      title: "Vacant Units", 
      value: "97",
      change: "-9.05%",
      trend: "down",
      color: "error"
    },
    {
      title: "Active Listings",
      value: "24",
      change: "+4 this month",
      trend: "up",
      color: "success"
    },
    {
      title: "Revenue",
      value: "$48,500",
      change: "+15.3% from last month",
      trend: "up",
      color: "success"
    }
  ]

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

  const handleNavigation = (path: string) => {
    router.push(path)
  }

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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`bg-card min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-[290px]'
        }`}
        style={{ 
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-muted"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <nav className={`px-4 pb-6 ${isSidebarCollapsed ? 'px-2' : ''}`}>
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`menu-item w-full mb-2 transition-all duration-200 ${
                item.active ? 'menu-item-active' : 'menu-item-inactive'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <span className={`${item.active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'} ${
                isSidebarCollapsed ? 'mx-auto' : ''
              }`}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={`px-4 pb-6 mt-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
          <button 
            onClick={handleLogout}
            className={`menu-item w-full transition-all duration-200 hover:bg-red-50 ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isSidebarCollapsed ? "Log Out" : ''}
          >
            <span className={`${isSidebarCollapsed ? 'mx-auto' : ''}`} style={{ color: '#DC2626' }}>
              <LogOut className="w-5 h-5" />
            </span>
            {!isSidebarCollapsed && (
              <span className="ml-3" style={{ color: '#DC2626' }}>Log Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header 
          className="bg-card"
          style={{ 
            boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              {/* Welcome text removed */}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Bell className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/landlord.png" alt="Landlord" />
                      <AvatarFallback>LL</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <Text weight="medium" className="text-foreground">Landlord</Text>
                      <Text size="sm" className="text-muted-foreground">landlord@bms.com</Text>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

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
