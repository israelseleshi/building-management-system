"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  AlertTriangle,
  ShieldAlert,
  Award,
  MessageCircleWarning,
} from "lucide-react"

interface ReportTenant {
  tenantId: string
  tenantName: string
  tenantEmail: string
  propertyTitle: string
  propertyCity?: string
  monthlyRent: number
  status: string
  daysLate: number
  timesLateBefore: number
  totalWarnings: number
  removedWarnings: number
  severity: "low" | "medium" | "high"
}

interface IncidentReport {
  id: string
  tenantName: string
  tenantId: string
  propertyTitle: string
  category: string
  description: string
  severity: "low" | "medium" | "high"
  createdAt: string
}

function ReportsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [reportTenants, setReportTenants] = useState<ReportTenant[]>([])
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([])
  const [topPerformers, setTopPerformers] = useState<ReportTenant[]>([])
  const [severityFilterTenants, setSeverityFilterTenants] = useState<"all" | "low" | "medium" | "high">("all")
  const [customWarnings, setCustomWarnings] = useState<Record<string, string>>({})
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard", active: false },
    { icon: <Building2 className="w-5 h-5" />, name: "My Listings", path: "/dashboard/listings", active: false },
    { icon: <PlusCircle className="w-5 h-5" />, name: "Create Listing", path: "/dashboard/create", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat", active: false },
    { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts", active: false },
    { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics", active: false },
    { icon: <Users className="w-5 h-5" />, name: "Reports", path: "/dashboard/reports", active: true },
    { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings", active: false },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) return

        const userRes = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const userPayload = await userRes.json()
        if (!userPayload.success) return

        // Placeholder for backend data
        setReportTenants([])
        setTopPerformers([])
        setIncidentReports([])
      } catch (err) {
        console.error('Error in main fetch:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const selectedTenant = selectedTenantId
    ? reportTenants.find((t) => t.tenantId === selectedTenantId) ||
      topPerformers.find((t) => t.tenantId === selectedTenantId) ||
      null
    : null

  const handleLogout = async () => {
    const token = getAuthToken()
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const filteredReportTenants = reportTenants.filter(r => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      r.tenantName.toLowerCase().includes(q) ||
      r.tenantEmail.toLowerCase().includes(q) ||
      r.propertyTitle.toLowerCase().includes(q)

    const matchesSeverity =
      severityFilterTenants === "all" || r.severity === severityFilterTenants

    return matchesSearch && matchesSeverity
  })

  const getSeverityBadgeClasses = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
    }
  }

  const openChatWithWarning = (tenantId: string, defaultMessage: string, autoSend = false) => {
    const custom = customWarnings[tenantId]
    const messageToUse = (custom && custom.trim().length > 0) ? custom : defaultMessage

    const params = new URLSearchParams()
    params.set("tenantId", tenantId)
    params.set("prefill", messageToUse)
    params.set("warning", "1")
    if (autoSend) params.set("autoSend", "1")

    router.push(`/dashboard/chat?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Reports & Warnings"
          subtitle="Monitor rent risk, incidents, and top-performing tenants"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl p-5 border-0 flex items-start gap-4" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div className="p-3 rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Overdue / At-Risk Tenants</Text>
                  <Heading level={3} className="text-2xl font-bold">{reportTenants.length}</Heading>
                </div>
              </div>

              <div className="rounded-2xl p-5 border-0 flex items-start gap-4" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Incident Reports</Text>
                  <Heading level={3} className="text-2xl font-bold">{incidentReports.length}</Heading>
                </div>
              </div>

              <div className="rounded-2xl p-5 border-0 flex items-start gap-4" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Top On-Time Payers</Text>
                  <Heading level={3} className="text-2xl font-bold">{topPerformers.length}</Heading>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-0 overflow-hidden" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
              <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                <Heading level={3} className="text-lg font-bold">Rent Risk & Warnings</Heading>
                <div className="flex gap-2">
                  {["all", "low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverityFilterTenants(level as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityFilterTenants === level ? "bg-primary text-white" : "bg-background"}`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportTenants.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10">No data available</TableCell></TableRow>
                    ) : (
                      filteredReportTenants.map((r) => (
                        <TableRow key={r.tenantId} onClick={() => setSelectedTenantId(r.tenantId)} className="cursor-pointer">
                          <TableCell>{r.tenantName}</TableCell>
                          <TableCell>{r.propertyTitle}</TableCell>
                          <TableCell>ETB {r.monthlyRent.toLocaleString()}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClasses(r.severity)}`}>{r.severity}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {selectedTenant && (
              <div className="p-6 bg-card rounded-2xl border border-border shadow-lg">
                <Heading level={3} className="mb-4">Actions for {selectedTenant.tenantName}</Heading>
                <div className="flex flex-col gap-4">
                  <textarea
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Custom warning message..."
                    value={customWarnings[selectedTenant.tenantId] || ""}
                    onChange={(e) => setCustomWarnings({ ...customWarnings, [selectedTenant.tenantId]: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => openChatWithWarning(selectedTenant.tenantId, "Please settle your overdue rent.")}
                      className="bg-[#7D8B6F] text-white"
                    >
                      <MessageCircleWarning className="mr-2 w-4 h-4" />
                      Warn in Chat
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ReportsContent />
    </ProtectedRoute>
  )
}
