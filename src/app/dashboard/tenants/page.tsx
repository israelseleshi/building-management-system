"use client"

import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import {
  Activity,
  AlignLeft,
  Bell,
  Filter,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Send,
  UserCheck,
  UserRound,
} from "lucide-react"

type PortalState = "not_sent" | "invited" | "resent" | "active"

interface TenantRecord {
  id: string
  name: string
  unit: string
  phone: string
  email: string
  portalState: PortalState
}

type AnyRecord = Record<string, unknown>

const theme = {
  primary: "#2563EB",
  success: "#16A34A",
  background: "#EEF2F7",
  card: "#FFFFFF",
  ink: "#1F2937",
  muted: "#6B7280",
  line: "#D9E1E8",
  tableHead: "#F7FAFC",
} as const

function pickStringField(obj: AnyRecord | null | undefined, keys: string[]): string {
  for (const key of keys) {
    const value = obj?.[key]
    if (value === undefined || value === null) continue
    const text = String(value).trim()
    if (text) return text
  }
  return ""
}

function mapPortalState(raw: AnyRecord): PortalState {
  const isActive = Boolean(raw.portal_active ?? raw.portalActive ?? raw.is_portal_active)
  if (isActive) return "active"

  const sentAt = pickStringField(raw, ["portal_invited_at", "portalInvitedAt", "invited_at"])
  if (sentAt) return "invited"

  return "not_sent"
}

const fallbackTenants: TenantRecord[] = [
  { id: "t_001", name: "Mehret Getachew", unit: "A-203", phone: "+251 911 223 344", email: "mehret@example.com", portalState: "not_sent" },
  { id: "t_002", name: "Samuel Tadesse", unit: "B-104", phone: "+251 933 889 901", email: "samuel@example.com", portalState: "invited" },
]

export default function TenantsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <TenantsContent />
    </ProtectedRoute>
  )
}

function TenantsContent() {
  const SIDEBAR_COLLAPSED_KEY = "bms.dashboard.sidebarCollapsed"
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  })
  const [tenants, setTenants] = useState<TenantRecord[]>([])
  const [viewTenant, setViewTenant] = useState<TenantRecord | null>(null)
  const [editTenant, setEditTenant] = useState<TenantRecord | null>(null)
  const [smsTenant, setSmsTenant] = useState<TenantRecord | null>(null)
  const [smsMessage, setSmsMessage] = useState("Hello, this is a quick update from your property manager.")

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          setTenants(fallbackTenants)
          return
        }

        const response = await fetch(`${API_BASE_URL}/tenants/search?q=`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = await response.json()
        const raw = (payload?.data?.tenants || []) as AnyRecord[]

        const normalized = raw.map((item, index) => {
          const id = pickStringField(item, ["id", "tenant_id", "tenantId", "user_id", "userId"]) || `tenant_${index}`
          const name =
            pickStringField(item, ["full_name", "fullName", "name"]) ||
            `${pickStringField(item, ["first_name", "firstName"])} ${pickStringField(item, ["last_name", "lastName"])}`.trim() ||
            "Unknown Tenant"
          const unit =
            pickStringField(item, ["unit_name", "unitName", "unit", "apartment_no", "apartmentNo", "property_title", "propertyTitle"]) ||
            "Unassigned"
          const phone = pickStringField(item, ["phone", "phone_number", "phoneNumber", "mobile", "contact_number", "contactNumber"]) || "Not provided"
          const email = pickStringField(item, ["email"]) || "No email"
          return {
            id,
            name,
            unit,
            phone,
            email,
            portalState: mapPortalState(item),
          } satisfies TenantRecord
        })

        setTenants(normalized.length ? normalized : fallbackTenants)
      } catch {
        setTenants(fallbackTenants)
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [])

  const filteredTenants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return tenants
    return tenants.filter((tenant) =>
      [tenant.name, tenant.unit, tenant.phone, tenant.email].some((value) => value.toLowerCase().includes(q))
    )
  }, [searchQuery, tenants])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const nextPortalState = (state: PortalState): PortalState => {
    if (state === "not_sent") return "invited"
    if (state === "invited") return "resent"
    if (state === "resent") return "active"
    return "active"
  }

  const handlePortalAction = (tenantId: string) => {
    setTenants((current) =>
      current.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              portalState: nextPortalState(tenant.portalState),
            }
          : tenant
      )
    )
  }

  const getActionLabel = (state: PortalState) => {
    if (state === "not_sent") return "Send Portal Invitation"
    if (state === "invited" || state === "resent") return "Resend Invitation"
    return "Active"
  }

  const getPortalLegend = (state: PortalState) => {
    if (state === "not_sent") return "Contact Added"
    if (state === "invited") return "Invitation Sent"
    if (state === "resent") return "Activated"
    return "Active Usage"
  }

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev)

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={
        {
          backgroundColor: theme.background,
          ["--card" as string]: theme.card,
          ["--background" as string]: theme.background,
          ["--border" as string]: theme.line,
        } as CSSProperties
      }
    >
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
        appBrandName="BMS"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
          <div className="flex min-h-[52px] items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Toggle dashboard navigation"
              >
                <AlignLeft className="h-[1.05rem] w-[1.05rem]" />
              </button>
              <div className="truncate text-[0.8rem] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.ink }}>
                Tenants
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-[1.05rem] w-[1.05rem]" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-5 md:px-6">
          <section className="mx-auto w-full max-w-[1420px] rounded-xl border shadow-[0_6px_18px_rgba(94,118,145,0.05)]" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
            <div className="border-b px-5 py-4 md:px-6" style={{ borderColor: theme.line }}>
              <h1 className="text-lg font-semibold" style={{ color: theme.ink }}>
                Tenants
              </h1>
              <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                Manage tenant contact details and portal onboarding.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-10 w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm shadow-[0_2px_10px_rgba(15,23,42,0.06)] outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    style={{ color: theme.ink }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:text-slate-700"
                  aria-label="Open filters"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-hidden">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[14%]" />
                  <col className="w-[22%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                  <col className="w-[3%]" />
                </colgroup>
                <thead style={{ backgroundColor: theme.tableHead }}>
                  <tr className="border-b" style={{ borderColor: theme.line }}>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Tenant</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Unit</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Contact Info</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Tenant Portal Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Action</th>
                    <th className="w-12 px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }} />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: theme.muted }}>
                        Loading tenants...
                      </td>
                    </tr>
                  ) : filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: theme.muted }}>
                        No tenants found
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b" style={{ borderColor: theme.line }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                              <UserRound className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold" style={{ color: theme.ink }}>{tenant.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm" style={{ color: theme.ink }}>{tenant.unit}</td>
                        <td className="px-5 py-4">
                          <div className="truncate text-sm font-medium" style={{ color: theme.ink }}>{tenant.phone}</div>
                          <div className="truncate text-xs" style={{ color: theme.muted }}>{tenant.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <PortalStatus state={tenant.portalState} hasContactAdded={Boolean(tenant.email && tenant.email !== "No email")} />
                          <div className="mt-1 text-[11px] font-medium" style={{ color: theme.muted }}>
                            {getPortalLegend(tenant.portalState)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {tenant.portalState === "active" ? (
                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Active
                            </span>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePortalAction(tenant.id)}
                              className="h-9 rounded-md px-3 text-xs font-semibold"
                            >
                              {getActionLabel(tenant.portalState)}
                            </Button>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                aria-label={`Open actions for ${tenant.name}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditTenant(tenant)}>Edit Tenant</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setViewTenant(tenant)}>View Tenant</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSmsTenant(tenant)}>Send SMS</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Dialog open={Boolean(editTenant)} onOpenChange={(open) => !open && setEditTenant(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
          </DialogHeader>
          {editTenant && (
            <div className="space-y-4 py-1">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Name</label>
                <input
                  value={editTenant.name}
                  onChange={(event) => setEditTenant({ ...editTenant, name: event.target.value })}
                  className="h-10 w-full rounded-md border px-3 text-sm outline-none"
                  style={{ borderColor: theme.line }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Unit</label>
                <input
                  value={editTenant.unit}
                  onChange={(event) => setEditTenant({ ...editTenant, unit: event.target.value })}
                  className="h-10 w-full rounded-md border px-3 text-sm outline-none"
                  style={{ borderColor: theme.line }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Phone Number</label>
                <input
                  value={editTenant.phone}
                  onChange={(event) => setEditTenant({ ...editTenant, phone: event.target.value })}
                  className="h-10 w-full rounded-md border px-3 text-sm outline-none"
                  style={{ borderColor: theme.line }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.04em]" style={{ color: theme.muted }}>Email</label>
                <input
                  value={editTenant.email}
                  onChange={(event) => setEditTenant({ ...editTenant, email: event.target.value })}
                  className="h-10 w-full rounded-md border px-3 text-sm outline-none"
                  style={{ borderColor: theme.line }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTenant(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!editTenant) return
                setTenants((current) => current.map((tenant) => (tenant.id === editTenant.id ? editTenant : tenant)))
                setEditTenant(null)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewTenant)} onOpenChange={(open) => !open && setViewTenant(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
          </DialogHeader>
          {viewTenant && (
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold">Name:</span> {viewTenant.name}</div>
              <div><span className="font-semibold">Unit:</span> {viewTenant.unit}</div>
              <div><span className="font-semibold">Phone:</span> {viewTenant.phone}</div>
              <div><span className="font-semibold">Email:</span> {viewTenant.email}</div>
              <div><span className="font-semibold">Portal:</span> {getActionLabel(viewTenant.portalState)}</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewTenant(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(smsTenant)} onOpenChange={(open) => !open && setSmsTenant(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
          </DialogHeader>
          {smsTenant && (
            <div className="space-y-4">
              <div className="text-sm" style={{ color: theme.muted }}>
                To: <span className="font-medium" style={{ color: theme.ink }}>{smsTenant.phone}</span>
              </div>
              <textarea
                value={smsMessage}
                onChange={(event) => setSmsMessage(event.target.value)}
                className="min-h-[120px] w-full rounded-md border p-3 text-sm outline-none"
                style={{ borderColor: theme.line }}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsTenant(null)}>Cancel</Button>
            <Button onClick={() => setSmsTenant(null)}>
              <Phone className="mr-2 h-4 w-4" />
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PortalStatus({ state, hasContactAdded }: { state: PortalState; hasContactAdded: boolean }) {
  const steps: Array<{ icon: ReactNode; key: "contact_added" | "invitation_sent" | "activated" | "active_usage" }> = [
    { icon: <Mail className="h-3.5 w-3.5" />, key: "contact_added" },
    { icon: <Send className="h-3.5 w-3.5" />, key: "invitation_sent" },
    { icon: <UserCheck className="h-3.5 w-3.5" />, key: "activated" },
    { icon: <Activity className="h-3.5 w-3.5" />, key: "active_usage" },
  ]

  const level = state === "not_sent" ? 0 : state === "invited" ? 1 : state === "resent" ? 2 : 3

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const completed = index <= level && (index !== 0 || hasContactAdded)
        return (
          <div key={step.key} className="flex items-center">
            <div
              title={
                step.key === "contact_added"
                  ? "Contact Added"
                  : step.key === "invitation_sent"
                    ? "Invitation Sent"
                    : step.key === "activated"
                      ? "Activated"
                      : "Active Usage"
              }
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-slate-100 text-slate-400"}`}
            >
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-[2px] w-5 ${index < level ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
