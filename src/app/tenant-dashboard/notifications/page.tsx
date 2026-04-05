"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Bell,
  CheckCheck,
  Trash2,
  DollarSign,
  Calendar,
  Home,
  FileText,
  MessageSquare,
  Wrench,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

type NotificationType = "payment" | "reminder" | "maintenance" | "document" | "message" | "system"
type Priority = "low" | "normal" | "high" | "urgent"

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: Priority
  is_read: boolean
  created_at: string
  action_url?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Rent Payment Due Soon",
    message: "Your rent payment for April 2026 is due in 5 days. Please ensure you have sufficient funds.",
    type: "payment",
    priority: "high",
    is_read: false,
    created_at: "2026-04-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Payment Received - Thank You",
    message: "We have received your rent payment of 15,000 ETB for March 2026. Thank you!",
    type: "payment",
    priority: "normal",
    is_read: true,
    created_at: "2026-03-01T14:30:00Z"
  },
  {
    id: "3",
    title: "Maintenance Update",
    message: "Your maintenance request for the bathroom faucet has been completed. Please verify the work.",
    type: "maintenance",
    priority: "normal",
    is_read: false,
    created_at: "2026-04-03T09:15:00Z",
    action_url: "/tenant-dashboard/maintenance"
  },
  {
    id: "4",
    title: "New Lease Document",
    message: "Your landlord has uploaded a new lease agreement. Please review and sign.",
    type: "document",
    priority: "high",
    is_read: false,
    created_at: "2026-04-02T11:00:00Z",
    action_url: "/tenant-dashboard/documents"
  },
  {
    id: "5",
    title: "Message from Property Management",
    message: "You have a new message regarding your recent maintenance request.",
    type: "message",
    priority: "normal",
    is_read: true,
    created_at: "2026-03-28T16:45:00Z",
    action_url: "/tenant-dashboard/chat"
  },
  {
    id: "6",
    title: "Scheduled Inspection",
    message: "A routine property inspection is scheduled for next week. Please ensure access.",
    type: "reminder",
    priority: "normal",
    is_read: false,
    created_at: "2026-04-04T08:00:00Z"
  },
  {
    id: "7",
    title: "Building Maintenance Notice",
    message: "Water supply will be temporarily interrupted on Saturday for maintenance work.",
    type: "system",
    priority: "high",
    is_read: true,
    created_at: "2026-03-25T12:00:00Z"
  },
  {
    id: "8",
    title: "Rent Increase Notice",
    message: "Your landlord has sent information about the upcoming rent adjustment.",
    type: "system",
    priority: "urgent",
    is_read: false,
    created_at: "2026-04-05T07:30:00Z"
  }
]

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  payment: <DollarSign className="w-5 h-5 text-emerald-600" />,
  reminder: <Calendar className="w-5 h-5 text-blue-600" />,
  maintenance: <Wrench className="w-5 h-5 text-orange-600" />,
  document: <FileText className="w-5 h-5 text-purple-600" />,
  message: <MessageSquare className="w-5 h-5 text-cyan-600" />,
  system: <AlertCircle className="w-5 h-5 text-gray-600" />
}

const priorityStyles: Record<Priority, { bg: string, border: string, badge: string }> = {
  low: { bg: "bg-blue-50", border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700" },
  normal: { bg: "bg-gray-50", border: "border-l-gray-400", badge: "bg-gray-100 text-gray-700" },
  high: { bg: "bg-yellow-50", border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
  urgent: { bg: "bg-red-50", border: "border-l-red-500", badge: "bg-red-100 text-red-700" }
}

export default function TenantNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantNotificationsContent />
    </ProtectedRoute>
  )
}

function TenantNotificationsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRead, setFilterRead] = useState<string>("all")
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const t = useTranslations("Tenant")

  const navItems = [
    { icon: <Home className="w-5 h-5" />, name: t("nav.dashboard"), path: "/tenant-dashboard", active: false },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.listings"), path: "/tenant-dashboard/listings", active: false },
    { icon: <DollarSign className="w-5 h-5" />, name: t("nav.myRents"), path: "/tenant-dashboard/leases", active: false },
    { icon: <Bell className="w-5 h-5" />, name: "Notifications", path: "/tenant-dashboard/notifications", active: true },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.documents"), path: "/tenant-dashboard/documents", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: t("nav.chat"), path: "/tenant-dashboard/chat", active: false },
  ]

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
          searchPlaceholder="Search notifications..."
        />

        <div className="flex-1 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="maintenance">Maintenance</option>
                <option value="document">Documents</option>
                <option value="message">Messages</option>
                <option value="system">System</option>
              </select>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterType !== "all" || filterRead !== "all"
                  ? "Try adjusting your filters"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const styles = priorityStyles[notification.priority]
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${styles.bg} ${styles.border} transition-all hover:shadow-md ${
                      !notification.is_read ? 'bg-card shadow-sm' : 'bg-card/60'
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center">
                      {notificationIcons[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-semibold text-foreground ${!notification.is_read ? 'text-base' : 'text-sm'}`}>
                            {notification.title}
                            {!notification.is_read && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${styles.badge} flex-shrink-0`}>
                          {notification.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </span>
                        {notification.action_url && (
                          <button
                            onClick={() => router.push(notification.action_url!)}
                            className="text-xs text-primary hover:underline"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 rounded-lg hover:bg-background transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-lg hover:bg-background transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
