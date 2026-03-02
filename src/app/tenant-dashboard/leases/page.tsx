"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Text, Heading } from "@/components/ui/typography"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Settings,
  FileText,
  Eye,
  Calendar,
  DollarSign,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Download,
} from "lucide-react"

interface Lease {
  id: string
  tenant_id: string
  unit_id: string
  rent_amount: number
  status: "pending" | "active" | "inactive" | "expired"
  start_date: string
  end_date: string
  created_at: string
}

function TenantLeasesContent() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const locale = useLocale()
  const dateLocale = locale === "am" ? "am-ET" : "en-US"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null)

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: false,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: false,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "My Rents",
      path: "/tenant-dashboard/leases",
      active: true,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: false,
    },
  ]

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/leases`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const payload = await response.json().catch(() => ({}))

        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.error || payload?.message || "Failed to load leases")
        }

        setLeases(payload?.data?.leases || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "expired":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "expired":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <X className="w-4 h-4" />
    }
  }

  const stats = [
    {
      title: t("leases.stats.active"),
      value: leases.filter(l => l.status === "active").length,
      icon: <CheckCircle className="w-8 h-8" />,
      color: "text-emerald-600",
    },
    {
      title: t("leases.stats.pending"),
      value: leases.filter(l => l.status === "pending").length,
      icon: <Clock className="w-8 h-8" />,
      color: "text-yellow-600",
    },
    {
      title: t("leases.stats.monthlyRent"),
      value: `ETB ${(leases.filter(l => l.status === "active").reduce((sum, l) => sum + l.rent_amount, 0) / 1000).toFixed(1)}K`,
      icon: <DollarSign className="w-8 h-8" />,
      color: "text-purple-600",
    },
  ]

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const handleLogout = async () => {
    const token = getAuthToken()
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  const getStatusLabel = (status: Lease["status"]) => {
    return t(`leases.status.${status}`)
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
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
          title={t("leases.header.title")}
          subtitle={t("leases.header.subtitle")}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={`lease-stat-${index}`}
                  className="rounded-2xl p-5 md:p-6 border-0 group hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: "var(--card)",
                    boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Text className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </Text>
                      <Heading level={3} className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </Heading>
                    </div>
                    <div className={`p-2 rounded-lg bg-white/50 group-hover:scale-110 transition-transform ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="mb-6">
              <Heading level={2} className="mb-1">
                {t("leases.section.title")}
              </Heading>
              <Text className="text-muted-foreground">
                {t("leases.section.subtitle")}
              </Text>
            </div>

            {/* Leases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leases.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <Heading level={3} className="mb-2">
                    {t("leases.empty.title")}
                  </Heading>
                  <Text className="text-muted-foreground">
                    {t("leases.empty.subtitle")}
                  </Text>
                </div>
              ) : (
                leases.map((lease, index) => {
                  const leaseKey = lease.id || `lease-${index}`
                  const daysRemaining = Math.ceil(
                    (new Date(lease.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div
                      key={leaseKey}
                      className="rounded-2xl p-6 border-0 group hover:shadow-lg transition-all duration-300 flex flex-col"
                      style={{
                        backgroundColor: "var(--card)",
                        boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                            <Home className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <Text className="font-semibold line-clamp-1">
                              {t("leases.unitLabel", { id: lease.unit_id })}
                            </Text>
                            <Text className="text-xs text-muted-foreground line-clamp-1">
                              {t("leases.leaseIdLabel", { id: lease.id })}
                            </Text>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${getStatusColor(lease.status)}`}>
                          {getStatusIcon(lease.status)}
                          <span className="capitalize">{getStatusLabel(lease.status)}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border mb-4"></div>

                      {/* Rent Info */}
                      <div className="mb-4">
                        <Text className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          {t("leases.monthlyRent")}
                        </Text>
                        <Text className="text-2xl font-bold text-emerald-600">ETB {(lease.rent_amount ?? 0).toLocaleString()}</Text>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <Text className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                            {t("leases.startDate")}
                          </Text>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <Text className="text-sm">{new Date(lease.start_date).toLocaleDateString(dateLocale)}</Text>
                          </div>
                        </div>
                        <div>
                          <Text className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                            {t("leases.endDate")}
                          </Text>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <Text className="text-sm">{new Date(lease.end_date).toLocaleDateString(dateLocale)}</Text>
                          </div>
                        </div>
                      </div>

                      {/* Days Remaining */}
                      {lease.status === "active" && (
                        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <Text className="text-xs font-semibold text-blue-900 mb-1">
                            {t("leases.daysRemaining")}
                          </Text>
                          <Text className="text-lg font-bold text-blue-600">
                            {daysRemaining > 0
                              ? t("leases.daysCount", { count: daysRemaining })
                              : t("leases.expired")}
                          </Text>
                        </div>
                      )}

                      {/* View Details Button */}
                      <Button
                        onClick={() => {
                          setSelectedLease(lease)
                          setViewModalOpen(true)
                        }}
                        className="w-full bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg mt-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("leases.viewDetails")}
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* View Lease Details Modal */}
      {selectedLease && (
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-2xl" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
            <DialogHeader>
              <DialogTitle className="text-2xl">{t("leases.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("leases.dialog.subtitle")}
              </DialogDescription>
            </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                      {/* Property Info */}
                      <div className="space-y-2">
                        <Text className="text-xs font-semibold text-muted-foreground uppercase">
                          {t("leases.dialog.property")}
                        </Text>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                            <Home className="w-6 h-6" />
                          </div>
                          <div>
                            <Text className="font-semibold">
                              {t("leases.unitLabel", { id: selectedLease.unit_id })}
                            </Text>
                            <Text className="text-sm text-muted-foreground">
                              {t("leases.leaseIdLabel", { id: selectedLease.id })}
                            </Text>
                          </div>
                        </div>
                      </div>

                      {/* Monthly Rent */}
                      <div className="space-y-2">
                        <Text className="text-xs font-semibold text-muted-foreground uppercase">
                          {t("leases.monthlyRent")}
                        </Text>
                        <Text className="text-2xl font-bold text-emerald-600">
                          ETB {(selectedLease.rent_amount ?? 0).toLocaleString()}
                        </Text>
                      </div>

              {/* Status */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.statusLabel")}
                </Text>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedLease.status)}`}>
                  {getStatusIcon(selectedLease.status)}
                  <Text className="text-sm font-semibold capitalize">{getStatusLabel(selectedLease.status)}</Text>
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.startDate")}
                </Text>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Text className="font-medium">{new Date(selectedLease.start_date).toLocaleDateString(dateLocale)}</Text>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.endDate")}
                </Text>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Text className="font-medium">{new Date(selectedLease.end_date).toLocaleDateString(dateLocale)}</Text>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.duration")}
                </Text>
                <Text className="font-medium">
                  {t("leases.daysCount", {
                    count: Math.ceil((new Date(selectedLease.end_date).getTime() - new Date(selectedLease.start_date).getTime()) / (1000 * 60 * 60 * 24))
                  })}
                </Text>
              </div>

              {/* Total Value */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.totalValue")}
                </Text>
                <Text className="text-xl font-bold text-purple-600">
                  ETB {((selectedLease.rent_amount ?? 0) * Math.ceil((new Date(selectedLease.end_date).getTime() - new Date(selectedLease.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))).toLocaleString()}
                </Text>
              </div>

              {/* Created Date */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">
                  {t("leases.created")}
                </Text>
                <Text className="font-medium">{new Date(selectedLease.created_at).toLocaleDateString(dateLocale)}</Text>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <Text className="text-sm text-blue-900">
                <span className="font-semibold">{t("leases.noteTitle")}</span>{" "}
                {t("leases.noteBody")}
              </Text>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setViewModalOpen(false)}
                className="flex-1 rounded-lg"
              >
                {t("leases.close")}
              </Button>
              <Button
                className="flex-1 bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("leases.downloadPdf")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function TenantLeasesPage() {
  return (
    <ProtectedRoute>
      <TenantLeasesContent />
    </ProtectedRoute>
  )
}
