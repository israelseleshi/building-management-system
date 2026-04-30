"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Home,
  FileText,
  DollarSign,
  Wrench,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  LogOut,
  Plane,
  Thermometer,
  AlertTriangle,
  MoreHorizontal,
  PlaneTakeoff
} from "lucide-react"

type RequestStatus = "pending" | "approved" | "rejected" | "completed"
type LeaveType = "permanent" | "temporary"

interface LeaveRequest {
  id: string
  submitted_at: string
  leave_type: LeaveType
  move_out_date?: string
  start_date?: string
  end_date?: string
  notice_period?: string
  reason: string
  other_reason?: string
  status: RequestStatus
  landlord_response?: string
  response_date?: string
  unit: string
  lease_end_date?: string
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    submitted_at: "2026-03-15",
    leave_type: "permanent",
    move_out_date: "2026-04-30",
    notice_period: "45 days",
    reason: "Relocating to a different city for a new job opportunity.",
    status: "approved",
    landlord_response: "Your request has been approved. We wish you the best in your new position.",
    response_date: "2026-03-17",
    unit: "Unit 205",
    lease_end_date: "2026-04-30"
  },
  {
    id: "2",
    submitted_at: "2026-03-28",
    leave_type: "temporary",
    start_date: "2026-04-10",
    end_date: "2026-04-15",
    reason: "sick",
    status: "pending",
    unit: "Unit 205"
  }
]

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: <Clock className="w-4 h-4" /> },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100", icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: <AlertCircle className="w-4 h-4" /> },
  completed: { label: "Completed", color: "text-blue-700", bg: "bg-blue-100", icon: <CheckCircle2 className="w-4 h-4" /> }
}

const temporaryReasons = [
  { value: "sick", label: "Sick / Medical", icon: <Thermometer className="w-4 h-4" /> },
  { value: "vacation", label: "Vacation / Travel", icon: <Plane className="w-4 h-4" /> },
  { value: "emergency", label: "Emergency / Urgent", icon: <AlertTriangle className="w-4 h-4" /> },
  { value: "other", label: "Other", icon: <MoreHorizontal className="w-4 h-4" /> }
]

const durationPresets = [
  { label: "3-5 days", days: 5 },
  { label: "5-7 days", days: 7 },
  { label: "1-2 weeks", days: 14 },
  { label: "2-4 weeks", days: 28 }
]

export default function TenantLeavePage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantLeaveContent />
    </ProtectedRoute>
  )
}

function TenantLeaveContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [leaveType, setLeaveType] = useState<LeaveType>("permanent")
  const [newRequest, setNewRequest] = useState({
    move_out_date: "",
    notice_period: "30",
    reason: "",
    start_date: "",
    end_date: "",
    duration_days: "",
    other_reason: ""
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmbedded = searchParams.get("embed") === "1"
  const t = useTranslations("Tenant")

  const navItems = [
    { icon: <Home className="w-5 h-5" />, name: t("nav.dashboard"), path: "/tenant-dashboard", active: false },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.listings"), path: "/tenant-dashboard/listings", active: false },
    { icon: <DollarSign className="w-5 h-5" />, name: t("nav.myRents"), path: "/tenant-dashboard/leases", active: false },
    { icon: <Wrench className="w-5 h-5" />, name: t("nav.maintenance"), path: "/tenant-dashboard/maintenance", active: false },
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

  const handleDurationPreset = (days: number) => {
    const start = new Date()
    start.setDate(start.getDate() + 1)
    const end = new Date()
    end.setDate(end.getDate() + days)
    
    setNewRequest({
      ...newRequest,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      duration_days: String(days)
    })
  }

  const handleSubmitRequest = () => {
    if (leaveType === "permanent") {
      if (!newRequest.move_out_date || !newRequest.reason) return
      
      const today = new Date()
      const moveOut = new Date(newRequest.move_out_date)
      const daysDiff = Math.ceil((moveOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      const request: LeaveRequest = {
        id: String(requests.length + 1),
        submitted_at: today.toISOString().split("T")[0],
        leave_type: "permanent",
        move_out_date: newRequest.move_out_date,
        notice_period: `${daysDiff} days`,
        reason: newRequest.reason,
        status: "pending",
        unit: "Unit 205",
        lease_end_date: newRequest.move_out_date
      }
      
      setRequests([request, ...requests])
    } else {
      if (!newRequest.start_date || !newRequest.end_date || !newRequest.reason) return
      if (newRequest.reason === "other" && !newRequest.other_reason) return
      
      const today = new Date()
      const request: LeaveRequest = {
        id: String(requests.length + 1),
        submitted_at: today.toISOString().split("T")[0],
        leave_type: "temporary",
        start_date: newRequest.start_date,
        end_date: newRequest.end_date,
        reason: newRequest.reason === "other" ? newRequest.other_reason : newRequest.reason,
        status: "pending",
        unit: "Unit 205"
      }
      
      setRequests([request, ...requests])
    }
    
    setShowNewRequestModal(false)
    setLeaveType("permanent")
    setNewRequest({
      move_out_date: "",
      notice_period: "30",
      reason: "",
      start_date: "",
      end_date: "",
      duration_days: "",
      other_reason: ""
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const pendingCount = requests.filter(r => r.status === "pending").length
  const permanentCount = requests.filter(r => r.leave_type === "permanent").length
  const temporaryCount = requests.filter(r => r.leave_type === "temporary").length

  const getReasonLabel = (reason: string) => {
    const found = temporaryReasons.find(r => r.value === reason)
    return found ? found.label : reason
  }

  const getRequestTitle = (request: LeaveRequest) => {
    if (request.leave_type === "permanent") {
      return `Permanent Move-Out - ${request.unit}`
    }
    return `Temporary Leave - ${request.unit}`
  }

  const isPermanentFormValid = newRequest.move_out_date && newRequest.reason
  const isTemporaryFormValid = newRequest.start_date && newRequest.end_date && newRequest.reason && (newRequest.reason !== "other" || newRequest.other_reason)

  return (
    <div className={`min-h-screen bg-background ${isEmbedded ? "" : "flex"}`}>
      {!isEmbedded && (
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          onNavigate={handleSidebarNavigation}
        />
      )}

      <div className={isEmbedded ? "" : "flex-1 flex flex-col"}>
        {!isEmbedded && (
          <DashboardHeader
            title="Leave Requests"
            subtitle={pendingCount > 0 ? `${pendingCount} pending request${pendingCount > 1 ? "s" : ""}` : "Manage your property departure requests"}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={toggleSidebar}
            searchPlaceholder="Search requests..."
          />
        )}

        <div className={`flex-1 ${isEmbedded ? "p-4 sm:p-6" : "p-8"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{permanentCount}</p>
                  <p className="text-sm text-muted-foreground">Permanent</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <PlaneTakeoff className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{temporaryCount}</p>
                  <p className="text-sm text-muted-foreground">Temporary</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mb-6">
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Leave Request
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No leave requests</h3>
              <p className="text-muted-foreground mb-4">When you need to leave, submit a leave request here.</p>
              <button
                onClick={() => setShowNewRequestModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Leave Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const statusInfo = statusConfig[request.status]
                const isExpanded = expandedRequest === request.id
                const isPermanent = request.leave_type === "permanent"

                return (
                  <div key={request.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div
                      className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                            {isPermanent ? (
                              <LogOut className={`w-5 h-5 ${statusInfo.color}`} />
                            ) : (
                              <PlaneTakeoff className={`w-5 h-5 ${statusInfo.color}`} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{getRequestTitle(request)}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isPermanent ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                {isPermanent ? "Permanent" : "Temporary"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{request.reason}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {isPermanent ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Move-out: {formatDate(request.move_out_date || "")}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {request.notice_period} notice
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(request.start_date || "")} - {formatDate(request.end_date || "")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border bg-muted/30 p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-3">Request Details</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-medium">{isPermanent ? "Permanent Move-Out" : "Temporary Leave"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Unit</span>
                                <span className="font-medium">{request.unit}</span>
                              </div>
                              {isPermanent && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Lease End Date</span>
                                    <span className="font-medium">{formatDate(request.lease_end_date || "")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Move-out Date</span>
                                    <span className="font-medium">{formatDate(request.move_out_date || "")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Notice Period</span>
                                    <span className="font-medium">{request.notice_period}</span>
                                  </div>
                                </>
                              )}
                              {!isPermanent && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Start Date</span>
                                    <span className="font-medium">{formatDate(request.start_date || "")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">End Date</span>
                                    <span className="font-medium">{formatDate(request.end_date || "")}</span>
                                  </div>
                                </>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Submitted</span>
                                <span className="font-medium">{formatDate(request.submitted_at)}</span>
                              </div>
                              {request.response_date && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Response Date</span>
                                  <span className="font-medium">{formatDate(request.response_date)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-3">Reason</h5>
                            <p className="text-sm text-muted-foreground bg-white p-3 rounded-lg border border-border">
                              {getReasonLabel(request.reason)}
                            </p>
                            {request.landlord_response && (
                              <>
                                <h5 className="text-sm font-semibold text-foreground mt-4 mb-3">Landlord Response</h5>
                                <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
                                  {request.landlord_response}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {request.status === "approved" && request.leave_type === "permanent" && (
                          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <h5 className="text-sm font-semibold text-green-800 mb-2">Next Steps</h5>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Schedule a move-out inspection with the property manager</li>
                              <li>• Clear any outstanding payments before your move-out date</li>
                              <li>• Return all keys and access cards to the management office</li>
                              <li>• Ensure the unit is cleaned and all your belongings are removed</li>
                            </ul>
                          </div>
                        )}

                        {request.status === "approved" && request.leave_type === "temporary" && (
                          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <h5 className="text-sm font-semibold text-blue-800 mb-2">Reminder</h5>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Please return on or before {formatDate(request.end_date || "")}</li>
                              <li>• Ensure your rent payments are up to date</li>
                              <li>• Contact the management office if you need to extend your leave</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">New Leave Request</h2>
                <p className="text-sm text-muted-foreground">Submit your notice to vacate or request temporary leave</p>
              </div>
              <button
                onClick={() => {
                  setShowNewRequestModal(false)
                  setLeaveType("permanent")
                  setNewRequest({
                    move_out_date: "",
                    notice_period: "30",
                    reason: "",
                    start_date: "",
                    end_date: "",
                    duration_days: "",
                    other_reason: ""
                  })
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                <button
                  onClick={() => setLeaveType("permanent")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    leaveType === "permanent"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Permanent Move-Out
                </button>
                <button
                  onClick={() => setLeaveType("temporary")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    leaveType === "temporary"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PlaneTakeoff className="w-4 h-4" />
                  Temporary Leave
                </button>
              </div>

              {leaveType === "permanent" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Intended Move-out Date</label>
                    <input
                      type="date"
                      value={newRequest.move_out_date}
                      onChange={(e) => setNewRequest({ ...newRequest, move_out_date: e.target.value })}
                      min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Must be at least 30 days from today</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Reason for Leaving</label>
                    <textarea
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                      placeholder="Please provide a brief explanation for your decision to leave..."
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Please Note:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Your request will be reviewed by the property manager</li>
                          <li>• Outstanding rent or damages must be cleared before move-out</li>
                          <li>• A move-out inspection will be scheduled</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Duration (Quick Select)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {durationPresets.map((preset) => (
                        <button
                          key={preset.days}
                          onClick={() => handleDurationPreset(preset.days)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            newRequest.duration_days === String(preset.days)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/50"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newRequest.start_date}
                        onChange={(e) => {
                          setNewRequest({ ...newRequest, start_date: e.target.value, duration_days: "" })
                          if (e.target.value && newRequest.end_date) {
                            const start = new Date(e.target.value)
                            const end = new Date(newRequest.end_date)
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                            if (days > 0) setNewRequest((prev) => ({ ...prev, duration_days: String(days) }))
                          }
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                      <input
                        type="date"
                        value={newRequest.end_date}
                        onChange={(e) => {
                          setNewRequest({ ...newRequest, end_date: e.target.value, duration_days: "" })
                          if (newRequest.start_date && e.target.value) {
                            const start = new Date(newRequest.start_date)
                            const end = new Date(e.target.value)
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                            if (days > 0) setNewRequest((prev) => ({ ...prev, duration_days: String(days) }))
                          }
                        }}
                        min={newRequest.start_date || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {newRequest.duration_days && (
                    <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                      Duration: <span className="font-medium text-foreground">{newRequest.duration_days} days</span>
                    </p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Reason for Absence</label>
                    <div className="grid grid-cols-2 gap-2">
                      {temporaryReasons.map((reason) => (
                        <button
                          key={reason.value}
                          onClick={() => setNewRequest({ ...newRequest, reason: reason.value })}
                          className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg border transition-all ${
                            newRequest.reason === reason.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/50"
                          }`}
                        >
                          {reason.icon}
                          {reason.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {newRequest.reason === "other" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Please specify</label>
                      <input
                        type="text"
                        value={newRequest.other_reason}
                        onChange={(e) => setNewRequest({ ...newRequest, other_reason: e.target.value })}
                        placeholder="Enter your reason..."
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Please Note:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Please return on or before your specified end date</li>
                          <li>• Ensure your rent payments are up to date</li>
                          <li>• Contact the office if you need to extend your leave</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
              <button
                onClick={() => {
                  setShowNewRequestModal(false)
                  setLeaveType("permanent")
                  setNewRequest({
                    move_out_date: "",
                    notice_period: "30",
                    reason: "",
                    start_date: "",
                    end_date: "",
                    duration_days: "",
                    other_reason: ""
                  })
                }}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={leaveType === "permanent" ? !isPermanentFormValid : !isTemporaryFormValid}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
