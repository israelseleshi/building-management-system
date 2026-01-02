"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Text, Heading } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { supabase } from "@/lib/supabaseClient"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Home,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Search,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Lease {
  id: string
  tenant_id: string
  property_id: string
  landlord_id: string
  monthly_rent: number
  status: "pending" | "active" | "inactive" | "expired"
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  tenant_name?: string
  property_title?: string
}

interface Tenant {
  id: string
  full_name: string
  email: string
}

interface Property {
  id: string
  title: string
  monthly_rent: number
  address_line1: string
}

function LeasesContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [leases, setLeases] = useState<Lease[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    tenant_id: "",
    property_id: "",
    monthly_rent: 0,
    status: "pending" as "pending" | "active" | "inactive" | "expired",
    start_date: "",
    end_date: "",
    notes: "",
  })

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false,
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create-listing",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Reports",
      path: "/dashboard/reports",
      active: false,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Rents",
      path: "/dashboard/leases",
      active: true,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false,
    },
  ]

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setCurrentUserId(user.id)

        // Fetch leases
        const { data: leasesData } = await supabase
          .from("leases")
          .select("*")
          .eq("landlord_id", user.id)
          .order("created_at", { ascending: false })

        // Fetch tenants
        const { data: tenantsData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("role", "tenant")

        // Fetch properties
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("id, title, monthly_rent, address_line1")
          // .eq("landlord_id", user.id) // Removing explicit filter to match listings page logic

        setLeases(leasesData || [])
        setTenants(tenantsData || [])
        setProperties(propertiesData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateLease = async () => {
    if (!currentUserId || !formData.tenant_id || !formData.property_id) return

    try {
      const { error } = await supabase.from("leases").insert({
        tenant_id: formData.tenant_id,
        property_id: formData.property_id,
        landlord_id: currentUserId,
        monthly_rent: formData.monthly_rent,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.status === "active",
      })

      if (error) throw error

      // Refresh leases
      const { data: updatedLeases } = await supabase
        .from("leases")
        .select("*")
        .eq("landlord_id", currentUserId)
        .order("created_at", { ascending: false })

      setLeases(updatedLeases || [])
      setCreateModalOpen(false)
      setFormData({
        tenant_id: "",
        property_id: "",
        monthly_rent: 0,
        status: "pending",
        start_date: "",
        end_date: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error creating lease:", error)
    }
  }

  const handleDeleteLease = async () => {
    if (!selectedLease) return

    try {
      const { error } = await supabase
        .from("leases")
        .delete()
        .eq("id", selectedLease.id)

      if (error) throw error

      setLeases(leases.filter(l => l.id !== selectedLease.id))
      setDeleteConfirmOpen(false)
      setSelectedLease(null)
    } catch (error) {
      console.error("Error deleting lease:", error)
    }
  }

  const handleUpdateStatus = async (leaseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leases")
        .update({ status: newStatus, is_active: newStatus === "active" })
        .eq("id", leaseId)

      if (error) throw error

      setLeases(leases.map(l => 
        l.id === leaseId ? { ...l, status: newStatus as "pending" | "active" | "inactive" | "expired", is_active: newStatus === "active" } : l
      ))
    } catch (error) {
      console.error("Error updating lease:", error)
    }
  }

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

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = 
      (tenants.find(t => t.id === lease.tenant_id)?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (properties.find(p => p.id === lease.property_id)?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || lease.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Total Leases",
      value: leases.length,
      icon: <FileText className="w-8 h-8" />,
      color: "text-blue-600",
    },
    {
      title: "Active Leases",
      value: leases.filter(l => l.status === "active").length,
      icon: <CheckCircle className="w-8 h-8" />,
      color: "text-emerald-600",
    },
    {
      title: "Pending",
      value: leases.filter(l => l.status === "pending").length,
      icon: <Clock className="w-8 h-8" />,
      color: "text-yellow-600",
    },
    {
      title: "Monthly Revenue",
      value: `ETB ${(leases.filter(l => l.status === "active").reduce((sum, l) => sum + l.monthly_rent, 0) / 1000).toFixed(1)}K`,
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
    await supabase.auth.signOut()
    router.push("/")
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
          title="Rent Management"
          subtitle="Manage and track all tenant rents"
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
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

            {/* Header with Search and Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <Heading level={2} className="mb-1">
                  Your Rents
                </Heading>
                <Text className="text-muted-foreground">
                  Manage and track all tenant rents
                </Text>
              </div>
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Lease
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tenant name or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-48 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Leases Table */}
            <div className="rounded-2xl border-0 overflow-hidden" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
              {filteredLeases.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <Heading level={3} className="mb-2">
                    No leases found
                  </Heading>
                  <Text className="text-muted-foreground mb-6">
                    {searchQuery || filterStatus !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first lease to get started"}
                  </Text>
                  {!searchQuery && filterStatus === "all" && (
                    <Button
                      onClick={() => setCreateModalOpen(true)}
                      className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Lease
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Tenant</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Property</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Monthly Rent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Period</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeases.map((lease) => {
                        const tenant = tenants.find(t => t.id === lease.tenant_id)
                        const property = properties.find(p => p.id === lease.property_id)

                        return (
                          <tr key={lease.id} className="border-b border-border hover:bg-white/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                  {tenant?.full_name?.charAt(0) || "T"}
                                </div>
                                <div>
                                  <Text className="font-medium">{tenant?.full_name || "Unknown"}</Text>
                                  <Text className="text-xs text-muted-foreground">{tenant?.email || ""}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <Text className="font-medium">{property?.title || "Unknown"}</Text>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Text className="font-semibold text-emerald-600">
                                ETB {lease.monthly_rent.toLocaleString()}
                              </Text>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <Text className="text-xs">
                                  {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                                </Text>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(lease.status)}`}>
                                {getStatusIcon(lease.status)}
                                <Text className="text-xs font-semibold capitalize">{lease.status}</Text>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLease(lease)
                                      setViewModalOpen(true)
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLease(lease)
                                      setEditModalOpen(true)
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLease(lease)
                                      setDeleteConfirmOpen(true)
                                    }}
                                    className="cursor-pointer text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Create Lease Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Lease</DialogTitle>
            <DialogDescription>
              Set up a new lease agreement between a tenant and property
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            {/* Tenant Selection */}
            <div className="space-y-3">
              <Label htmlFor="tenant" className="text-sm font-semibold">
                Select Tenant
              </Label>
              <select
                id="tenant"
                value={formData.tenant_id}
                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Choose a tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Selection */}
            <div className="space-y-3">
              <Label htmlFor="property" className="text-sm font-semibold">
                Select Property
              </Label>
              <select
                id="property"
                value={formData.property_id}
                onChange={(e) => {
                  const property = properties.find(p => p.id === e.target.value)
                  setFormData({
                    ...formData,
                    property_id: e.target.value,
                    monthly_rent: property?.monthly_rent || 0
                  })
                }}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Choose a property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Rent */}
            <div className="space-y-3">
              <Label htmlFor="rent" className="text-sm font-semibold">
                Monthly Rent
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="rent"
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-semibold">
                Initial Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "active" | "inactive" | "expired" })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-3">
              <Label htmlFor="startDate" className="text-sm font-semibold">
                Start Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <Label htmlFor="endDate" className="text-sm font-semibold">
                End Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Additional Notes (Optional)
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special terms or conditions..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-24 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLease}
              className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Lease
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lease Details Modal */}
      {selectedLease && (
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-2xl" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
            <DialogHeader>
              <DialogTitle className="text-2xl">Lease Details</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
              {/* Tenant Info */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Tenant</Text>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {tenants.find(t => t.id === selectedLease.tenant_id)?.full_name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <Text className="font-semibold">{tenants.find(t => t.id === selectedLease.tenant_id)?.full_name}</Text>
                    <Text className="text-sm text-muted-foreground">{tenants.find(t => t.id === selectedLease.tenant_id)?.email}</Text>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Property</Text>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <Text className="font-semibold">{properties.find(p => p.id === selectedLease.property_id)?.title}</Text>
                    <Text className="text-sm text-muted-foreground">{properties.find(p => p.id === selectedLease.property_id)?.address_line1}</Text>
                  </div>
                </div>
              </div>

              {/* Monthly Rent */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Monthly Rent</Text>
                <Text className="text-2xl font-bold text-emerald-600">ETB {selectedLease.monthly_rent.toLocaleString()}</Text>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Status</Text>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedLease.status)}`}>
                  {getStatusIcon(selectedLease.status)}
                  <Text className="text-sm font-semibold capitalize">{selectedLease.status}</Text>
                </div>
              </div>

              {/* Lease Period */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Start Date</Text>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Text className="font-medium">{new Date(selectedLease.start_date).toLocaleDateString()}</Text>
                </div>
              </div>

              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">End Date</Text>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Text className="font-medium">{new Date(selectedLease.end_date).toLocaleDateString()}</Text>
                </div>
              </div>

              {/* Lease Duration */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Duration</Text>
                <Text className="font-medium">
                  {Math.ceil((new Date(selectedLease.end_date).getTime() - new Date(selectedLease.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                </Text>
              </div>

              {/* Total Value */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Total Value</Text>
                <Text className="text-xl font-bold text-purple-600">
                  ETB {(selectedLease.monthly_rent * Math.ceil((new Date(selectedLease.end_date).getTime() - new Date(selectedLease.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))).toLocaleString()}
                </Text>
              </div>

              {/* Created Date */}
              <div className="space-y-2">
                <Text className="text-xs font-semibold text-muted-foreground uppercase">Created</Text>
                <Text className="font-medium">{new Date(selectedLease.created_at).toLocaleDateString()}</Text>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Status Modal */}
      {selectedLease && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
            <DialogHeader>
              <DialogTitle>Update Lease Status</DialogTitle>
              <DialogDescription>
                Change the status of this lease
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">New Status</Label>
                <select
                  defaultValue={selectedLease.status}
                  onChange={(e) => {
                    handleUpdateStatus(selectedLease.id, e.target.value)
                    setEditModalOpen(false)
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {selectedLease && (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Lease</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this lease? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <Text className="font-semibold text-red-900">Warning</Text>
                  <Text className="text-sm text-red-800">
                    Deleting this lease will remove all associated records. Make sure this is intentional.
                  </Text>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteLease}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Lease
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function LeasesPage() {
  return (
    <ProtectedRoute>
      <LeasesContent />
    </ProtectedRoute>
  )
}
