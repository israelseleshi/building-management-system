"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Heading, Text, Large } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Combobox } from "@/components/ui/combobox"
import { DataTable } from "@/components/ui/data-table"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import type { ColumnDef } from "@tanstack/react-table"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Home,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Search,
  Users,
} from "lucide-react"

interface UnitListing {
  id: string
  buildingId: string
  unitId: string
  unitNumber: string
  floorNumber: number | null
  bedrooms: number | null
  bathrooms: number | null
  sizeSqm: number | null
  rentAmount: number
  status: "vacant" | "occupied" | "maintenance"
}

export default function LandlordListings() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ListingsContent />
    </ProtectedRoute>
  )
}

function ListingsContent() {
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [unitsSearch, setUnitsSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [units, setUnits] = useState<UnitListing[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<UnitListing | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<UnitListing>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) {
          setApiError("Not authenticated")
          setUnits([])
          return
        }

        const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs = 15000) => {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), timeoutMs)
          try {
            return await fetch(url, { ...init, signal: controller.signal })
          } finally {
            clearTimeout(timeout)
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
        const buildingsPayload = await buildingsRes.json().catch(() => ({}))
        if (!buildingsRes.ok || buildingsPayload?.success === false) {
          throw new Error(buildingsPayload?.error || buildingsPayload?.message || "Failed to load buildings")
        }

        const buildingsData = buildingsPayload?.data?.buildings || []
        const buildingIds: string[] = buildingsData
          .map((b: any) => (b?.building_id ?? b?.id)?.toString())
          .filter((id: any) => typeof id === "string" && id.length > 0)

        if (buildingIds.length === 0) {
          setUnits([])
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
            const unitsPayload = await unitsRes.json().catch(() => ({}))
            if (!unitsRes.ok || unitsPayload?.success === false) return []
            return (unitsPayload?.data?.units || []).map((unit: any) => ({ unit, buildingId }))
          })
        )

        const rows: UnitListing[] = []
        for (const result of unitResults) {
          if (result.status !== "fulfilled") continue
          for (const item of result.value) {
            const { unit, buildingId } = item
            const rawStatus = unit.status || "vacant"
            const normalizedStatus: "vacant" | "occupied" | "maintenance" =
              rawStatus === "occupied" || rawStatus === "maintenance" ? rawStatus : "vacant"

            const resolvedUnitId = (unit.unit_id ?? unit.id)?.toString?.() || ""
            const resolvedFloor = unit.floor_number ?? unit.floor ?? null
            const resolvedSqft = unit.size_sqm ?? unit.sqft ?? null
            const resolvedRent = unit.rent_amount ?? unit.base_rent ?? 0

            rows.push({
              id: resolvedUnitId || `${buildingId}-${unit.unit_number}`,
              buildingId: buildingId,
              unitId: resolvedUnitId,
              unitNumber: unit.unit_number?.toString() || "Unit",
              floorNumber: resolvedFloor != null ? Number(resolvedFloor) : null,
              bedrooms: unit.bedrooms ?? null,
              bathrooms: unit.bathrooms ?? null,
              sizeSqm: resolvedSqft != null ? Number(resolvedSqft) : null,
              rentAmount: Number(resolvedRent || 0),
              status: normalizedStatus,
            })
          }
        }

        setUnits(rows)
      } catch (err) {
        console.error("Error fetching units:", err)
        setApiError("Failed to load units from API")
        toast({
          title: "Error",
          description: "Failed to load units from API",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [])

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard", active: false },
    { icon: <Building2 className="w-5 h-5" />, name: "My Listings", path: "/dashboard/listings", active: true },
    { icon: <PlusCircle className="w-5 h-5" />, name: "Create Listing", path: "/dashboard/create", active: false },
    { icon: <Users className="w-5 h-5" />, name: "Employees", path: "/dashboard/employees", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat", active: false },
    { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts", active: false },
    { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics", active: false },
    { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings", active: false },
  ]

  const totalUnits = units.length
  const occupiedUnits = units.filter((u) => u.status === "occupied").length
  const vacantUnits = units.filter((u) => u.status === "vacant").length
  const totalRent = units.reduce((sum, u) => sum + (u.rentAmount || 0), 0)

  const stats = [
    { title: "Total Units", value: totalUnits.toString(), icon: <Home className="w-6 h-6" style={{ color: "#7D8B6F" }} />, color: "#7D8B6F" },
    { title: "Occupied", value: occupiedUnits.toString(), icon: <Building2 className="w-6 h-6" style={{ color: "#7D8B6F" }} />, color: "#7D8B6F" },
    { title: "Vacant", value: vacantUnits.toString(), icon: <TrendingUp className="w-6 h-6" style={{ color: "#7D8B6F" }} />, color: "#7D8B6F" },
    { title: "Total Rent", value: `ETB ${totalRent.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" style={{ color: "#7D8B6F" }} />, color: "#7D8B6F" },
  ]

  const statusBadge = (status: UnitListing["status"]) => {
    if (status === "occupied") {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize">occupied</Badge>
    }
    if (status === "maintenance") {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 capitalize">maintenance</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">vacant</Badge>
  }

  const columns: ColumnDef<UnitListing>[] = [
    {
      accessorKey: "unitNumber",
      header: "Unit Number",
      cell: ({ row }) => <div className="font-medium text-foreground">{row.original.unitNumber}</div>,
    },
    {
      accessorKey: "floorNumber",
      header: "Floor",
      cell: ({ row }) => <div>{row.original.floorNumber ?? "-"}</div>,
    },
    {
      accessorKey: "bedrooms",
      header: "Bedrooms",
      cell: ({ row }) => <div>{row.original.bedrooms ?? "-"}</div>,
    },
    {
      accessorKey: "bathrooms",
      header: "Bathrooms",
      cell: ({ row }) => <div>{row.original.bathrooms ?? "-"}</div>,
    },
    {
      accessorKey: "sizeSqm",
      header: "Size (sqm)",
      cell: ({ row }) => <div>{row.original.sizeSqm ?? "-"}</div>,
    },
    {
      accessorKey: "rentAmount",
      header: "Rent Amount",
      cell: ({ row }) => <div className="font-medium">ETB {row.original.rentAmount.toLocaleString()}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const unit = row.original
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              style={{ backgroundColor: "#3b82f620" }}
              onClick={() => {
                setSelectedUnit(unit)
                setViewModalOpen(true)
              }}
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              style={{ backgroundColor: "#10b98120" }}
              onClick={() => {
                setSelectedUnit(unit)
                setEditModalOpen(true)
              }}
            >
              <Edit className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              style={{ backgroundColor: "#a85c5c20" }}
              onClick={() => {
                setUnitToDelete(unit.id)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]

  const filteredUnits = units.filter((unit) => {
    const pageSearch = unitsSearch.toLowerCase()
    const matchesSearch = !pageSearch || unit.unitNumber.toLowerCase().includes(pageSearch) || unit.id.toLowerCase().includes(pageSearch)
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleLogout = () => {
    const token = getAuthToken()
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUnit || !selectedUnit.unitId) return
    try {
      setIsSaving(true)
      const token = getAuthToken()
      if (!token) return

      await fetch(`${API_BASE_URL}/units/${selectedUnit.unitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unit_number: editFormData.unitNumber ?? selectedUnit.unitNumber,
          floor_number: editFormData.floorNumber ?? selectedUnit.floorNumber ?? undefined,
          bedrooms: editFormData.bedrooms ?? selectedUnit.bedrooms ?? undefined,
          bathrooms: editFormData.bathrooms ?? selectedUnit.bathrooms ?? undefined,
          size_sqm: editFormData.sizeSqm ?? selectedUnit.sizeSqm ?? undefined,
          rent_amount: editFormData.rentAmount ?? selectedUnit.rentAmount,
          status: editFormData.status ?? selectedUnit.status,
        }),
      }).catch(() => undefined)

      setUnits((prev) =>
        prev.map((u) =>
          u.id === selectedUnit.id
            ? {
                ...u,
                unitNumber: (editFormData.unitNumber ?? u.unitNumber) as string,
                floorNumber: (editFormData.floorNumber ?? u.floorNumber) as number | null,
                bedrooms: (editFormData.bedrooms ?? u.bedrooms) as number | null,
                bathrooms: (editFormData.bathrooms ?? u.bathrooms) as number | null,
                sizeSqm: (editFormData.sizeSqm ?? u.sizeSqm) as number | null,
                rentAmount: (editFormData.rentAmount ?? u.rentAmount) as number,
                status: (editFormData.status ?? u.status) as "vacant" | "occupied" | "maintenance",
              }
            : u
        )
      )

      toast({ title: "Success", description: "Unit updated successfully" })
      setEditModalOpen(false)
      setEditFormData({})
    } catch (err) {
      console.error("Error saving unit:", err)
      toast({
        title: "Error",
        description: "Failed to update unit",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDelete = () => {
    if (!unitToDelete) return
    const deletedUnit = units.find((u) => u.id === unitToDelete)
    const token = getAuthToken()
    if (token && deletedUnit?.unitId) {
      fetch(`${API_BASE_URL}/units/${deletedUnit.unitId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }
    setUnits((prev) => prev.filter((u) => u.id !== unitToDelete))
    setDeleteDialogOpen(false)
    setUnitToDelete(null)
    toast({
      title: "Unit Deleted",
      description: `${deletedUnit?.unitNumber || "Unit"} has been deleted.`,
      variant: "destructive",
    })
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setUnitToDelete(null)
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

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="My Listings"
          subtitle="Manage your units"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {apiError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">{apiError}</div>}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" className="text-muted-foreground mb-1">{stat.title}</Text>
                    <Large className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</Large>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search units by number or ID..."
                  value={unitsSearch}
                  onChange={(e) => setUnitsSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-black"
                />
              </div>
            </div>

            <Combobox
              options={[
                { value: "all", label: "All Status" },
                { value: "vacant", label: "Vacant" },
                { value: "occupied", label: "Occupied" },
                { value: "maintenance", label: "Maintenance" },
              ]}
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="All Status"
              className="w-40"
            />
          </div>

          {loading ? (
            <div
              className="rounded-2xl p-12 text-center border-0"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-[#7D8B6F] rounded-full animate-spin" />
              </div>
              <Heading level={3} className="text-xl font-semibold text-foreground mb-2">Loading units...</Heading>
              <Text className="text-muted-foreground">Fetching your units from the database</Text>
            </div>
          ) : filteredUnits.length > 0 ? (
            <DataTable columns={columns} data={filteredUnits} pageSize={8} />
          ) : (
            <div
              className="rounded-2xl p-12 text-center border-0"
              style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}
            >
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-foreground mb-2">No units found</Heading>
              <Text className="text-muted-foreground mb-4">Create your first unit listing.</Text>
              <Button
                onClick={() => router.push("/dashboard/create")}
                className="transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
              >
                Create First Listing
              </Button>
            </div>
          )}
        </main>
      </div>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle>Unit Details</DialogTitle>
            <DialogDescription>Only the required unit fields are displayed.</DialogDescription>
          </DialogHeader>
          {selectedUnit && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-muted-foreground">Unit Number</p><p className="font-semibold">{selectedUnit.unitNumber}</p></div>
              <div><p className="text-xs text-muted-foreground">Floor Number</p><p className="font-semibold">{selectedUnit.floorNumber ?? "-"}</p></div>
              <div><p className="text-xs text-muted-foreground">Bedrooms</p><p className="font-semibold">{selectedUnit.bedrooms ?? "-"}</p></div>
              <div><p className="text-xs text-muted-foreground">Bathrooms</p><p className="font-semibold">{selectedUnit.bathrooms ?? "-"}</p></div>
              <div><p className="text-xs text-muted-foreground">Size (sqm)</p><p className="font-semibold">{selectedUnit.sizeSqm ?? "-"}</p></div>
              <div><p className="text-xs text-muted-foreground">Rent Amount</p><p className="font-semibold">ETB {selectedUnit.rentAmount.toLocaleString()}</p></div>
              <div className="col-span-2"><p className="text-xs text-muted-foreground">Status</p><div className="mt-1">{statusBadge(selectedUnit.status)}</div></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                setViewModalOpen(false)
                setEditModalOpen(true)
              }}
              style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
            >
              Edit Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>Update only the API fields for units.</DialogDescription>
          </DialogHeader>
          {selectedUnit && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Unit Number</label>
                <input
                  type="text"
                  value={editFormData.unitNumber ?? selectedUnit.unitNumber}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, unitNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Floor Number</label>
                <input
                  type="number"
                  value={editFormData.floorNumber ?? selectedUnit.floorNumber ?? ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, floorNumber: e.target.value === "" ? null : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={editFormData.bedrooms ?? selectedUnit.bedrooms ?? ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, bedrooms: e.target.value === "" ? null : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={editFormData.bathrooms ?? selectedUnit.bathrooms ?? ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, bathrooms: e.target.value === "" ? null : parseInt(e.target.value, 10) }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Size (sqm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editFormData.sizeSqm ?? selectedUnit.sizeSqm ?? ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, sizeSqm: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Rent Amount</label>
                <input
                  type="number"
                  value={editFormData.rentAmount ?? selectedUnit.rentAmount}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, rentAmount: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
                <Combobox
                  options={[
                    { value: "vacant", label: "Vacant" },
                    { value: "occupied", label: "Occupied" },
                    { value: "maintenance", label: "Maintenance" },
                  ]}
                  value={editFormData.status || selectedUnit.status}
                  onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value as UnitListing["status"] }))}
                  placeholder="Select status"
                  className="w-full"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditModalOpen(false); setEditFormData({}) }} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isSaving} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Unit</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete this unit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={cancelDelete} className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium">
              Delete Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
