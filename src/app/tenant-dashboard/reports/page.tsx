"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  category: string
  severity: "low" | "medium" | "high"
  message: string
  createdAt: string
  propertyTitle: string
}

function TenantReportsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [incidents, setIncidents] = useState<TenantIncident[]>([])

  const [propertyTitle, setPropertyTitle] = useState("")
  const [category, setCategory] = useState<string>("noise")
  const [categoryOther, setCategoryOther] = useState<string>("")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium")
  const [message, setMessage] = useState("")

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
      const effectiveCategory = category === "other" && categoryOther.trim() ? categoryOther.trim() :
        category === "noise"
          ? "Noise Complaint"
          : category === "parking"
          ? "Parking"
          : category === "security"
          ? "Security"
          : category === "cleanliness"
          ? "Cleanliness"
          : "Other"

      const newIncident: TenantIncident = {
        id: `local-${now.getTime()}`,
        category: effectiveCategory,
        severity,
        message: message.trim(),
        createdAt: now.toISOString(),
        propertyTitle: propertyTitle || "My Unit",
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
          title="Report an Issue"
          subtitle="Send detailed reports to your building owner (mock flow for now)"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-8">
            <div
              className="rounded-2xl border-0 p-6 space-y-4"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <Heading level={3} className="text-lg font-bold">
                New Incident Report
              </Heading>
              <Text className="text-sm text-muted-foreground">
                Describe any issue related to noise, security, cleanliness, or other building rules. In the next
                phase this will be sent to your landlord and shown in their Reports dashboard.
              </Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Text className="text-xs font-medium text-muted-foreground">Property / Unit</Text>
                  <Input
                    placeholder="e.g. CMC Apartments 302"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Text className="text-xs font-medium text-muted-foreground">Category</Text>
                  <Select value={category} onValueChange={(v) => setCategory(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-md">
                      <SelectItem value="noise">Noise Complaint</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {category === "other" && (
                    <Input
                      className="mt-2"
                      placeholder="Describe category (e.g. Pets, Smell, Other)"
                      value={categoryOther}
                      onChange={(e) => setCategoryOther(e.target.value)}
                    />
                  )}
                </div>
                <div className="space-y-2 relative z-40">
                  <Text className="text-xs font-medium text-muted-foreground">Severity</Text>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-md">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Text className="text-xs font-medium text-muted-foreground">Detailed message</Text>
                <Textarea
                  rows={5}
                  placeholder="Describe the issue in detail so your landlord can understand what happened..."
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
                  Submit Report (mock)
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
                    Your submitted reports (mock)
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    These are stored only on this page for now. Later they will be visible to your landlord.
                  </Text>
                </div>
              </div>

              {incidents.length === 0 ? (
                <div className="p-8 text-center">
                  <Text className="text-muted-foreground text-sm">
                    You have not submitted any reports yet. Use the form above to send your first incident report.
                  </Text>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="px-6 py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="text-xs text-muted-foreground mb-1">
                            {inc.propertyTitle} • {inc.category}
                          </Text>
                          <Heading level={4} className="text-sm font-semibold">
                            {inc.severity.charAt(0).toUpperCase() + inc.severity.slice(1)} severity • {" "}
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
