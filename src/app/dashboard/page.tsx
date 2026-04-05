"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Text, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { API_BASE_URL, getAuthToken, apiGet } from "@/lib/apiClient"
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Settings,
  Building2,
  Users,
  FileText,
  ClipboardList,
  Clock3,
  Wrench
} from "lucide-react"

export default function LandlordDashboard() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <DashboardContent />
    </ProtectedRoute>
  )
}

function OccupancyLegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-medium text-[#2F7FBF]">
      <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
}

function DashboardContent() {
  const SIDEBAR_COLLAPSED_KEY = "bms.dashboard.sidebarCollapsed"
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  })
  
  // Determine active tab based on current pathname
  // IMPORTANT: Check more specific paths first to avoid partial matches
  let activeTab = "dashboard"
  if (pathname === "/dashboard/leases" || pathname.startsWith("/dashboard/leases/")) {
    activeTab = "leases"
  } else if (pathname === "/dashboard/listings" || pathname.startsWith("/dashboard/listings/")) {
    activeTab = "listings"
  } else if (pathname === "/dashboard/create" || pathname.startsWith("/dashboard/create/")) {
    activeTab = "create"
  } else if (pathname === "/dashboard/employees" || pathname.startsWith("/dashboard/employees/")) {
    activeTab = "employees"
  } else if (pathname === "/dashboard/documents" || pathname.startsWith("/dashboard/documents/")) {
    activeTab = "documents"
  } else if (pathname === "/dashboard/chat" || pathname.startsWith("/dashboard/chat/")) {
    activeTab = "chat"
  } else if (pathname === "/dashboard/payouts" || pathname.startsWith("/dashboard/payouts/")) {
    activeTab = "payouts"
  } else if (pathname === "/dashboard/analytics" || pathname.startsWith("/dashboard/analytics/")) {
    activeTab = "analytics"
  } else if (pathname === "/dashboard/reports" || pathname.startsWith("/dashboard/reports/")) {
    activeTab = "reports"
  } else if (pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")) {
    activeTab = "settings"
  }
  const [loading, setLoading] = useState(true)
  const [buildingInfo, setBuildingInfo] = useState<{ name: string; address: string } | null>(null)
  const [buildingMotto, setBuildingMotto] = useState("")
  const [userName, setUserName] = useState<string>("Owner")
  const [buildingLogo, setBuildingLogo] = useState<string | null>(null)
  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [dashboardSummary, setDashboardSummary] = useState({
    totalUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    totalRevenue: 0,
  })

  const readCachedMotto = (resolvedBuildingId?: string | null) => {
    if (typeof window === "undefined") return ""
    const scopedMotto = resolvedBuildingId ? localStorage.getItem(`bms.buildingMotto.${resolvedBuildingId}`) : ""
    const globalMotto = localStorage.getItem("bms.buildingMotto.current")
    return (scopedMotto || globalMotto || "").trim()
  }

  // Fetch dashboard metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) {
          return
        }

        const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs = 15000) => {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), timeoutMs)
          try {
            const response = await fetch(url, { ...init, signal: controller.signal }).catch(err => {
              console.warn(`Fetch to ${url} failed or was unreachable:`, err)
              return null
            })
            return response
          } finally {
            clearTimeout(timeout)
          }
        }

        const parseJsonResponse = async <T,>(response: Response, label: string): Promise<T | null> => {
          const contentType = response.headers.get("content-type") || ""
          const rawBody = await response.text()
          if (!rawBody) return null
          if (!contentType.toLowerCase().includes("application/json")) {
            console.warn(`Skipping non-JSON response from ${label}`)
            return null
          }
          try {
            return JSON.parse(rawBody) as T
          } catch (error) {
            console.warn(`Failed to parse JSON from ${label}`, error)
            return null
          }
        }
        
        // Try to get user profile for the name
        try {
          const profilePayload = await apiGet<any>("/user/me").catch(() => null)
          if (profilePayload && profilePayload.success) {
            const user = profilePayload.data.user
            setUserName(user.first_name || user.full_name?.split(" ")[0] || "Owner")
          }
        } catch (e) {
          console.error("Failed to fetch profile from /user/me, trying /profiles/me", e)
          try {
            const profilePayload = await apiGet<any>("/profiles/me").catch(() => null)
            if (profilePayload && profilePayload.success) {
              const user = profilePayload.data.profile || profilePayload.data
              setUserName(user.first_name || user.full_name?.split(" ")[0] || "Owner")
            }
          } catch (e2) {
            console.error("Failed to fetch profile from /profiles/me", e2)
          }
        }

        const buildingsRes = await fetchWithTimeout(
          `${API_BASE_URL}/buildings`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
          15000
        )

        if (!buildingsRes || !buildingsRes.ok) {
          console.warn("Buildings service unreachable or returned error")
          setLoading(false)
          return
        }

        const buildingsPayload = await parseJsonResponse<any>(buildingsRes, "/buildings")
        if (!buildingsPayload) {
          console.warn("Buildings response was not valid JSON")
          return
        }
        if (buildingsPayload?.success === false) {
          throw new Error(buildingsPayload?.error || buildingsPayload?.message || "Failed to load buildings")
        }

        const buildings = buildingsPayload?.data?.buildings || []
        const buildingIds: string[] = buildings
          .map((b: any) => (b?.building_id ?? b?.id)?.toString())
          .filter((id: any) => typeof id === "string" && id.length > 0)
        
        if (buildings.length > 0) {
          const primaryBuildingId = (buildings[0]?.building_id ?? buildings[0]?.id)?.toString?.() || null
          setBuildingId(primaryBuildingId)
          const cachedMotto = readCachedMotto(primaryBuildingId)
          setBuildingInfo({
            name: buildings[0].name || "My Building",
            address: buildings[0].address || "Addis Ababa, Ethiopia"
          })
          setBuildingMotto(cachedMotto || buildings[0]?.motto || buildings[0]?.tagline || "")
          // Set initial logo if exists in building data
          if (buildings[0].logo_url) {
            setBuildingLogo(buildings[0].logo_url)
          }
        }

        if (buildingIds.length === 0) {
          return
        }

        const unitResults = await Promise.allSettled(
          buildingIds.map(async (buildingId) => {
            const unitsRes = await fetchWithTimeout(
              `${API_BASE_URL}/buildings/${buildingId}/units`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
              15000
            )
            if (!unitsRes || !unitsRes.ok) return []
            const unitsPayload = await parseJsonResponse<any>(
              unitsRes,
              `/buildings/${buildingId}/units`
            )
            if (!unitsPayload) return []
            if (unitsPayload?.success === false) return []
            return (unitsPayload?.data?.units || []).map((unit: any) => ({ unit, buildingId }))
          })
        )

        const units: {
          status: "vacant" | "occupied" | "maintenance"
          rentAmount: number
          tenantName: string | null
        }[] = []

        for (const result of unitResults) {
          if (result.status !== "fulfilled") continue
          for (const item of result.value) {
            const rawStatus = item.unit.status || "vacant"
            const normalizedStatus: "vacant" | "occupied" | "maintenance" =
              rawStatus === "occupied" || rawStatus === "maintenance" ? rawStatus : "vacant"
            const resolvedRent = item.unit.rent_amount ?? item.unit.base_rent ?? 0
            units.push({
              status: normalizedStatus,
              rentAmount: Number(resolvedRent || 0),
              tenantName: item.unit.tenant_name || (item.unit.leases?.[0]?.tenant?.full_name) || null,
            })
          }
        }

        const totalUnits = units.length
        const totalRevenue = units.reduce((sum: number, unit: any) => sum + (unit.rentAmount || 0), 0)
        const occupiedUnits = units.filter((u: any) => u.status === "occupied").length
        const vacantUnits = units.filter((u: any) => u.status === "vacant").length
        setDashboardSummary({
          totalUnits,
          occupiedUnits,
          vacantUnits,
          totalRevenue,
        })

      } catch (err) {
        console.error('Error fetching metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!buildingId) return
    const cachedLogo = localStorage.getItem(`bms.buildingLogo.${buildingId}`)
    const cachedMotto = readCachedMotto(buildingId)
    if (cachedLogo) {
      setBuildingLogo(cachedLogo)
    }
    if (cachedMotto) {
      setBuildingMotto(cachedMotto)
    }
  }, [buildingId])

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncMotto = () => {
      const cachedMotto = readCachedMotto(buildingId)
      if (cachedMotto) {
        setBuildingMotto(cachedMotto)
      }
    }

    window.addEventListener("focus", syncMotto)
    window.addEventListener("storage", syncMotto)
    return () => {
      window.removeEventListener("focus", syncMotto)
      window.removeEventListener("storage", syncMotto)
    }
  }, [buildingId])

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const navItems = useMemo(() => [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: activeTab === "dashboard"
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: activeTab === "listings"
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: activeTab === "create"
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: activeTab === "employees"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Rents",
      path: "/dashboard/leases",
      active: activeTab === "leases"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Documents",
      path: "/dashboard/documents",
      active: activeTab === "documents"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: activeTab === "chat"
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Reports",
      path: "/dashboard/reports",
      active: activeTab === "reports"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: activeTab === "payouts"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: activeTab === "analytics"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: activeTab === "settings"
    }
  ], [activeTab])

  const handleLogout = () => {
    // Clear authentication state from localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    
    // Clear authentication state from cookies
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    // Redirect to sign-in page
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const collectionStats = useMemo(() => {
    const totalUnits = dashboardSummary.totalUnits || 0
    const occupiedUnits = dashboardSummary.occupiedUnits || 0
    const vacantUnits = dashboardSummary.vacantUnits || 0
    const totalRevenue = dashboardSummary.totalRevenue || 0
    const collectedRatio = totalUnits > 0 ? occupiedUnits / totalUnits : 0
    const unpaidRatio = Math.max(1 - collectedRatio, 0)
    const collectedAmount = totalRevenue * collectedRatio
    const outstandingAmount = totalRevenue - collectedAmount

    return {
      collectedRatio,
      unpaidRatio,
      collectedAmount,
      outstandingAmount,
      paidUnits: occupiedUnits,
      dueUnits: vacantUnits,
      totalUnits,
    }
  }, [dashboardSummary])

  const occupancyStats = useMemo(() => {
    const totalUnits = dashboardSummary.totalUnits || 0
    const vacantUnits = dashboardSummary.vacantUnits || 0
    const occupiedUnits = dashboardSummary.occupiedUnits || 0

    const vacantUnlisted = Math.ceil(vacantUnits / 2)
    const vacantListed = Math.max(vacantUnits - vacantUnlisted, 0)
    const occupiedListed = Math.max(Math.round(occupiedUnits * 0.18), 0)
    const occupiedUnlisted = Math.max(occupiedUnits - occupiedListed, 0)

    return {
      totalUnits,
      vacantUnits,
      occupiedUnits,
      vacantUnlisted,
      vacantListed,
      occupiedUnlisted,
      occupiedListed,
    }
  }, [dashboardSummary])

  const currentMonthName = useMemo(
    () => new Date().toLocaleString("en-US", { month: "long" }),
    []
  )
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const monthOptions = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  )
  const yearOptions = useMemo(
    () => Array.from({ length: currentYear - 2017 + 1 }, (_, index) => currentYear - index),
    [currentYear]
  )
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName)
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())

  const displayedCollectionStats = useMemo(() => {
    const monthIndex = monthOptions.indexOf(selectedMonth)
    const normalizedMonthIndex = monthIndex >= 0 ? monthIndex : 0
    const yearOffset = Number(selectedYear) - currentYear
    const seasonality = 0.82 + normalizedMonthIndex * 0.028 + yearOffset * 0.015
    const safeSeasonality = Math.max(0.62, Math.min(1.18, seasonality))
    const collectedRatio = Math.max(
      0.18,
      Math.min(0.96, collectionStats.collectedRatio * (0.88 + normalizedMonthIndex * 0.015 - yearOffset * 0.01))
    )
    const unpaidRatio = Math.max(1 - collectedRatio, 0)
    const totalAmount = dashboardSummary.totalRevenue * safeSeasonality
    const collectedAmount = totalAmount * collectedRatio
    const outstandingAmount = totalAmount - collectedAmount
    const paidUnits = Math.min(
      collectionStats.totalUnits,
      Math.max(0, Math.round(collectionStats.totalUnits * collectedRatio))
    )
    const dueUnits = Math.max(collectionStats.totalUnits - paidUnits, 0)

    return {
      collectedRatio,
      unpaidRatio,
      totalAmount,
      collectedAmount,
      outstandingAmount,
      paidUnits,
      dueUnits,
      totalUnits: collectionStats.totalUnits,
    }
  }, [collectionStats, currentYear, dashboardSummary.totalRevenue, monthOptions, selectedMonth, selectedYear])

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen overflow-hidden flex">
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onLogout={handleLogout}
          appBrandName="BMS"
        />

        <div className="flex-1 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden min-h-0">
          <DashboardHeader
            title="Dashboard"
            subtitle="Loading your dashboard..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={toggleSidebar}
          />

          <main className="p-6 flex items-center justify-center min-h-96 flex-1 overflow-y-auto min-h-0">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Text className="text-muted-foreground">Loading dashboard metrics...</Text>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        appBrandName="BMS"
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden min-h-0">
        <DashboardHeader
          title={`Welcome back, ${userName}`}
          subtitle={buildingInfo ? `Managing ${buildingInfo.name}` : "Welcome back to your landlord dashboard"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          buildingName={buildingInfo?.name}
          buildingAddress={buildingInfo?.address}
          buildingMotto={buildingMotto}
          buildingLogo={buildingLogo}
          appBrandName="BMS"
          onToggleSidebar={toggleSidebar}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-6">
          <div className="w-full max-w-7xl mx-auto overflow-hidden px-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="mb-4 grid grid-cols-12 items-end gap-6 lg:col-span-12">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="text-[13px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                        Collection - {selectedMonth}
                      </div>
                      <div className="flex items-center gap-3 sm:self-auto">
                        <span className="text-sm font-semibold text-foreground/70">Show By</span>
                        <select
                          aria-label="Show collection by month"
                          value={selectedMonth}
                          onChange={(event) => setSelectedMonth(event.target.value)}
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-foreground outline-none"
                        >
                          {monthOptions.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Show collection by year"
                          value={selectedYear}
                          onChange={(event) => setSelectedYear(event.target.value)}
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-foreground outline-none"
                        >
                          {yearOptions.map((year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex gap-3">
                      <Button
                        className="h-10 flex-1 justify-center rounded-md px-4 py-2 text-sm font-semibold"
                        style={{
                          backgroundColor: "#3096DA",
                          color: "#FFFFFF",
                          boxShadow: "0 4px 12px rgba(48, 150, 218, 0.32)",
                        }}
                        onClick={() => router.push("/dashboard/create")}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Listing
                      </Button>
                      <Button
                        className="h-10 flex-1 justify-center rounded-md px-4 py-2 text-sm font-semibold"
                        style={{
                          backgroundColor: "#3096DA",
                          color: "#FFFFFF",
                          boxShadow: "0 4px 12px rgba(48, 150, 218, 0.32)",
                        }}
                        onClick={() => router.push("/dashboard/attendance")}
                      >
                        <Clock3 className="mr-2 h-4 w-4" />
                        Attendance
                      </Button>
                    </div>
                  </div>
                </div>

                <div 
                  className="lg:col-span-8 space-y-6"
                >
                  <div
                    className="relative rounded-2xl px-4 pb-5 pt-12 transition-all duration-300 shadow-sm sm:px-5"
                    style={{
                      backgroundColor: "var(--card)",
                      boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                    }}
                  >
                    <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2">
                      <div
                        className="relative flex h-36 w-36 items-center justify-center rounded-full"
                        style={{
                            background: `conic-gradient(#4DB6A1 0deg ${Math.round(displayedCollectionStats.collectedRatio * 360)}deg, #E15949 ${Math.round(displayedCollectionStats.collectedRatio * 360)}deg 360deg)`,
                        }}
                      >
                        <div
                          className="flex h-24 w-24 flex-col items-center justify-center rounded-full text-center"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <div className="text-[0.92rem] font-semibold text-foreground">
                            {selectedMonth}
                          </div>
                          <div className="text-[0.98rem] font-bold text-foreground">
                            {selectedYear}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-14 flex w-full flex-col justify-between gap-6 px-2 lg:flex-row lg:px-5">
                      <div className="w-full space-y-4 text-left lg:w-1/3 lg:-mt-20">
                        <div className="lg:ml-14">
                          <div className="text-[16px] font-bold leading-none text-[#C45B43]">
                            {(displayedCollectionStats.unpaidRatio * 100).toFixed(0)}%
                          </div>
                          <div className="mt-1.5 text-[0.82rem] font-bold uppercase tracking-[0.05em] text-[#C45B43]">
                            Unpaid
                          </div>
                        </div>
                        <div>
                          <Text className="text-[12px] font-bold uppercase tracking-[0.05em] text-foreground/75">Outstanding</Text>
                          <div className="mt-2.5 flex items-start gap-2">
                            <span className="pt-1 text-xs font-semibold text-[#C45B43]">ETB</span>
                            <span className="text-[20px] font-bold leading-none text-[#C45B43]">
                              {displayedCollectionStats.outstandingAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Text className="text-[12px] font-bold uppercase tracking-[0.05em] text-foreground/70">Units with Invoices Due</Text>
                          <div className="mt-2.5 text-[18px] font-bold text-foreground">
                            {displayedCollectionStats.dueUnits}/{displayedCollectionStats.totalUnits || 0}
                          </div>
                          <button type="button" className="mt-1.5 text-[11px] font-semibold text-[#2F7FBF] underline underline-offset-2">
                            View All
                          </button>
                        </div>
                      </div>

                      <div className="w-full space-y-2.5 text-center lg:w-1/3">
                        <div className="text-[0.82rem] font-semibold text-foreground/70">Processing: ETB 0.00</div>
                        <div className="text-[15px] font-bold text-foreground">
                          Total: ETB {displayedCollectionStats.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="pt-1 text-[0.82rem] font-semibold text-[#C45B43]">Past Outstanding</div>
                        <div className="text-[18px] font-bold text-[#C45B43]">ETB 0.00</div>
                      </div>

                      <div className="w-full space-y-4 text-left lg:w-1/3 lg:-mt-20 lg:text-right">
                        <div className="lg:mr-14">
                          <div className="text-[16px] font-bold leading-none text-[#4DB6A1]">
                            {(displayedCollectionStats.collectedRatio * 100).toFixed(0)}%
                          </div>
                          <div className="mt-1.5 text-[0.82rem] font-bold uppercase tracking-[0.05em] text-[#4DB6A1]">
                            Collected
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] font-bold uppercase tracking-[0.05em] text-foreground/70">Collected</div>
                          <div className="mt-2.5 flex items-start gap-2 lg:justify-end">
                            <span className="pt-1 text-xs font-semibold text-[#4DB6A1]">ETB</span>
                            <span className="text-[20px] font-bold leading-none text-[#4DB6A1]">
                              {displayedCollectionStats.collectedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] font-bold uppercase tracking-[0.05em] text-foreground/70">Units with Invoices Paid</div>
                          <div className="mt-2.5 text-[18px] font-bold text-foreground">
                            {displayedCollectionStats.paidUnits}/{displayedCollectionStats.totalUnits || 0}
                          </div>
                          <button type="button" className="mt-1.5 text-[11px] font-semibold text-[#2F7FBF] underline underline-offset-2">
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <RevenueChart />
                </div>
                <div className="col-span-1 flex flex-col gap-6 lg:col-span-4">
                  <div
                    className="rounded-2xl p-5 transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                    }}
                  >
                    <div className="mb-4 flex w-full flex-row items-center gap-2 border-b border-gray-400/40 pb-3 pr-4">
                      <Building2 className="h-[18px] w-[18px] flex-shrink-0 text-gray-700" />
                      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-800">
                        Occupancy Statistics
                      </span>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-4">
                        <div>
                          <div className="text-base font-semibold text-foreground">Vacant Units</div>
                          <div className="mt-2.5 space-y-2">
                            <OccupancyLegendDot color="#E15949" label={`${occupancyStats.vacantUnlisted} unlisted`} />
                            <OccupancyLegendDot color="#F08B7E" label={`${occupancyStats.vacantListed} listed`} />
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-semibold text-foreground">Occupied Units</div>
                          <div className="mt-2.5 space-y-2">
                            <OccupancyLegendDot color="#4DB6A1" label={`${occupancyStats.occupiedUnlisted} unlisted`} />
                            <OccupancyLegendDot color="#7CD3C2" label={`${occupancyStats.occupiedListed} listed`} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center lg:justify-end">
                        <div
                          className="relative flex h-32 w-32 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(
                              #E15949 0deg ${(occupancyStats.vacantUnlisted / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg,
                              #F08B7E ${(occupancyStats.vacantUnlisted / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg ${((occupancyStats.vacantUnlisted + occupancyStats.vacantListed) / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg,
                              #4DB6A1 ${((occupancyStats.vacantUnlisted + occupancyStats.vacantListed) / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg ${((occupancyStats.vacantUnlisted + occupancyStats.vacantListed + occupancyStats.occupiedUnlisted) / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg,
                              #7CD3C2 ${((occupancyStats.vacantUnlisted + occupancyStats.vacantListed + occupancyStats.occupiedUnlisted) / Math.max(occupancyStats.totalUnits || 1, 1)) * 360}deg 360deg
                            )`,
                          }}
                        >
                          <div
                            className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full text-center"
                            style={{ backgroundColor: "var(--background)" }}
                          >
                            <div className="text-[1.35rem] font-bold leading-none text-foreground">
                              {occupancyStats.totalUnits}
                            </div>
                            <div className="mt-1 text-[11px] font-medium text-foreground/80">Total units</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-5 transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                    }}
                  >
                    <div className="mb-4 flex w-full flex-row items-center gap-2 border-b border-gray-400/40 pb-3 pr-4">
                      <Wrench className="h-[18px] w-[18px] flex-shrink-0 text-gray-700" />
                      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-800">
                        Open Maintenance Requests
                      </span>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4">
                      <div
                        className="rounded-md border border-gray-300/60 bg-[#F9F7F1] px-4 py-6 text-center transition-colors"
                        style={{ boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)" }}
                      >
                        <div className="text-[40px] font-bold leading-none text-[#4DB89C]">0</div>
                        <div className="mt-3 text-xs font-medium text-gray-600">New Requests</div>
                      </div>
                      <div
                        className="rounded-md border border-gray-300/60 bg-[#F9F7F1] px-4 py-6 text-center transition-colors"
                        style={{ boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)" }}
                      >
                        <div className="text-[40px] font-bold leading-none text-[#E05B4D]">1</div>
                        <div className="mt-3 text-xs font-medium text-gray-600">Urgent Requests</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-5 transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                    }}
                  >
                    <div className="mb-4 flex w-full flex-row items-center gap-2 border-b border-gray-400/40 pb-3 pr-4">
                      <ClipboardList className="h-[18px] w-[18px] flex-shrink-0 text-gray-700" />
                      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-800">
                        Applications Processing
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between bg-transparent p-2">
                        <div>
                          <Text weight="medium" className="text-sm font-semibold text-foreground">Lily Smith</Text>
                          <MutedText className="mt-1 text-xs text-gray-500">Applied on May 14, 2021</MutedText>
                        </div>
                        <div className="flex items-center gap-10 text-lg font-semibold text-foreground">
                          <span>-</span>
                          <span>-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
