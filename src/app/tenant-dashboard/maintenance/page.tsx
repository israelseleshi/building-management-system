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
  Lightbulb,
  Droplets,
  Snowflake,
  Building2,
  CookingPot,
  Cable,
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

const categoryConfig: Record<Category, { label: string; color: string; icon: React.ReactNode }> = {
  plumbing: { label: "Plumbing", color: "text-blue-600", icon: <Droplets className="w-4 h-4" /> },
  electrical: { label: "Electrical", color: "text-yellow-600", icon: <Lightbulb className="w-4 h-4" /> },
  hvac: { label: "A/C", color: "text-cyan-600", icon: <Snowflake className="w-4 h-4" /> },
  structural: { label: "Structural", color: "text-purple-600", icon: <Building2 className="w-4 h-4" /> },
  appliances: { label: "Appliance", color: "text-pink-600", icon: <CookingPot className="w-4 h-4" /> },
  general: { label: "General", color: "text-gray-600", icon: <Cable className="w-4 h-4" /> },
}

const categoryGridOrder: Category[] = ["electrical", "plumbing", "hvac", "general", "structural", "appliances"]

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
            subtitle={pendingCount > 0 ? `${pendingCount} active request${pendingCount > 1 ? "s" : ""}` : "No active requests"}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            searchPlaceholder="Search requests..."
          />
        )}

        <div className={`flex-1 ${isEmbedded ? "p-0" : "p-6 lg:p-8"}`}>
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
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_300px]">
              <div className="rounded-xl border border-[#E6ECF5] bg-white p-4 sm:p-5">
                <div className="border-b border-[#E8EEF6] pb-3">
                  <p className="text-xl font-semibold text-[#1F3549]">Create request</p>
                  <p className="mt-1 text-sm font-medium text-[#6B7F98]">Request maintenance detail</p>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#4E5D70] mb-1">Type</label>
                    <div className="flex items-center justify-between rounded-lg border border-[#DCE6F3] bg-[#FDFEFF] px-3 py-2">
                      <span className="inline-flex items-center gap-2 text-sm text-[#2F4F73]">
                        <Wrench className="w-4 h-4 text-[#4C8FE2]" />
                        Maintenance request
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {categoryGridOrder.map((categoryKey) => {
                      const config = categoryConfig[categoryKey]
                      const active = newRequest.category === categoryKey
                      return (
                        <button
                          key={categoryKey}
                          type="button"
                          onClick={() => setNewRequest((prev) => ({ ...prev, category: categoryKey }))}
                          className={`rounded-lg border px-3 py-3 text-left transition ${
                            active
                              ? "border-[#84B8FA] bg-[#F1F7FF]"
                              : "border-[#DDE7F4] bg-white hover:border-[#B8D5FA]"
                          }`}
                        >
                          <div className="mb-1 text-[#4C8FE2]">{config.icon}</div>
                          <div className="text-sm font-medium text-[#1F3549]">{config.label}</div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#4E5D70] mb-1">Subject</label>
                        <input
                          type="text"
                          value={newRequest.subject}
                          onChange={(e) => setNewRequest((prev) => ({ ...prev, subject: e.target.value }))}
                          className="w-full rounded-lg border border-[#DCE6F3] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5EA3F5]"
                          placeholder="Enter request subject"
                        />
                      </div>

                      <div />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#4E5D70] mb-1">Upload Image</label>
                        <label className="block cursor-pointer rounded-lg border border-dashed border-[#A5C9F5] bg-[#FAFCFF] px-4 py-8 text-center text-sm text-[#6A7E97]">
                          <Upload className="mx-auto mb-2 h-5 w-5 text-[#4C8FE2]" />
                          Drop files here or browse
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setNewRequest((prev) => ({ ...prev, attachments: [file.name] }))
                            }}
                          />
                        </label>
                        {newRequest.attachments.length > 0 && (
                          <p className="mt-1 text-xs text-[#5F738C]">Selected: {newRequest.attachments[0]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#4E5D70] mb-1">Description</label>
                        <textarea
                          value={newRequest.description}
                          onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                          className="h-[180px] w-full rounded-lg border border-[#DCE6F3] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5EA3F5]"
                          placeholder="Describe the issue"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewRequestForm(false)}
                      className="rounded-lg border border-[#D8E3F2] px-4 py-2 text-sm font-medium text-[#35597D]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitRequest}
                      disabled={!newRequest.subject || !newRequest.description}
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: "#5EA3F5" }}
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              </div>

              <aside className="rounded-xl border border-[#E6ECF5] bg-white p-4 sm:p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.05em] text-[#6B7F98]">Recent Updates</h4>
                <div className="mt-3 space-y-3">
                  {recentUpdates.map((update, idx) => (
                    <div key={`${update.requestId}-${idx}`} className="rounded-lg border border-[#E8EEF6] bg-[#FBFDFF] p-3">
                      <p className="text-sm font-semibold text-[#1F3549]">{update.subject}</p>
                      <p className="mt-1 text-sm text-[#5D718A]">{update.text}</p>
                      <p className="mt-1 text-xs text-[#7B8EA6]">{update.author} - {formatDate(update.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </aside>
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
                const statusInfo = statusConfig[request.status]
                const categoryInfo = categoryConfig[request.category]
                const isExpanded = expandedRequest === request.id

                return (
                  <div key={request.id} className="rounded-xl border border-[#E6ECF5] bg-white overflow-hidden">
                    <div
                      className="p-5 cursor-pointer hover:bg-[#F8FBFF] transition-colors"
                      onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                            <Wrench className={`w-5 h-5 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#1F3549]">{request.subject}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.label}</span>
                              </span>
                            </div>
                            <p className="text-sm text-[#5F738C] line-clamp-2">{request.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#7387A0]">
                              <span className={`font-medium ${categoryInfo.color}`}>{categoryInfo.label}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(request.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-[#8CA0B8] transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[#E8EEF6] bg-[#FBFDFF] p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-semibold text-[#1F3549] mb-3">Request Details</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Unit</span><span className="font-medium">{request.unit}</span></div>
                              <div className="flex justify-between"><span className="text-[#6B7F98]">Category</span><span className={`font-medium ${categoryInfo.color}`}>{categoryInfo.label}</span></div>
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
          ) : null}
        </div>
      </div>
    </div>
  )
}
