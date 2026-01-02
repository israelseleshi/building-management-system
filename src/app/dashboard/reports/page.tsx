"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { supabase } from "@/lib/supabaseClient"
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
  ThumbsUp,
  Calendar,
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
  const [severityFilterIncidents, setSeverityFilterIncidents] = useState<"all" | "low" | "medium" | "high">("all")
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
        const { data: { user } } = await supabase.auth.getUser()

        // If we don't have an authenticated user (e.g. local dev, auth not wired),
        // still show full mock data so the UI is never empty.
        if (!user) {
          const today = new Date()

          const mockReports: ReportTenant[] = [
            {
              tenantId: "mock-1",
              tenantName: "Abel Tesfaye",
              tenantEmail: "abel@example.com",
              propertyTitle: "Bole Sky Tower - Office 301",
              propertyCity: "Bole",
              monthlyRent: 25000,
              status: "active",
              daysLate: 12,
              timesLateBefore: 3,
              totalWarnings: 2,
              removedWarnings: 0,
              severity: "high",
            },
            {
              tenantId: "mock-2",
              tenantName: "Sara Bekele",
              tenantEmail: "sara@example.com",
              propertyTitle: "Bole Sky Tower - Retail 1A",
              propertyCity: "Bole",
              monthlyRent: 18000,
              status: "active",
              daysLate: 5,
              timesLateBefore: 1,
              totalWarnings: 1,
              removedWarnings: 0,
              severity: "medium",
            },
            {
              tenantId: "mock-3",
              tenantName: "Nahom Hailu",
              tenantEmail: "nahom@example.com",
              propertyTitle: "Bole Sky Tower - Apartment 302",
              propertyCity: "Bole",
              monthlyRent: 15000,
              status: "active",
              daysLate: 0,
              timesLateBefore: 2,
              totalWarnings: 1,
              removedWarnings: 1,
              severity: "low",
            },
            {
              tenantId: "mock-4",
              tenantName: "Lily Group PLC",
              tenantEmail: "contact@lilygroup.com",
              propertyTitle: "Bole Sky Tower - Office 8F",
              propertyCity: "Bole",
              monthlyRent: 42000,
              status: "active",
              daysLate: 30,
              timesLateBefore: 4,
              totalWarnings: 3,
              removedWarnings: 1,
              severity: "high",
            },
          ]

          const overdueOrRisk = mockReports.filter(r => r.daysLate > 0 || r.timesLateBefore > 0)
          const onTime = mockReports.filter(r => r.daysLate === 0 && r.timesLateBefore === 0)

          setReportTenants(overdueOrRisk)
          setTopPerformers(onTime.slice(0, 5))

          let mockIncidents: IncidentReport[] = overdueOrRisk.slice(0, 3).map((r, idx) => ({
            id: `mock-noauth-inc-${idx}`,
            tenantId: r.tenantId,
            tenantName: r.tenantName,
            propertyTitle: r.propertyTitle,
            category: ["Noise Complaint", "Parking", "Other"][idx % 3],
            description: "Neighbour reported an issue related to building rules.",
            severity: idx === 0 ? "high" : idx === 1 ? "medium" : "low",
            createdAt: new Date(today.getTime() - idx * 86400000).toISOString(),
          }))

          // Enrich with any tenant-submitted mock incidents stored in
          // localStorage by the tenant dashboard.
          try {
            const key = "mockTenantIncidents"
            const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
            if (raw) {
              const tenantIncidents = JSON.parse(raw) as any[]
              const mapped: IncidentReport[] = tenantIncidents.map((inc, idx) => ({
                id: inc.id || `tenant-inc-${idx}`,
                tenantId: "mock-tenant",
                tenantName: "Neighbour tenant",
                propertyTitle: inc.propertyTitle || "Reported Unit",
                category: inc.category || "Other",
                description: inc.message || "",
                severity: inc.severity || "medium",
                createdAt: inc.createdAt || new Date().toISOString(),
              }))
              mockIncidents = [...mapped, ...mockIncidents]
            }
          } catch {
            // ignore JSON / localStorage issues in mock mode
          }

          setIncidentReports(mockIncidents)
          return
        }

        // Load leases + tenants + properties similar to /dashboard/leases, but we only need a subset
        const { data: leases } = await supabase
          .from("leases")
          .select("id, tenant_id, property_id, monthly_rent, status, start_date, end_date")
          .eq("landlord_id", user.id)

        const tenantIds = Array.from(new Set((leases || []).map(l => l.tenant_id)))
        const propertyIds = Array.from(new Set((leases || []).map(l => l.property_id)))

        let tenants: any[] = []
        let properties: any[] = []

        if (tenantIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", tenantIds)
          tenants = data || []
        }

        if (propertyIds.length > 0) {
          const { data } = await supabase
            .from("properties")
            .select("id, title, city, monthly_rent")
            .in("id", propertyIds)
          properties = data || []
        }

        const today = new Date()

        // Build mock report tenants using real leases when available, but
        // always fall back to synthetic mock data so the UI is populated even
        // in an empty database.
        let reports: ReportTenant[] = (leases || []).map((lease, index) => {
          const tenant = tenants.find(t => t.id === lease.tenant_id)
          const property = properties.find(p => p.id === lease.property_id)

          const endDate = lease.end_date ? new Date(lease.end_date as string) : null
          const diffDays = endDate ? Math.max(0, Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))) : 0

          // Mock severity & counts based on index / days late
          const daysLate = diffDays
          const timesLateBefore = (index % 4) + (daysLate > 0 ? 1 : 0)
          const totalWarnings = timesLateBefore > 0 ? Math.max(1, Math.floor(timesLateBefore / 2)) : 0
          const removedWarnings = totalWarnings > 1 ? Math.floor(totalWarnings / 2) : 0

          let severity: "low" | "medium" | "high" = "low"
          if (daysLate >= 30 || timesLateBefore >= 4) severity = "high"
          else if (daysLate >= 10 || timesLateBefore >= 2) severity = "medium"

          return {
            tenantId: lease.tenant_id,
            tenantName: tenant?.full_name || "Tenant",
            tenantEmail: tenant?.email || "",
            propertyTitle: property?.title || "Property",
            propertyCity: property?.city || "",
            monthlyRent: Number(lease.monthly_rent) || 0,
            status: lease.status,
            daysLate,
            timesLateBefore,
            totalWarnings,
            removedWarnings,
            severity,
          }
        })

        // If there are no real leases yet, seed with pure mock tenants so
        // the landlord can see how the reports UI looks and behaves.
        if (reports.length === 0) {
          reports = [
            {
              tenantId: "mock-1",
              tenantName: "Abel Tesfaye",
              tenantEmail: "abel@example.com",
              propertyTitle: "Bole Sky Tower - Office 301",
              propertyCity: "Bole",
              monthlyRent: 25000,
              status: "active",
              daysLate: 12,
              timesLateBefore: 3,
              totalWarnings: 2,
              removedWarnings: 0,
              severity: "high",
            },
            {
              tenantId: "mock-2",
              tenantName: "Sara Bekele",
              tenantEmail: "sara@example.com",
              propertyTitle: "Bole Sky Tower - Retail 1A",
              propertyCity: "Bole",
              monthlyRent: 18000,
              status: "active",
              daysLate: 5,
              timesLateBefore: 1,
              totalWarnings: 1,
              removedWarnings: 0,
              severity: "medium",
            },
            {
              tenantId: "mock-3",
              tenantName: "Nahom Hailu",
              tenantEmail: "nahom@example.com",
              propertyTitle: "Bole Sky Tower - Apartment 302",
              propertyCity: "Bole",
              monthlyRent: 15000,
              status: "active",
              daysLate: 0,
              timesLateBefore: 2,
              totalWarnings: 1,
              removedWarnings: 1,
              severity: "low",
            },
            {
              tenantId: "mock-4",
              tenantName: "Lily Group PLC",
              tenantEmail: "contact@lilygroup.com",
              propertyTitle: "Bole Sky Tower - Office 8F",
              propertyCity: "Bole",
              monthlyRent: 42000,
              status: "active",
              daysLate: 30,
              timesLateBefore: 4,
              totalWarnings: 3,
              removedWarnings: 1,
              severity: "high",
            },
          ]
        }

        // Split into overdue/at-risk vs top performers (never late)
        let overdueOrRisk = reports.filter(r => r.daysLate > 0 || r.timesLateBefore > 0)
        let onTime = reports.filter(r => r.daysLate === 0 && r.timesLateBefore === 0)

        // If there are leases but none are currently at risk, still inject a
        // couple of mock at-risk tenants so the UI isn't empty.
        if ((leases || []).length > 0 && overdueOrRisk.length === 0) {
          const extraMocks: ReportTenant[] = [
            {
              tenantId: "mock-risk-1",
              tenantName: "Demo Late Tenant",
              tenantEmail: "late@example.com",
              propertyTitle: "Bole Sky Tower - Apartment 401",
              propertyCity: "Bole",
              monthlyRent: 20000,
              status: "active",
              daysLate: 7,
              timesLateBefore: 2,
              totalWarnings: 1,
              removedWarnings: 0,
              severity: "medium",
            },
            {
              tenantId: "mock-risk-2",
              tenantName: "Chronic Late Payer",
              tenantEmail: "chronic@example.com",
              propertyTitle: "Bole Sky Tower - Apartment 502",
              propertyCity: "Bole",
              monthlyRent: 30000,
              status: "active",
              daysLate: 18,
              timesLateBefore: 4,
              totalWarnings: 3,
              removedWarnings: 1,
              severity: "high",
            },
          ]

          overdueOrRisk = extraMocks
        }

        setReportTenants(overdueOrRisk)
        setTopPerformers(onTime.slice(0, 5))

        // Mock incident reports for now, based on first few tenants. The
        // description here represents the detailed message written by the
        // neighbour/tenant.
        let incidents: IncidentReport[] = overdueOrRisk.slice(0, 4).map((r, idx) => ({
          id: `incident-${idx}`,
          tenantId: r.tenantId,
          tenantName: r.tenantName,
          propertyTitle: r.propertyTitle,
          category: ["Noise Complaint", "Property Damage", "Parking", "Other"][idx % 4],
          description:
            idx % 4 === 0
              ? "Hello, I live next door and there has been very loud music and shouting past 11PM for the last three nights. It is making it difficult to sleep and work. Could you please ask the tenant to keep the noise down during quiet hours?"
              : idx % 4 === 1
              ? "I noticed damage to the shared hallway wall near this unit. It looks like furniture or heavy items have been dragged without care. This has happened more than once and is affecting the building appearance."
              : idx % 4 === 2
              ? "The tenant frequently parks in spots that are not assigned to them and sometimes blocks the driveway. This is causing problems for other residents when arriving home late."
              : "There is a strong smell of smoke and cooking from this unit that often spreads into the corridor. It has been happening several times a week and is uncomfortable for neighbours.",
          severity: idx % 3 === 0 ? "high" : idx % 2 === 0 ? "medium" : "low",
          createdAt: new Date(today.getTime() - idx * 86400000).toISOString(),
        }))

        if (incidents.length === 0) {
          incidents = [
            {
              id: "mock-inc-1",
              tenantId: "mock-1",
              tenantName: "Abel Tesfaye",
              propertyTitle: "Bole Sky Tower - Office 301",
              category: "Noise Complaint",
              description:
                "Hello, I live in the office next door and there has been very loud music and meetings going late into the night this entire week. It is making it hard for us to focus and rest.",
              severity: "high",
              createdAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
            },
            {
              id: "mock-inc-2",
              tenantId: "mock-2",
              tenantName: "Sara Bekele",
              propertyTitle: "Bole Sky Tower - Retail 1A",
              category: "Parking",
              description:
                "Customers of this shop are constantly parking in the spaces reserved for other tenants. Several times I could not find parking when coming back from work.",
              severity: "medium",
              createdAt: new Date(today.getTime() - 4 * 86400000).toISOString(),
            },
            {
              id: "mock-inc-3",
              tenantId: "mock-3",
              tenantName: "Nahom Hailu",
              propertyTitle: "Bole Sky Tower - Apartment 302",
              category: "Other",
              description:
                "There is a strong smell from this unit almost every evening. The odour spreads into the corridor and sometimes into neighbouring apartments as well.",
              severity: "low",
              createdAt: new Date(today.getTime() - 6 * 86400000).toISOString(),
            },
          ]
        }

        // Merge in any tenant-submitted mock incidents stored locally by the
        // tenant dashboard reports page so the landlord can see them.
        try {
          const key = "mockTenantIncidents"
          const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
          if (raw) {
            const tenantIncidents = JSON.parse(raw) as any[]
            const mapped: IncidentReport[] = tenantIncidents.map((inc, idx) => ({
              id: inc.id || `tenant-inc-${idx}`,
              tenantId: "mock-tenant",
              tenantName: "Neighbour tenant",
              propertyTitle: inc.propertyTitle || "Reported Unit",
              category: inc.category || "Other",
              description: inc.message || "",
              severity: inc.severity || "medium",
              createdAt: inc.createdAt || new Date().toISOString(),
            }))
            incidents = [...mapped, ...incidents]
          }
        } catch {
          // ignore JSON / localStorage errors in mock mode
        }

        setIncidentReports(incidents)
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
    await supabase.auth.signOut()
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

  let filteredReportTenants = reportTenants.filter(r => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      r.tenantName.toLowerCase().includes(q) ||
      r.tenantEmail.toLowerCase().includes(q) ||
      r.propertyTitle.toLowerCase().includes(q)

    const matchesSeverity =
      severityFilterTenants === "all" || r.severity === severityFilterTenants

    return matchesSearch && matchesSeverity
  })

  // If filters (search or severity) remove everything but we do have
  // tenants loaded, fall back to showing all tenants so the UI never
  // looks empty while we're in pure mock mode.
  if (filteredReportTenants.length === 0 && reportTenants.length > 0) {
    filteredReportTenants = reportTenants
  }

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
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-2xl p-5 border-0 flex items-start gap-4"
                style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
              >
                <div className="p-3 rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Overdue / At-Risk Tenants</Text>
                  <Heading level={3} className="text-2xl font-bold">
                    {reportTenants.length}
                  </Heading>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Tenants with late payments or repeated issues
                  </Text>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border-0 flex items-start gap-4"
                style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
              >
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Neighbour Incident Reports</Text>
                  <Heading level={3} className="text-2xl font-bold">
                    {incidentReports.length}
                  </Heading>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Based on neighbour feedback (mock data for now)
                  </Text>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border-0 flex items-start gap-4"
                style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm text-muted-foreground mb-1">Top On-Time Payers</Text>
                  <Heading level={3} className="text-2xl font-bold">
                    {topPerformers.length}
                  </Heading>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Tenants with clean payment behaviour
                  </Text>
                </div>
              </div>
            </div>

            {/* Overdue / At-Risk Tenants Table */}
            <div
              className="rounded-2xl border-0 overflow-hidden"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <Heading level={3} className="text-lg font-bold">
                    Rent Risk & Warnings
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    Flag tenants who are late on rent or have repeated issues
                  </Text>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["all", "low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverityFilterTenants(level as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        severityFilterTenants === level
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-background text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {level === "all" ? "All severities" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReportTenants.length === 0 ? (
                <div className="p-10 text-center">
                  <Heading level={3} className="mb-2">
                    No at-risk tenants
                  </Heading>
                  <Text className="text-muted-foreground">
                    All tenants are currently on good standing based on the mock data.
                  </Text>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="border-b border-border bg-background/60 hover:bg-background/60">
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Tenant</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Property</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Rent</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Days Late</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Times Late</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Warnings</TableHead>
                        <TableHead className="px-6 py-3 text-left font-semibold text-muted-foreground">Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReportTenants.map((r) => {
                        return (
                          <TableRow
                            key={r.tenantId}
                            className={`border-b border-border/70 hover:bg-background/60 cursor-pointer transition-colors ${
                              selectedTenantId === r.tenantId ? "bg-background/70" : ""
                            }`}
                            onClick={() => setSelectedTenantId(r.tenantId)}
                          >
                            <TableCell className="px-6 py-4 align-top">
                              <div className="flex flex-col">
                                <span className="font-medium">{r.tenantName}</span>
                                <span className="text-xs text-muted-foreground">{r.tenantEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              <div className="flex flex-col">
                                <span className="font-medium">{r.propertyTitle}</span>
                                {r.propertyCity && (
                                  <span className="text-xs text-muted-foreground">{r.propertyCity}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              <span className="font-semibold text-emerald-600">
                                ETB {r.monthlyRent.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              {r.daysLate > 0 ? (
                                <span className="font-semibold text-red-600">{r.daysLate} days</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">On time this period</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              <span className="font-medium">{r.timesLateBefore}</span>
                              <span className="block text-[11px] text-muted-foreground">historical late counts</span>
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{r.totalWarnings}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  Removed: {r.removedWarnings}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 align-top">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${getSeverityBadgeClasses(
                                  r.severity
                                )}`}
                              >
                                {r.severity === "high" ? (
                                  <AlertTriangle className="w-3 h-3" />
                                ) : r.severity === "medium" ? (
                                  <ShieldAlert className="w-3 h-3" />
                                ) : (
                                  <ThumbsUp className="w-3 h-3" />
                                )}
                                <span className="capitalize">{r.severity}</span>
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {selectedTenant && (
              <div
                className="rounded-2xl border-0 overflow-hidden"
                style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
              >
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <Heading level={3} className="text-lg font-bold">
                      Selected Tenant
                    </Heading>
                    <Text className="text-sm text-muted-foreground">
                      Review profile and send a custom warning or appreciation message.
                    </Text>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-lg"
                    onClick={() => setSelectedTenantId(null)}
                  >
                    Clear selection
                  </Button>
                </div>
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
                  <div className="space-y-2">
                    <Heading level={4} className="text-base font-semibold">
                      {selectedTenant.tenantName}
                    </Heading>
                    <Text className="text-xs text-muted-foreground">{selectedTenant.tenantEmail}</Text>
                    <Text className="text-sm font-medium mt-2">{selectedTenant.propertyTitle}</Text>
                    {selectedTenant.propertyCity && (
                      <Text className="text-xs text-muted-foreground">{selectedTenant.propertyCity}</Text>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Rent: ETB {selectedTenant.monthlyRent.toLocaleString()}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                        {selectedTenant.daysLate > 0
                          ? `${selectedTenant.daysLate} days late`
                          : "On time this period"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        {selectedTenant.timesLateBefore} times late before
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <textarea
                      rows={3}
                      placeholder="Write custom warning or message..."
                      className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
                      value={customWarnings[selectedTenant.tenantId] || ""}
                      onChange={(e) =>
                        setCustomWarnings((prev) => ({
                          ...prev,
                          [selectedTenant.tenantId]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg flex items-center gap-1 text-xs"
                        onClick={() => {
                          const base =
                            selectedTenant.daysLate > 0
                              ? `Dear ${selectedTenant.tenantName}, your rent payment is ${selectedTenant.daysLate} day(s) overdue for ${selectedTenant.propertyTitle}. Please settle it as soon as possible.`
                              : `Dear ${selectedTenant.tenantName}, we have noticed repeated delays in your rent payments for ${selectedTenant.propertyTitle}. Please make sure to pay on time going forward.`
                          openChatWithWarning(selectedTenant.tenantId, base, false)
                        }}
                      >
                        <MessageCircleWarning className="w-4 h-4" />
                        Warn in Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs"
                        onClick={() => {
                          const base =
                            selectedTenant.daysLate > 0
                              ? `Dear ${selectedTenant.tenantName}, your rent payment is ${selectedTenant.daysLate} day(s) overdue for ${selectedTenant.propertyTitle}. Please settle it as soon as possible.`
                              : `Dear ${selectedTenant.tenantName}, we have noticed repeated delays in your rent payments for ${selectedTenant.propertyTitle}. Please make sure to pay on time going forward.`
                          openChatWithWarning(selectedTenant.tenantId, base, true)
                        }}
                      >
                        Send from Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Neighbour Incident Reports (mock) */}
            <div
              className="rounded-2xl border-0 overflow-hidden"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <Heading level={3} className="text-lg font-bold">
                    Neighbour Incident Reports
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    Suggestions from neighbouring tenants about behaviour and building rule abuses (mock for now)
                  </Text>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["all", "low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverityFilterIncidents(level as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        severityFilterIncidents === level
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-background text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {level === "all" ? "All severities" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {incidentReports.filter((inc) => severityFilterIncidents === "all" || inc.severity === severityFilterIncidents).length === 0 ? (
                <div className="p-8 text-center">
                  <Text className="text-muted-foreground">
                    No incident reports yet. In a later phase, tenants will be able to submit these from their dashboard.
                  </Text>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {incidentReports
                    .filter((inc) => severityFilterIncidents === "all" || inc.severity === severityFilterIncidents)
                    .map((inc) => {
                    const warningText = `Neighbour report from another tenant regarding ${inc.category} at ${inc.propertyTitle}:\n\n"${inc.description}"\n\nPlease review this behaviour and respond appropriately.`

                    return (
                      <div key={inc.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{inc.tenantName}</span>
                              <span className="text-xs text-muted-foreground">• {inc.propertyTitle}</span>
                            </div>
                            <Text className="text-xs text-muted-foreground mb-1">
                              {inc.category} • {new Date(inc.createdAt).toLocaleDateString()}
                            </Text>
                            <Text className="text-sm">
                              {inc.description}
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:flex-col md:items-end">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${getSeverityBadgeClasses(
                              inc.severity
                            )}`}
                          >
                            <span className="capitalize">{inc.severity}</span>
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-xs mt-1"
                            onClick={() => openChatWithWarning(inc.tenantId, warningText, false)}
                          >
                            Discuss in Chat
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Top Performers */}
            <div
              className="rounded-2xl border-0 overflow-hidden"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <Heading level={3} className="text-lg font-bold">
                    Top Performing Tenants
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    Tenants who consistently pay rent on time (mocked from your current leases)
                  </Text>
                </div>
              </div>

              {topPerformers.length === 0 ? (
                <div className="p-8 text-center">
                  <Text className="text-muted-foreground">
                    Once you have more leases, you will see your most reliable tenants here.
                  </Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {topPerformers.map((t, idx) => (
                    <div
                      key={t.tenantId}
                      className="rounded-2xl p-5 border-0 flex flex-col gap-3"
                      style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="text-xs text-muted-foreground mb-1">Top #{idx + 1}</Text>
                          <Heading level={4} className="text-base font-semibold">
                            {t.tenantName}
                          </Heading>
                          <Text className="text-xs text-muted-foreground">{t.propertyTitle}</Text>
                        </div>
                        <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                          <ThumbsUp className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-2">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Calendar className="w-3 h-3" />
                          <span>On-time payer</span>
                        </div>
                        <span className="font-semibold">ETB {t.monthlyRent.toLocaleString()}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 rounded-lg text-xs"
                        onClick={() => openChatWithWarning(t.tenantId, `Thank you ${t.tenantName} for consistently paying your rent on time. We appreciate you as a tenant.`, false)}
                      >
                        Send Appreciation
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
