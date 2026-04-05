"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  Calendar,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  PlaneTakeoff,
  User,
  Mail,
  Phone,
  MessageSquareOff,
  X,
  Send,
  Plane
} from "lucide-react"

type RequestStatus = "pending" | "approved" | "rejected" | "completed"
type LeaveType = "permanent" | "temporary"

interface LeaveRequest {
  id: string
  tenant_id: string
  tenant_name: string
  tenant_email: string
  tenant_phone: string
  unit: string
  property: string
  submitted_at: string
  leave_type: LeaveType
  move_out_date?: string
  start_date?: string
  end_date?: string
  notice_period?: string
  reason: string
  status: RequestStatus
  landlord_response?: string
  response_date?: string
  response_notes?: string
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    tenant_id: "t001",
    tenant_name: "Abebe Kebede",
    tenant_email: "abebe.kebede@email.com",
    tenant_phone: "+251 911 234 567",
    unit: "Unit 205",
    property: "Bole Sky Tower",
    submitted_at: "2026-03-15",
    leave_type: "permanent",
    move_out_date: "2026-04-30",
    notice_period: "45 days",
    reason: "Relocating to a different city for a new job opportunity. The new employer requires my presence starting May 1st.",
    status: "approved",
    landlord_response: "Your request has been approved. We wish you the best in your new position.",
    response_date: "2026-03-17"
  },
  {
    id: "2",
    tenant_id: "t002",
    tenant_name: "Tigist Haile",
    tenant_email: "tigist.haile@email.com",
    tenant_phone: "+251 912 345 678",
    unit: "Unit 302",
    property: "Kazanchis Heights",
    submitted_at: "2026-03-28",
    leave_type: "temporary",
    start_date: "2026-04-10",
    end_date: "2026-04-15",
    reason: "sick",
    status: "pending"
  },
  {
    id: "3",
    tenant_id: "t003",
    tenant_name: "Yonas Solomon",
    tenant_email: "yonas.solomon@email.com",
    tenant_phone: "+251 913 456 789",
    unit: "Unit 105",
    property: "Piassa Grand Building",
    submitted_at: "2026-03-25",
    leave_type: "temporary",
    start_date: "2026-04-01",
    end_date: "2026-04-07",
    reason: "vacation",
    status: "pending"
  },
  {
    id: "4",
    tenant_id: "t004",
    tenant_name: "Hiwot Girma",
    tenant_email: "hiwot.girma@email.com",
    tenant_phone: "+251 914 567 890",
    unit: "Unit 401",
    property: "Megenagna Square Tower",
    submitted_at: "2026-03-10",
    leave_type: "permanent",
    move_out_date: "2026-05-10",
    notice_period: "60 days",
    reason: "Purchased a new home and will be moving out permanently.",
    status: "rejected",
    landlord_response: "Unfortunately, we cannot approve this request as your lease agreement extends until June 30, 2026. Please review your lease terms.",
    response_date: "2026-03-12"
  },
  {
    id: "5",
    tenant_id: "t005",
    tenant_name: "Dagmawi Belete",
    tenant_email: "dagmawi.belete@email.com",
    tenant_phone: "+251 915 678 901",
    unit: "Unit 208",
    property: "Bole Sky Tower",
    submitted_at: "2026-03-20",
    leave_type: "temporary",
    start_date: "2026-04-05",
    end_date: "2026-04-12",
    reason: "emergency",
    status: "approved",
    landlord_response: "Approved. Please ensure all doors are locked and utilities are managed during your absence.",
    response_date: "2026-03-21"
  }
]

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: <Clock className="w-4 h-4" /> },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100", icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: <XCircle className="w-4 h-4" /> },
  completed: { label: "Completed", color: "text-blue-700", bg: "bg-blue-100", icon: <CheckCircle2 className="w-4 h-4" /> }
}

const reasonLabels: Record<string, string> = {
  sick: "Sick / Medical",
  vacation: "Vacation / Travel",
  emergency: "Emergency / Urgent",
  other: "Other"
}

export default function LandlordLeavePage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <LandlordLeaveContent />
    </ProtectedRoute>
  )
}

function LandlordLeaveContent() {
  const SIDEBAR_COLLAPSED_KEY = "bms.dashboard.sidebarCollapsed"
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  })
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<LeaveType | "all">("all")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [responseAction, setResponseAction] = useState<"approve" | "reject">("approve")
  const [responseNotes, setResponseNotes] = useState("")

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard", active: false },
    { icon: <Building2 className="w-5 h-5" />, name: "My Units", path: "/dashboard/listings", active: false },
    { icon: <PlusCircle className="w-5 h-5" />, name: "Create Units", path: "/dashboard/create", active: false },
    { icon: <Calendar className="w-5 h-5" />, name: "Rents", path: "/dashboard/leases", active: false },
    { icon: <Users className="w-5 h-5" />, name: "Employees", path: "/dashboard/employees", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat", active: false },
    { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts", active: false },
    { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics", active: false },
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
    setIsSidebarCollapsed((prev) => !prev)
  }

  const filteredRequests = requests.filter((request) => {
    if (statusFilter !== "all" && request.status !== statusFilter) return false
    if (typeFilter !== "all" && request.leave_type !== typeFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        request.tenant_name.toLowerCase().includes(query) ||
        request.unit.toLowerCase().includes(query) ||
        request.property.toLowerCase().includes(query) ||
        request.reason.toLowerCase().includes(query)
      )
    }
    return true
  })

  const pendingCount = requests.filter(r => r.status === "pending").length
  const permanentCount = requests.filter(r => r.leave_type === "permanent").length
  const temporaryCount = requests.filter(r => r.leave_type === "temporary").length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const handleOpenDetail = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const handleOpenResponse = (request: LeaveRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setResponseAction(action)
    setResponseNotes("")
    setShowDetailModal(false)
    setShowResponseModal(true)
  }

  const handleSubmitResponse = () => {
    if (!selectedRequest) return
    
    const today = new Date().toISOString().split("T")[0]
    
    setRequests(requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          status: responseAction === "approve" ? "approved" : "rejected",
          landlord_response: responseNotes,
          response_date: today
        }
      }
      return r
    }))
    
    setShowResponseModal(false)
    setSelectedRequest(null)
    setResponseNotes("")
  }

  const handleContactTenant = (request: LeaveRequest) => {
    const subject = encodeURIComponent(
      request.leave_type === "permanent"
        ? `Re: Move-Out Request - ${request.unit}`
        : `Re: Temporary Leave Request - ${request.unit}`
    )
    window.open(`mailto:${request.tenant_email}?subject=${subject}`, "_blank")
  }

  const isPermanent = selectedRequest?.leave_type === "permanent"

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{ backgroundColor: "#E9EDF3" }}
    >
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-white border-b border-[#D9E1E8] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1F3549" }}>Leave Requests</h1>
              <p className="text-sm mt-1" style={{ color: "#7B8C9D" }}>
                {pendingCount > 0 ? `${pendingCount} pending request${pendingCount > 1 ? "s" : ""} need your attention` : "All requests handled"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-[#D9E1E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1F3549" }}>{pendingCount}</p>
                  <p className="text-sm" style={{ color: "#7B8C9D" }}>Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#D9E1E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1F3549" }}>{permanentCount}</p>
                  <p className="text-sm" style={{ color: "#7B8C9D" }}>Permanent</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#D9E1E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <PlaneTakeoff className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1F3549" }}>{temporaryCount}</p>
                  <p className="text-sm" style={{ color: "#7B8C9D" }}>Temporary</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#D9E1E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1F3549" }}>{requests.filter(r => r.status === "approved").length}</p>
                  <p className="text-sm" style={{ color: "#7B8C9D" }}>Approved</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D9E1E8]">
            <div className="p-4 border-b border-[#D9E1E8]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#7B8C9D" }} />
                  <input
                    type="text"
                    placeholder="Search by tenant, unit, property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#D9E1E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
                    style={{ backgroundColor: "#F5F8FB" }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "all")}
                      className="px-3 py-2 border border-[#D9E1E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
                      style={{ backgroundColor: "#F5F8FB" }}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as LeaveType | "all")}
                    className="px-3 py-2 border border-[#D9E1E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
                    style={{ backgroundColor: "#F5F8FB" }}
                  >
                    <option value="all">All Types</option>
                    <option value="permanent">Permanent</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F8FB] flex items-center justify-center mb-4">
                  <MessageSquareOff className="w-8 h-8" style={{ color: "#7B8C9D" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1F3549" }}>No leave requests found</h3>
                <p className="text-sm" style={{ color: "#7B8C9D" }}>No requests match your current filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#D9E1E8]">
                {filteredRequests.map((request) => {
                  const statusInfo = statusConfig[request.status]
                  const isReqPermanent = request.leave_type === "permanent"

                  return (
                    <div
                      key={request.id}
                      className="p-4 cursor-pointer hover:bg-[#F5F8FB] transition-colors"
                      onClick={() => handleOpenDetail(request)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                            {isReqPermanent ? (
                              <LogOut className={`w-5 h-5 ${statusInfo.color}`} />
                            ) : (
                              <PlaneTakeoff className={`w-5 h-5 ${statusInfo.color}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold" style={{ color: "#1F3549" }}>{request.tenant_name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isReqPermanent ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                {isReqPermanent ? "Permanent" : "Temporary"}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: "#7B8C9D" }}>
                              {request.property} - {request.unit}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "#7B8C9D" }}>
                              {isReqPermanent ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Move-out: {formatDate(request.move_out_date || "")}
                                  </span>
                                  <span>{request.notice_period} notice</span>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(request.start_date || "")} - {formatDate(request.end_date || "")}
                                  </span>
                                </>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Submitted: {formatDate(request.submitted_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9E1E8]">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#1F3549" }}>
                  Leave Request Details
                </h2>
                <p className="text-sm" style={{ color: "#7B8C9D" }}>
                  {selectedRequest.tenant_name} - {selectedRequest.unit}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-[#F5F8FB] transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#7B8C9D" }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  statusConfig[selectedRequest.status].bg
                }`}>
                  {isPermanent ? (
                    <LogOut className={`w-6 h-6 ${statusConfig[selectedRequest.status].color}`} />
                  ) : (
                    <PlaneTakeoff className={`w-6 h-6 ${statusConfig[selectedRequest.status].color}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold" style={{ color: "#1F3549" }}>{selectedRequest.tenant_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedRequest.status].bg} ${statusConfig[selectedRequest.status].color} flex items-center gap-1`}>
                      {statusConfig[selectedRequest.status].icon}
                      {statusConfig[selectedRequest.status].label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isPermanent ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      {isPermanent ? "Permanent Move-Out" : "Temporary Leave"}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#7B8C9D" }}>{selectedRequest.property} - {selectedRequest.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-semibold mb-3" style={{ color: "#1F3549" }}>Tenant Information</h5>
                  <div className="bg-[#F5F8FB] rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      <span className="text-sm" style={{ color: "#1F3549" }}>{selectedRequest.tenant_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      <span className="text-sm" style={{ color: "#1F3549" }}>{selectedRequest.tenant_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      <span className="text-sm" style={{ color: "#1F3549" }}>{selectedRequest.tenant_phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      <span className="text-sm" style={{ color: "#1F3549" }}>{selectedRequest.property} - {selectedRequest.unit}</span>
                    </div>
                  </div>

                  <h5 className="text-sm font-semibold mt-4 mb-3" style={{ color: "#1F3549" }}>Request Details</h5>
                  <div className="bg-[#F5F8FB] rounded-lg p-4 space-y-2 text-sm">
                    {isPermanent && (
                      <>
                        <div className="flex justify-between">
                          <span style={{ color: "#7B8C9D" }}>Move-out Date</span>
                          <span className="font-medium" style={{ color: "#1F3549" }}>{formatDate(selectedRequest.move_out_date || "")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#7B8C9D" }}>Notice Period</span>
                          <span className="font-medium" style={{ color: "#1F3549" }}>{selectedRequest.notice_period}</span>
                        </div>
                      </>
                    )}
                    {!isPermanent && (
                      <>
                        <div className="flex justify-between">
                          <span style={{ color: "#7B8C9D" }}>Start Date</span>
                          <span className="font-medium" style={{ color: "#1F3549" }}>{formatDate(selectedRequest.start_date || "")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#7B8C9D" }}>End Date</span>
                          <span className="font-medium" style={{ color: "#1F3549" }}>{formatDate(selectedRequest.end_date || "")}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span style={{ color: "#7B8C9D" }}>Submitted</span>
                      <span className="font-medium" style={{ color: "#1F3549" }}>{formatDate(selectedRequest.submitted_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold mb-3" style={{ color: "#1F3549" }}>Reason for Leave</h5>
                  <div className="bg-[#F5F8FB] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {isPermanent ? (
                        <LogOut className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      ) : (
                        <Plane className="w-4 h-4" style={{ color: "#7B8C9D" }} />
                      )}
                      <span className={`text-sm font-medium ${isPermanent ? "text-red-700" : "text-blue-700"}`}>
                        {isPermanent ? "Permanent Move-Out" : reasonLabels[selectedRequest.reason] || selectedRequest.reason}
                      </span>
                    </div>
                    {isPermanent && (
                      <p className="text-sm" style={{ color: "#7B8C9D" }}>{selectedRequest.reason}</p>
                    )}
                  </div>

                  {selectedRequest.landlord_response && (
                    <>
                      <h5 className="text-sm font-semibold mt-4 mb-3" style={{ color: "#1F3549" }}>Your Response</h5>
                      <div className={`rounded-lg p-4 border ${
                        selectedRequest.status === "approved" 
                          ? "bg-green-50 border-green-200" 
                          : "bg-red-50 border-red-200"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {selectedRequest.status === "approved" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            selectedRequest.status === "approved" ? "text-green-700" : "text-red-700"
                          }`}>
                            {selectedRequest.status === "approved" ? "Approved" : "Rejected"}
                          </span>
                          {selectedRequest.response_date && (
                            <span className="text-xs" style={{ color: "#7B8C9D" }}>
                              on {formatDate(selectedRequest.response_date)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: selectedRequest.status === "approved" ? "#166534" : "#991b1b" }}>
                          {selectedRequest.landlord_response}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[#D9E1E8] px-6 py-4 bg-[#F5F8FB]">
              {selectedRequest.status === "pending" && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleOpenResponse(selectedRequest, "approve")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleOpenResponse(selectedRequest, "reject")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </button>
                </div>
              )}
              <button
                onClick={() => handleContactTenant(selectedRequest)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#D9E1E8] rounded-lg hover:bg-white transition-colors font-medium"
                style={{ color: "#1F3549" }}
              >
                <Mail className="w-4 h-4" />
                Contact Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9E1E8]">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#1F3549" }}>
                  {responseAction === "approve" ? "Approve" : "Reject"} Request
                </h2>
                <p className="text-sm" style={{ color: "#7B8C9D" }}>
                  {selectedRequest.tenant_name} - {selectedRequest.unit}
                </p>
              </div>
              <button
                onClick={() => setShowResponseModal(false)}
                className="p-2 rounded-lg hover:bg-[#F5F8FB] transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#7B8C9D" }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-lg ${responseAction === "approve" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-2">
                  {responseAction === "approve" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${responseAction === "approve" ? "text-green-700" : "text-red-700"}`}>
                    You are about to {responseAction} this {selectedRequest.leave_type === "permanent" ? "move-out" : "temporary leave"} request
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1F3549" }}>
                  Response Notes {responseAction === "reject" ? "(Required)" : "(Optional)"}
                </label>
                <textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder={
                    responseAction === "approve"
                      ? "Add any notes for the tenant (e.g., next steps, contact information)..."
                      : "Please provide a reason for rejection (e.g., lease terms, notice period requirements)..."
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-[#D9E1E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3498DB] resize-none"
                  style={{ backgroundColor: "#F5F8FB" }}
                />
              </div>
              {responseAction === "reject" && !responseNotes.trim() && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Please provide a reason for rejection
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D9E1E8] bg-[#F5F8FB]">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                style={{ color: "#1F3549" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={responseAction === "reject" && !responseNotes.trim()}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  responseAction === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4" />
                {responseAction === "approve" ? "Approve Request" : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
