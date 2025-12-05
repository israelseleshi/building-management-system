"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useNotifications } from "@/hooks/useNotifications"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  Trash2,
  CheckCheck,
  DollarSign,
  AlertCircle,
  Home,
  Wrench,
  Bell,
} from "lucide-react"

const notificationIcons: Record<string, React.ReactNode> = {
  payment: <DollarSign className="w-5 h-5 text-emerald-600" />,
  inquiry: <MessageSquare className="w-5 h-5 text-blue-600" />,
  message: <MessageSquare className="w-5 h-5 text-purple-600" />,
  maintenance: <Wrench className="w-5 h-5 text-orange-600" />,
  listing: <Home className="w-5 h-5 text-cyan-600" />,
  system: <AlertCircle className="w-5 h-5 text-gray-600" />,
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-50 border-l-4 border-l-blue-500",
  normal: "bg-gray-50 border-l-4 border-l-gray-500",
  high: "bg-yellow-50 border-l-4 border-l-yellow-500",
  urgent: "bg-red-50 border-l-4 border-l-red-500",
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <NotificationsContent />
    </ProtectedRoute>
  )
}

function NotificationsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRead, setFilterRead] = useState<string>("all")
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false,
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false,
    },
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

  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = filterType === "all" || notif.type === filterType
    const matchesRead = filterRead === "all" || (filterRead === "unread" ? !notif.is_read : notif.is_read)
    const matchesSearch = searchQuery === "" || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesRead && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Notifications"
          subtitle="Manage all your notifications and alerts"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{
                backgroundColor: 'var(--card)',
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-muted-foreground mb-1">Total Notifications</Text>
                  <Heading level={3} className="text-2xl font-bold">{notifications.length}</Heading>
                </div>
                <Bell className="w-8 h-8 text-gray-400 opacity-50" />
              </div>
            </div>

            <div
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{
                backgroundColor: 'var(--card)',
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-muted-foreground mb-1">Unread</Text>
                  <Heading level={3} className="text-2xl font-bold text-blue-600">{unreadCount}</Heading>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>

            <div
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{
                backgroundColor: 'var(--card)',
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-muted-foreground mb-1">Read</Text>
                  <Heading level={3} className="text-2xl font-bold text-emerald-600">
                    {notifications.filter(n => n.is_read).length}
                  </Heading>
                </div>
                <CheckCheck className="w-8 h-8 text-emerald-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="flex gap-2 flex-1">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="inquiry">Inquiries</option>
                <option value="message">Messages</option>
                <option value="maintenance">Maintenance</option>
                <option value="listing">Listings</option>
                <option value="system">System</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="whitespace-nowrap"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="pt-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <Heading level={3} className="mb-2">No notifications</Heading>
                <Text className="text-muted-foreground">
                  {notifications.length === 0
                    ? "You're all caught up! No notifications yet."
                    : "No notifications match your filters."}
                </Text>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl p-5 md:p-6 border-0 cursor-pointer transition-all hover:shadow-md ${
                    !notification.is_read ? "border-l-4 border-l-blue-500" : ""
                  } ${priorityColors[notification.priority]}`}
                  style={{
                    backgroundColor: 'var(--card)',
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
                  }}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id)
                    }
                    if (notification.action_url) {
                      router.push(notification.action_url)
                    }
                  }}
                >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {notificationIcons[notification.type] || (
                          <AlertCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Heading level={4} className="text-sm font-semibold">
                              {notification.title}
                            </Heading>
                            {!notification.is_read && (
                              <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                            )}
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {notification.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                notification.priority === "urgent"
                                  ? "bg-red-50 text-red-700"
                                  : notification.priority === "high"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : ""
                              }`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </Button>
                        </div>

                        <Text className="text-sm text-foreground mb-2">
                          {notification.message}
                        </Text>

                        <Text className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </Text>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Toaster />
    </div>
  )
}
