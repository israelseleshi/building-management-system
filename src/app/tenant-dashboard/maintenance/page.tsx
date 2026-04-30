"use client"

import { useMemo, useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Wrench,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Home,
  FileText,
  DollarSign,
  ChevronRight,
  Upload,
  X,
} from "lucide-react"

type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled"
type Priority = "low" | "normal" | "high" | "urgent"
type Category = "plumbing" | "electrical" | "hvac" | "structural" | "appliances" | "general"

interface MaintenanceRequest {
  id: string
  subject: string
  description: string
  category: Category
  priority: Priority
  status: RequestStatus
  unit: string
  created_at: string
  updated_at: string
  scheduled_date?: string
  assigned_to?: string
  cost?: number
  notes: Array<{ text: string; author: string; timestamp: string }>
}

const mockRequests: MaintenanceRequest[] = [
  {
    id: "1",
    subject: "Bathroom Faucet Leak",
    description:
      "The bathroom sink faucet has been dripping constantly for the past two days. Water is collecting under the sink.",
    category: "plumbing",
    priority: "high",
    status: "completed",
    unit: "Unit B-204",
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-16T14:00:00Z",
    scheduled_date: "2026-03-16",
    assigned_to: "Daniel Tekle",
    cost: 850,
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-03-15T10:00:00Z" },
      { text: "Assigned to Daniel Tekle", author: "System", timestamp: "2026-03-15T11:00:00Z" },
      {
        text: "Work completed. Replaced the washer and tightened connections.",
        author: "Daniel Tekle",
        timestamp: "2026-03-16T14:00:00Z",
      },
    ],
  },
  {
    id: "2",
    subject: "Air Conditioner Not Cooling",
    description:
      "The AC unit in the living room is running but not cooling the room. It just blows room temperature air.",
    category: "hvac",
    priority: "normal",
    status: "in_progress",
    unit: "Unit B-204",
    created_at: "2026-04-01T09:00:00Z",
    updated_at: "2026-04-02T10:00:00Z",
    scheduled_date: "2026-04-05",
    assigned_to: "Samuel Gebre",
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-04-01T09:00:00Z" },
      { text: "Request accepted", author: "System", timestamp: "2026-04-01T10:00:00Z" },
      { text: "Technician assigned. Visit scheduled for April 5th.", author: "Samuel Gebre", timestamp: "2026-04-02T10:00:00Z" },
    ],
  },
]

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-100", icon: <AlertCircle className="w-4 h-4" /> },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-100", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "text-gray-700", bg: "bg-gray-100", icon: <XCircle className="w-4 h-4" /> },
}

const categoryConfig: Record<Category, { label: string; color: string }> = {
  plumbing: { label: "Plumbing", color: "text-blue-600" },
  electrical: { label: "Electrical", color: "text-yellow-600" },
  hvac: { label: "A/C", color: "text-cyan-600" },
  structural: { label: "Structural", color: "text-purple-600" },
  appliances: { label: "Appliance", color: "text-pink-600" },
  general: { label: "General", color: "text-gray-600" },
}

export default function TenantMaintenancePage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantMaintenanceContent />
    </ProtectedRoute>
  )
}

function TenantMaintenanceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmbedded = searchParams.get("embed") === "1"
  const isCreateMode = searchParams.get("mode") === "create"

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(isEmbedded && isCreateMode)
  const [newRequest, setNewRequest] = useState({
    subject: "",
    description: "",
    category: "general" as Category,
    priority: "normal" as Priority,
    attachments: [] as string[],
  })

  const navItems = [
    { icon: <Home className="w-5 h-5" />, name: "Dashboard", path: "/tenant-dashboard", active: false },
    { icon: <DollarSign className="w-5 h-5" />, name: "My Rents", path: "/tenant-dashboard/leases", active: false },
    { icon: <Wrench className="w-5 h-5" />, name: "Requests", path: "/tenant-dashboard/requests", active: true },
    { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/tenant-dashboard/documents", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/tenant-dashboard/chat", active: false },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const handleSubmitRequest = () => {
    if (!newRequest.subject || !newRequest.description) return

    const nowIso = new Date().toISOString()
    const request: MaintenanceRequest = {
      id: String(requests.length + 1),
      subject: newRequest.subject,
      description: newRequest.description,
      category: newRequest.category,
      priority: newRequest.priority,
      status: "pending",
      unit: "Unit B-204",
      created_at: nowIso,
      updated_at: nowIso,
      notes: [{ text: "Request submitted", author: "Tenant", timestamp: nowIso }],

    }
    setRequests((prev) => [request, ...prev])
    setShowNewRequestForm(false)
    setNewRequest({
      subject: "",
      description: "",
      category: "general",
      priority: "normal",
      attachments: [],
    })
  }

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = !q || req.subject.toLowerCase().includes(q) || req.description.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  const recentUpdates = useMemo(
    () => requests.flatMap((req) => req.notes.map((note) => ({ ...note, requestId: req.id, subject: req.subject }))).slice(0, 5),
    [requests]
  )

  const pendingCount = requests.filter((r) => r.status === "pending" || r.status === "in_progress").length

  const getStatusConfig = (status: RequestStatus) => {
    const configs = {
      pending: { color: "text-yellow-700", bg: "bg-yellow-100", icon: <Clock className="w-4 h-4" /> },
      in_progress: { color: "text-blue-700", bg: "bg-blue-100", icon: <AlertCircle className="w-4 h-4" /> },
      completed: { color: "text-green-700", bg: "bg-green-100", icon: <CheckCircle2 className="w-4 h-4" /> },
      cancelled: { color: "text-gray-700", bg: "bg-gray-100", icon: <XCircle className="w-4 h-4" /> }
    }
    return configs[status]
  }

  const getCategoryConfig = (category: Category) => {
    const configs: Record<Category, { color: string }> = {
      plumbing: { color: "text-blue-600" },
      electrical: { color: "text-yellow-600" },
      hvac: { color: "text-green-600" },
      structural: { color: "text-purple-600" },
      appliances: { color: "text-pink-600" },
      general: { color: "text-gray-600" }
    }
    return configs[category]
  }

  const getSubtitle = () => {
    if (pendingCount === 0) {
      return "No active requests"
    }
    return `${pendingCount} active requests`
  }

  return (
    <div className={`min-h-screen bg-background ${isEmbedded ? "" : "flex"}`}>
      {!isEmbedded && (
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onLogout={handleLogout}
          onNavigate={(isCurrentlyCollapsed) => {
            if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
          }}
        />
      )}

      <div className={isEmbedded ? "" : "flex-1 flex flex-col"}>
        {!isEmbedded && (
          <DashboardHeader
            title="Maintenance Requests"
            subtitle={getSubtitle()}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            searchPlaceholder="Search requests..."
          />
        )}

        <div className={`flex-1 overflow-x-hidden ${isEmbedded ? "bg-[#F3F5FA] p-2 sm:p-3" : "bg-[#F3F5FA] p-6 lg:p-8"}`}>
          {!isCreateMode && (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#5EA3F5]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                onClick={() => setShowNewRequestForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: "#5EA3F5" }}
              >
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>
          )}

          {showNewRequestForm && (
            <div className="flex h-[calc(100vh-180px)] gap-5 overflow-hidden rounded-xl bg-[#F3F5FA] p-1">
              {/* Form Section */}
              <div className="w-full max-w-[650px] overflow-y-auto overflow-x-hidden pr-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="rounded-xl border border-[#E6ECF5] bg-white p-4 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                  <div className="mb-6 border-b border-[#E8EEF6] pb-3">
                    <p className="text-xl font-semibold text-[#1F3549]">Request details</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#4E5D70] mb-1 text-[13px]">Type</label>
                      <div className="flex items-center justify-between rounded-lg border border-[#DCE6F3] bg-[#FDFEFF] px-3 py-2 text-sm text-[#2F4F73]">
                        <div className="flex items-center">
                          <Wrench className="w-4 h-4 text-[#4C8FE2] mr-2" />
                          Maintenance request
                        </div>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && window.top !== window.self) {
                              window.parent.location.href = "/tenant-dashboard/requests"
                              return
                            }
                            router.push("/tenant-dashboard/requests")
                          }}
                          className="text-[#2E7D6A] font-semibold text-xs hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#4E5D70] mb-1 text-[13px]">Category</label>
                      <select
                        value={newRequest.category}
                        onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as Category })}
                        className="w-full rounded-lg border border-[#DCE6F3] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5EA3F5] appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7F98'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                      >
                        <option value="general">General</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="hvac">A/C</option>
                        <option value="structural">Structural</option>
                        <option value="appliances">Appliance</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#1F3549] text-[13px]">Subject<span className="text-red-500 ml-0.5">*</span></label>
                      <input
                        type="text"
                        placeholder="What is the issue?"
                        className="w-full rounded-lg border border-[#D8E3F2] bg-white p-2.5 text-sm transition-all focus:border-[#5EA3F5] focus:outline-none focus:ring-4 focus:ring-[#5EA3F5]/10"
                        value={newRequest.subject}
                        onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#1F3549] text-[13px]">Description<span className="text-red-500 ml-0.5">*</span></label>
                      <textarea
                        rows={5}
                        maxLength={500}
                        placeholder="Please describe the issue in detail..."
                        className="w-full rounded-lg border border-[#D8E3F2] bg-white p-3 text-sm transition-all focus:border-[#5EA3F5] focus:outline-none focus:ring-4 focus:ring-[#5EA3F5]/10 resize-none"
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      />
                      <div className="text-right text-[11px] text-[#A0AEC0]">Characters Remaining: {newRequest.description.length}/500</div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#1F3549] text-[13px]">Upload Photo <span className="text-[#A0AEC0] font-normal text-xs ml-1">(Optional)</span></label>
                      <div className="relative group cursor-pointer">
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8E3F2] bg-[#FBFDFF] p-6 transition-all group-hover:border-[#5EA3F5] group-hover:bg-[#F5F9FF]">
                          <div className="mb-2 rounded-full bg-[#EEF4FF] p-3 text-[#5EA3F5] transition-transform group-hover:scale-110">
                            <Upload className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium text-[#1F3549]">
                            Drop Files Here or <span className="text-[#5EA3F5] hover:underline">Browse</span>.
                          </p>
                        </div>
                        <input type="file" className="absolute inset-0 cursor-pointer opacity-0" />
                      </div>
                      <p className="mt-2 text-[12px] text-[#6B7F98] leading-relaxed">
                        <span className="font-semibold text-[#5D718A]">File format supported:</span> jpg, jpeg, png
                        <br />
                        <span className="font-semibold text-[#5D718A]">Maximum file size:</span> 20MB
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EEF6]">
                      <button
                        type="button"
                        onClick={() => setShowNewRequestForm(false)}
                        className="rounded-lg px-6 py-2 text-sm font-bold text-[#6B7F98] hover:bg-[#F8FBFF] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitRequest}
                        disabled={!newRequest.subject || !newRequest.description}
                        className="rounded-lg px-8 py-2 text-sm font-bold text-white shadow-lg shadow-[#5EA3F5]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                        style={{ backgroundColor: "#5EA3F5" }}
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updates Section */}
              <div className="w-[340px] ml-auto overflow-y-auto overflow-x-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#F0F5FF] text-[#5EA3F5]">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1F3549]">Recent Updates ({recentUpdates.length})</h4>
                  </div>
                  <button className="text-[11px] font-bold text-[#5EA3F5] hover:underline">Clear</button>
                </div>

                <div className="space-y-2 overflow-x-hidden">
                  {recentUpdates.map((update, idx) => (
                    <div key={`${update.requestId}-${idx}`} className="relative group rounded-lg border border-[#E8EEF6] bg-white p-3 transition-all hover:border-[#D0DBE6] hover:shadow-sm overflow-x-hidden">
                      <button className="absolute top-2.5 right-2.5 text-[#A0AEC0] hover:text-[#FF6B6B] opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-[13px] font-bold text-[#1F3549] truncate pr-4">{update.subject}</p>
                        <span className="text-[11px] font-medium text-[#A0AEC0] flex-shrink-0 whitespace-nowrap">{formatDate(update.timestamp)}</span>
                      </div>
                      <p className="text-[12px] text-[#5D718A] leading-relaxed line-clamp-2">{update.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-5">
                  <a href="/tenant-dashboard/requests" className="text-xs font-bold text-[#5EA3F5] hover:underline transition-all">
                    View all
                  </a>
                </div>
              </div>
            </div>
          )}

          {!isCreateMode && filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#E6ECF5] bg-white py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF4FF]">
                <Wrench className="h-8 w-8 text-[#4C8FE2]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F3549]">No requests found</h3>
              <p className="mt-1 text-sm text-[#6B7F98]">Try adjusting filters or submit a new request.</p>
            </div>
          ) : !isCreateMode ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusInfo = getStatusConfig(request.status)

                return (
                  <div key={request.id} className="rounded-xl border border-[#E6ECF5] bg-white overflow-hidden">
                    <div
                      className="p-5 cursor-pointer hover:bg-[#F8FBFF] transition-colors"
                      onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                            <Wrench className={`w-5 h-5 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#1F3549]">{request.subject}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1.5`}>
                                {statusInfo.icon}
                                <span className="ml-1 font-medium">{statusConfig[request.status].label}</span>
                              </span>
                            </div>
                            <p className="text-sm text-[#5F738C] line-clamp-2">{request.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#7387A0]">
                              <span className={`font-medium ${categoryConfig[request.category].color}`}>{categoryConfig[request.category].label}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(request.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-[#8CA0B8] transition-transform ${expandedRequest === request.id ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    {expandedRequest === request.id && (
                      <div className="border-t border-[#E8EEF6] bg-[#FBFDFF] p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-semibold text-[#1F3549] mb-3">Request Details</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Unit</span><span className="font-medium">{request.unit}</span></div>
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Category</span><span className={`font-medium ${getCategoryConfig(request.category).color}`}>{statusConfig[request.status].label}</span></div>
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Priority</span><span className="font-medium capitalize">{request.priority}</span></div>
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Created</span><span className="font-medium">{formatDate(request.created_at)}</span></div>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-[#1F3549] mb-3">Activity Timeline</h5>
                            <div className="space-y-3">
                              {request.notes.map((note, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className="w-2 h-2 rounded-full bg-[#5EA3F5] mt-2 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-[#304B68]">{note.text}</p>
                                    <div className="flex items-center gap-2 text-xs text-[#7A8EA7]">
                                      <span>{note.author}</span>
                                      <span>|</span>
                                      <span>{formatDate(note.timestamp)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : null}        </div>
      </div>
    </div>
  )
}
