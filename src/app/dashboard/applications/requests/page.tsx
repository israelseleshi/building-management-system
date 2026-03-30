"use client"

import { type CSSProperties, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import {
  Bell,
  AlignLeft,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  MessageSquare,
} from "lucide-react"

const theme: Record<string, string> = {
  primary: "#3498DB",
  success: "#4DB6A1",
  warning: "#F5A24E",
  danger: "#E15949",
  neutral: "#B7C6D1",
  background: "#E9EDF3",
  card: "#FFFFFF",
  ink: "#1F3549",
  muted: "#7B8C9D",
  line: "#D9E1E8",
  tableHead: "#F5F8FB",
  tabActive: "#3096DA",
}

type RequestStatus = "Sent" | "Viewed" | "Completed" | "Expired"
type Channel = "Email" | "SMS" | "In-App"

interface Request {
  id: string
  recipientName: string
  recipientEmail: string
  property: string
  template: string
  channel: Channel
  status: RequestStatus
  sentAt: string
  responseAt?: string
}

const requests: Request[] = [
  {
    id: "req_001",
    recipientName: "John Anderson",
    recipientEmail: "john.anderson@email.com",
    property: "Park Place Apartments",
    template: "Standard Rental Application",
    channel: "Email",
    status: "Completed",
    sentAt: "Mar 15, 2024 10:30 AM",
    responseAt: "Mar 15, 2024 2:45 PM",
  },
  {
    id: "req_002",
    recipientName: "Sarah Mitchell",
    recipientEmail: "sarah.m@email.com",
    property: "Downtown Lofts",
    template: "Commercial Lease Agreement",
    channel: "Email",
    status: "Viewed",
    sentAt: "Mar 18, 2024 9:15 AM",
  },
  {
    id: "req_003",
    recipientName: "Michael Chen",
    recipientEmail: "+1 555-0123",
    property: "Park View Residences",
    template: "Short-term Rental Application",
    channel: "SMS",
    status: "Sent",
    sentAt: "Mar 20, 2024 3:00 PM",
  },
  {
    id: "req_004",
    recipientName: "Emily Parker",
    recipientEmail: "emily.parker@email.com",
    property: "Harbor Heights",
    template: "Standard Rental Application",
    channel: "In-App",
    status: "Expired",
    sentAt: "Mar 10, 2024 11:00 AM",
  },
]

export default function RequestsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <RequestsContent />
    </ProtectedRoute>
  )
}

function RequestsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" style={{ color: theme.success }} />
      case "Viewed":
        return <Eye className="h-4 w-4" style={{ color: theme.warning }} />
      case "Sent":
        return <Send className="h-4 w-4" style={{ color: theme.primary }} />
      case "Expired":
        return <XCircle className="h-4 w-4" style={{ color: theme.danger }} />
    }
  }

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case "Email":
        return <Mail className="h-4 w-4" />
      case "SMS":
        return <MessageSquare className="h-4 w-4" />
      case "In-App":
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case "Completed":
        return { backgroundColor: "#EAF7F1", color: theme.success }
      case "Viewed":
        return { backgroundColor: "#FFF2E3", color: theme.warning }
      case "Sent":
        return { backgroundColor: "#E8F2FF", color: theme.primary }
      case "Expired":
        return { backgroundColor: "#FDECEA", color: theme.danger }
    }
  }

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{
        backgroundColor: theme.background,
        ["--card" as string]: theme.card,
        ["--background" as string]: theme.background,
        ["--border" as string]: theme.line,
      } as CSSProperties}
    >
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
        onToggleSidebar={toggleSidebar}
        appBrandName="BMS"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
          <div className="flex min-h-[52px] items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Toggle dashboard navigation"
              >
                <AlignLeft className="h-[1.05rem] w-[1.05rem]" />
              </button>
              <div className="truncate text-[0.8rem] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.ink }}>
                Requests Sent
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-[1.05rem] w-[1.05rem]" />
              </button>
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-6"
          style={{
            background:
              "linear-gradient(180deg, #E9EDF3 0%, #E6EBF2 42%, #E3E8EF 100%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1420px]">
            <div className="rounded-xl border px-5 py-4 shadow-[0_6px_18px_rgba(94,118,145,0.05)] md:px-6"
              style={{ backgroundColor: theme.card, borderColor: theme.line }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: theme.ink }}>Sent Application Requests</h2>
                <Button
                  className="h-10 rounded-md px-4 text-[0.82rem] font-medium shadow-sm gap-2"
                  style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                >
                  <Send className="h-4 w-4" />
                  Send New Request
                </Button>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex gap-2">
                  {["All", "Sent", "Viewed", "Completed", "Expired"].map((filter) => (
                    <button
                      key={filter}
                      className="rounded-md px-3 py-1.5 text-[0.75rem] font-medium transition-colors"
                      style={{
                        backgroundColor: filter === "All" ? theme.primary : "transparent",
                        color: filter === "All" ? "#FFFFFF" : theme.muted,
                        border: filter === "All" ? "none" : `1px solid ${theme.line}`,
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border shadow-[0_8px_18px_rgba(94,118,145,0.06)]" style={{ borderColor: theme.line }}>
                <table className="w-full border-collapse">
                  <thead style={{ backgroundColor: theme.tableHead }}>
                    <tr className="border-b" style={{ borderColor: theme.line }}>
                      <th className="px-4 py-3 text-left text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Recipient</th>
                      <th className="px-4 py-3 text-left text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Property</th>
                      <th className="px-4 py-3 text-left text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Template</th>
                      <th className="px-4 py-3 text-center text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Channel</th>
                      <th className="px-4 py-3 text-left text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Sent At</th>
                      <th className="px-4 py-3 text-center text-[0.72rem] font-semibold" style={{ color: theme.muted }}>Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: theme.card }}>
                    {requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b transition-colors hover:bg-slate-50"
                        style={{ borderColor: theme.line }}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-[0.82rem] font-medium" style={{ color: theme.ink }}>{request.recipientName}</div>
                            <div className="text-[0.75rem]" style={{ color: theme.muted }}>{request.recipientEmail}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[0.82rem]" style={{ color: theme.ink }}>{request.property}</td>
                        <td className="px-4 py-4 text-[0.82rem]" style={{ color: theme.muted }}>{request.template}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {getChannelIcon(request.channel)}
                            <span className="text-[0.82rem]" style={{ color: theme.muted }}>{request.channel}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[0.82rem]" style={{ color: theme.muted }}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {request.sentAt}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(request.status)}
                            <span
                              className="inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold"
                              style={getStatusStyle(request.status)}
                            >
                              {request.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Eye({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}
