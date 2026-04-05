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

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-100", icon: <AlertCircle className="w-4 h-4" /> },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-100", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "text-gray-700", bg: "bg-gray-100", icon: <XCircle className="w-4 h-4" /> }
}

const categoryConfig: Record<Category, { label: string; color: string }> = {
  plumbing: { label: "Plumbing", color: "text-blue-600" },
  electrical: { label: "Electrical", color: "text-yellow-600" },
  hvac: { label: "HVAC", color: "text-green-600" },
  structural: { label: "Structural", color: "text-purple-600" },
  appliances: { label: "Appliances", color: "text-pink-600" },
  general: { label: "General", color: "text-gray-600" }
}

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
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [newRequest, setNewRequest] = useState({ title: "", description: "", category: "general" as Category, priority: "normal" as Priority })
  const router = useRouter()
  const t = useTranslations("Tenant")

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
      notes: [{ text: "Request submitted", author: "Tenant", timestamp: new Date().toISOString() }]
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
          title="Maintenance Requests"
          subtitle={pendingCount > 0 ? `${pendingCount} active request${pendingCount > 1 ? 's' : ''}` : "No active requests"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
          searchPlaceholder="Search requests..."
        />

        <div className="flex-1 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Submit a new maintenance request"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Request
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusInfo = statusConfig[request.status]
                const categoryInfo = categoryConfig[request.category]
                const isExpanded = expandedRequest === request.id

                return (
                  <div key={request.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div
                      className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                            <Wrench className={`w-5 h-5 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{request.title}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.label}</span>
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className={`font-medium ${categoryInfo.color}`}>{categoryInfo.label}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(request.created_at)}
                              </span>
                              {request.scheduled_date && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Scheduled: {formatDate(request.scheduled_date)}
                                </span>
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
                                <span className="text-muted-foreground">Unit</span>
                                <span className="font-medium">{request.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category</span>
                                <span className={`font-medium ${categoryInfo.color}`}>{categoryInfo.label}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Priority</span>
                                <span className="font-medium capitalize">{request.priority}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Created</span>
                                <span className="font-medium">{formatDate(request.created_at)}</span>
                              </div>
                              {request.assigned_to && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Assigned To</span>
                                  <span className="font-medium">{request.assigned_to}</span>
                                </div>
                              )}
                              {request.cost && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Cost</span>
                                  <span className="font-medium">ETB {request.cost.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-3">Activity Timeline</h5>
                            <div className="space-y-3">
                              {request.notes.map((note, idx) => (
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
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {showNewRequestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">New Maintenance Request</h2>
                    <p className="text-sm text-muted-foreground">Submit a new maintenance request</p>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as Category })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="structural">Structural</option>
                      <option value="appliances">Appliances</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as Priority })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      placeholder="Provide detailed information about the issue..."
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
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    disabled={!newRequest.title || !newRequest.description}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Request
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
