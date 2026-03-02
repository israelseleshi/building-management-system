"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"

interface TenantIncident {
  id: string
  categoryKey: string
  categoryCustom?: string
  severity: "low" | "medium" | "high"
  message: string
  createdAt: string
  propertyTitle: string
}

function TenantReportsContent() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [incidents, setIncidents] = useState<TenantIncident[]>([])

  const [propertyTitle, setPropertyTitle] = useState("")
  const [category, setCategory] = useState<string>("noise")
  const [categoryOther, setCategoryOther] = useState<string>("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")
  const [message, setMessage] = useState("")

  const getCategoryLabel = (key: string, custom?: string) => {
    if (key === "other") {
      return custom?.trim() || t("reports.categories.other")
    }
    return t(`reports.categories.${key}` as any)
  }

  const getSeverityLabel = (level: "low" | "medium" | "high") => {
    return t(`reports.severity.${level}` as any)
  }

  const handleLogout = async () => {
    try {
      const token = getAuthToken()
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch (err) {
      console.error("Logout error:", err)
    }
    
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

  const handleSubmit = async () => {
    if (!message.trim()) return

    setSubmitting(true)
    try {
      const now = new Date()
      const categoryCustom = category === "other" ? categoryOther.trim() : ""

      const newIncident: TenantIncident = {
        id: `local-${now.getTime()}`,
        categoryKey: category,
        categoryCustom: categoryCustom || undefined,
        severity,
        message: message.trim(),
        createdAt: now.toISOString(),
        propertyTitle: propertyTitle || t("reports.defaultPropertyTitle"),
      }

      // For this phase we only keep this locally as mock data.
      setIncidents((prev) => [newIncident, ...prev])

      // Also mirror to localStorage so the landlord mock reports page can
      // read and display these as neighbour incident reports.
      try {
        const key = "mockTenantIncidents"
        const existingRaw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
        const existing: TenantIncident[] = existingRaw ? JSON.parse(existingRaw) : []
        const updated = [newIncident, ...existing]
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(updated))
        }
      } catch {
        // ignore localStorage errors in mock mode
      }

      setMessage("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={t("reports.header.title")}
          subtitle={t("reports.header.subtitle")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("header.searchPlaceholder")}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-8">
            <div
              className="rounded-2xl border-0 p-6 space-y-4"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <Heading level={3} className="text-lg font-bold">
                {t("reports.form.title")}
              </Heading>
              <Text className="text-sm text-muted-foreground">
                {t("reports.form.subtitle")}
              </Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Text className="text-xs font-medium text-muted-foreground">{t("reports.form.propertyLabel")}</Text>
                  <Input
                    placeholder={t("reports.form.propertyPlaceholder")}
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Text className="text-xs font-medium text-muted-foreground">{t("reports.form.categoryLabel")}</Text>
                  <Select value={category} onValueChange={(v) => setCategory(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("reports.form.categoryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-md">
                      <SelectItem value="noise">{t("reports.categories.noise")}</SelectItem>
                      <SelectItem value="parking">{t("reports.categories.parking")}</SelectItem>
                      <SelectItem value="security">{t("reports.categories.security")}</SelectItem>
                      <SelectItem value="cleanliness">{t("reports.categories.cleanliness")}</SelectItem>
                      <SelectItem value="other">{t("reports.categories.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {category === "other" && (
                    <Input
                      className="mt-2"
                      placeholder={t("reports.form.categoryOtherPlaceholder")}
                      value={categoryOther}
                      onChange={(e) => setCategoryOther(e.target.value)}
                    />
                  )}
                </div>
                <div className="space-y-2 relative z-40">
                  <Text className="text-xs font-medium text-muted-foreground">{t("reports.form.severityLabel")}</Text>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("reports.form.severityPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-md">
                      <SelectItem value="low">{t("reports.severity.low")}</SelectItem>
                      <SelectItem value="medium">{t("reports.severity.medium")}</SelectItem>
                      <SelectItem value="high">{t("reports.severity.high")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Text className="text-xs font-medium text-muted-foreground">{t("reports.form.messageLabel")}</Text>
                <Textarea
                  rows={5}
                  placeholder={t("reports.form.messagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  className="rounded-lg text-xs"
                  disabled={submitting || !message.trim()}
                  onClick={handleSubmit}
                >
                  {t("reports.form.submit")}
                </Button>
              </div>
            </div>

            <div
              className="rounded-2xl border-0 overflow-hidden"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <Heading level={3} className="text-lg font-bold">
                    {t("reports.list.title")}
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    {t("reports.list.subtitle")}
                  </Text>
                </div>
              </div>

              {incidents.length === 0 ? (
                <div className="p-8 text-center">
                  <Text className="text-muted-foreground text-sm">
                    {t("reports.list.empty")}
                  </Text>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="px-6 py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="text-xs text-muted-foreground mb-1">
                            {inc.propertyTitle} • {getCategoryLabel(inc.categoryKey, inc.categoryCustom)}
                          </Text>
                          <Heading level={4} className="text-sm font-semibold">
                            {t("reports.severityLine", { severity: getSeverityLabel(inc.severity) })} •{" "}
                            {new Date(inc.createdAt).toLocaleDateString()}
                          </Heading>
                        </div>
                      </div>
                      <Text className="text-sm">
                        {inc.message}
                      </Text>
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

export default function TenantReportsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantReportsContent />
    </ProtectedRoute>
  )
}
