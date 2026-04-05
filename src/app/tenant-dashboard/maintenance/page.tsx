"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
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
  X
} from "lucide-react"

type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled"
type Priority = "low" | "normal" | "high" | "urgent"
type Category = "plumbing" | "electrical" | "hvac" | "structural" | "appliances" | "general"

interface MaintenanceRequest {
  id: string
  title: string
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
    title: "Bathroom Faucet Leak",
    description: "The bathroom sink faucet has been dripping constantly for the past two days. Water is collecting under the sink.",
    category: "plumbing",
    priority: "high",
    status: "completed",
    unit: "Unit 205",
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-16T14:00:00Z",
    scheduled_date: "2026-03-16",
    assigned_to: "Daniel Tekle",
    cost: 850,
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-03-15T10:00:00Z" },
      { text: "Assigned to Daniel Tekle", author: "System", timestamp: "2026-03-15T11:00:00Z" },
      { text: "Work completed. Replaced the washer and tightened connections.", author: "Daniel Tekle", timestamp: "2026-03-16T14:00:00Z" }
    ]
  },
  {
    id: "2",
    title: "Air Conditioner Not Cooling",
    description: "The AC unit in the living room is running but not cooling the room. It just blows room temperature air.",
    category: "hvac",
    priority: "normal",
    status: "in_progress",
    unit: "Unit 205",
    created_at: "2026-04-01T09:00:00Z",
    updated_at: "2026-04-02T10:00:00Z",
    scheduled_date: "2026-04-05",
    assigned_to: "Samuel Gebre",
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-04-01T09:00:00Z" },
      { text: "Request accepted", author: "System", timestamp: "2026-04-01T10:00:00Z" },
      { text: "Technician assigned. Visit scheduled for April 5th.", author: "Samuel Gebre", timestamp: "2026-04-02T10:00:00Z" }
    ]
  },
  {
    id: "3",
    title: "Light Fixture Replacement",
    description: "The ceiling light fixture in the bedroom is flickering and needs replacement. I've tried different bulbs but the issue persists.",
    category: "electrical",
    priority: "low",
    status: "pending",
    unit: "Unit 205",
    created_at: "2026-04-03T15:30:00Z",
    updated_at: "2026-04-03T15:30:00Z",
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-04-03T15:30:00Z" }
    ]
  },
  {
    id: "4",
    title: "Broken Cabinet Hinge",
    description: "The kitchen cabinet door has a loose hinge and is hanging at an angle. The screw no longer holds in the wood.",
    category: "general",
    priority: "normal",
    status: "pending",
    unit: "Unit 205",
    created_at: "2026-04-04T11:00:00Z",
    updated_at: "2026-04-04T11:00:00Z",
    notes: [
      { text: "Request submitted", author: "Tenant", timestamp: "2026-04-04T11:00:00Z" }
    ]
  }
]

export default function TenantMaintenancePage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantMaintenanceContent />
    </ProtectedRoute>
  )
}

function TenantMaintenanceContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [newRequest, setNewRequest] = useState({ title: "", description: "", category: "general" as Category, priority: "normal" as Priority })
  const router = useRouter()
  const t = useTranslations("Tenant")
  const tm = useTranslations("Tenant.maintenance")

  const navItems = [
    { icon: <Home className="w-5 h-5" />, name: t("nav.dashboard"), path: "/tenant-dashboard", active: false },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.listings"), path: "/tenant-dashboard/listings", active: false },
    { icon: <DollarSign className="w-5 h-5" />, name: t("nav.myRents"), path: "/tenant-dashboard/leases", active: false },
    { icon: <Wrench className="w-5 h-5" />, name: t("nav.maintenance"), path: "/tenant-dashboard/maintenance", active: true },
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

  const handleOpenDetail = (request: MaintenanceRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const handleSubmitRequest = () => {
    if (!newRequest.title || !newRequest.description) return
    const request: MaintenanceRequest = {
      id: String(requests.length + 1),
      title: newRequest.title,
      description: newRequest.description,
      category: newRequest.category,
      priority: newRequest.priority,
      status: "pending",
      unit: "Unit 205",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: [{ text: tm("notes.submitted"), author: "Tenant", timestamp: new Date().toISOString() }]
    }
    setRequests([request, ...requests])
    setShowNewRequestModal(false)
    setNewRequest({ title: "", description: "", category: "general", priority: "normal" })
  }

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    const matchesSearch = searchQuery === "" || 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const pendingCount = requests.filter(r => r.status === "pending" || r.status === "in_progress").length

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

  const getTranslatedStatus = (status: RequestStatus) => {
    const statusMap: Record<RequestStatus, string> = {
      pending: tm("status.pending"),
      in_progress: tm("status.in_progress"),
      completed: tm("status.completed"),
      cancelled: tm("status.cancelled")
    }
    return statusMap[status]
  }

  const getTranslatedCategory = (category: Category) => {
    const categoryMap: Record<Category, string> = {
      plumbing: tm("category.plumbing"),
      electrical: tm("category.electrical"),
      hvac: tm("category.hvac"),
      structural: tm("category.structural"),
      appliances: tm("category.appliances"),
      general: tm("category.general")
    }
    return categoryMap[category]
  }

  const getTranslatedPriority = (priority: Priority) => {
    const priorityMap: Record<Priority, string> = {
      low: tm("priority.low"),
      normal: tm("priority.normal"),
      high: tm("priority.high"),
      urgent: tm("priority.urgent")
    }
    return priorityMap[priority]
  }

  const getSubtitle = () => {
    if (pendingCount === 0) {
      return tm("header.noActiveRequests")
    }
    if (pendingCount === 1) {
      return tm("header.activeRequests", { count: pendingCount })
    }
    return tm("header.activeRequests", { count: pendingCount })
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
          title={tm("header.title")}
          subtitle={getSubtitle()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
          searchPlaceholder={tm("searchPlaceholder")}
        />

        <div className="flex-1 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{tm("filters.allStatus")}</option>
                <option value="pending">{tm("filters.pending")}</option>
                <option value="in_progress">{tm("filters.inProgress")}</option>
                <option value="completed">{tm("filters.completed")}</option>
                <option value="cancelled">{tm("filters.cancelled")}</option>
              </select>
            </div>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {tm("newRequest")}
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{tm("empty.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterStatus !== "all"
                  ? tm("empty.tryAdjusting")
                  : tm("empty.submitNew")}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {tm("newRequest")}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusInfo = getStatusConfig(request.status)
                const categoryInfo = getCategoryConfig(request.category)

                return (
                  <div
                    key={request.id}
                    className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleOpenDetail(request)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                          <Wrench className={`w-5 h-5 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{request.title}</h4>
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                              {statusInfo.icon}
                              <span>{getTranslatedStatus(request.status)}</span>
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className={`font-medium ${categoryInfo.color}`}>{getTranslatedCategory(request.category)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(request.created_at)}
                            </span>
                            {request.scheduled_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tm("details.scheduled")}: {formatDate(request.scheduled_date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {showDetailModal && selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{tm("details.title")}</h2>
                    <p className="text-sm text-muted-foreground">{selectedRequest.title}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusConfig(selectedRequest.status).bg}`}>
                      <Wrench className={`w-6 h-6 ${getStatusConfig(selectedRequest.status).color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{selectedRequest.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${getStatusConfig(selectedRequest.status).bg} ${getStatusConfig(selectedRequest.status).color}`}>
                          {getStatusConfig(selectedRequest.status).icon}
                          <span>{getTranslatedStatus(selectedRequest.status)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedRequest.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-3">{tm("details.title")}</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{tm("details.unit")}</span>
                          <span className="font-medium">{selectedRequest.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{tm("details.category")}</span>
                          <span className={`font-medium ${getCategoryConfig(selectedRequest.category).color}`}>{getTranslatedCategory(selectedRequest.category)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{tm("details.priority")}</span>
                          <span className="font-medium capitalize">{getTranslatedPriority(selectedRequest.priority)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{tm("details.created")}</span>
                          <span className="font-medium">{formatDate(selectedRequest.created_at)}</span>
                        </div>
                        {selectedRequest.assigned_to && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{tm("details.assignedTo")}</span>
                            <span className="font-medium">{selectedRequest.assigned_to}</span>
                          </div>
                        )}
                        {selectedRequest.scheduled_date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{tm("details.scheduled")}</span>
                            <span className="font-medium">{formatDate(selectedRequest.scheduled_date)}</span>
                          </div>
                        )}
                        {selectedRequest.cost && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{tm("details.cost")}</span>
                            <span className="font-medium">ETB {selectedRequest.cost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{tm("form.descriptionLabel")}</p>
                        <p className="text-sm text-foreground">{selectedRequest.description}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-3">{tm("timeline.title")}</h5>
                      <div className="space-y-3">
                        {selectedRequest.notes.map((note, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-foreground">{note.text}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{note.author}</span>
                                <span>•</span>
                                <span>{formatDate(note.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showNewRequestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{tm("form.title")}</h2>
                    <p className="text-sm text-muted-foreground">{tm("form.subtitle")}</p>
                  </div>
                  <button
                    onClick={() => setShowNewRequestModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{tm("form.titleLabel")}</label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      placeholder={tm("form.titlePlaceholder")}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{tm("form.categoryLabel")}</label>
                    <select
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as Category })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="plumbing">{tm("category.plumbing")}</option>
                      <option value="electrical">{tm("category.electrical")}</option>
                      <option value="hvac">{tm("category.hvac")}</option>
                      <option value="structural">{tm("category.structural")}</option>
                      <option value="appliances">{tm("category.appliances")}</option>
                      <option value="general">{tm("category.general")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{tm("form.priorityLabel")}</label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as Priority })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">{tm("priority.low")}</option>
                      <option value="normal">{tm("priority.normal")}</option>
                      <option value="high">{tm("priority.high")}</option>
                      <option value="urgent">{tm("priority.urgent")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{tm("form.descriptionLabel")}</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      placeholder={tm("form.descriptionPlaceholder")}
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
                  <button
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    {tm("form.cancel")}
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    disabled={!newRequest.title || !newRequest.description}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tm("form.submit")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
