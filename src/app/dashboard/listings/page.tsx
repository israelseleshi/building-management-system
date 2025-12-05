"use client"

import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabaseClient"
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
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Users,
  X
} from "lucide-react"

interface Building {
  id: string
  businessName: string
  name: string
  type: string
  location: string
  status: string
  monthlyRevenue: number
  image?: string
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  tenantCount: number
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
  const [buildingsSearch, setBuildingsSearch] = useState("")
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Building> & { newImage?: File; imagePreview?: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')

        if (error) throw error

        // Transform Supabase data to Building format
        const transformedBuildings: Building[] = (data || []).map((property: any) => ({
          id: property.id,
          businessName: property.title,
          name: property.title,
          type: 'Commercial',
          location: property.city,
          status: property.is_active ? 'Active' : 'Inactive',
          monthlyRevenue: property.monthly_rent,
          image: property.image_url,
          totalUnits: 1,
          occupiedUnits: 1,
          vacantUnits: 0,
          tenantCount: 1,
        }))

        setBuildings(transformedBuildings)
      } catch (err) {
        console.error('Error fetching properties:', err)
        toast({
          title: "Error",
          description: "Failed to load listings from database",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: true
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: false
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false
    }
  ]

  const stats = [
    {
      title: "Total Buildings",
      value: buildings.length.toString(),
      icon: <Home className="w-6 h-6" style={{ color: '#7D8B6F' }} />,
      color: '#7D8B6F'
    },
    {
      title: "Total Units",
      value: buildings.reduce((sum, b) => sum + b.totalUnits, 0).toString(),
      icon: <Building2 className="w-6 h-6" style={{ color: '#7D8B6F' }} />,
      color: '#7D8B6F'
    },
    {
      title: "Occupancy Rate",
      value: `${Math.round((buildings.reduce((sum, b) => sum + b.occupiedUnits, 0) / buildings.reduce((sum, b) => sum + b.totalUnits, 0)) * 100)}%`,
      icon: <TrendingUp className="w-6 h-6" style={{ color: '#7D8B6F' }} />,
      color: '#7D8B6F'
    },
    {
      title: "Monthly Revenue",
      value: `ETB ${(buildings.reduce((sum, b) => sum + b.monthlyRevenue, 0) / 1000000).toFixed(1)}M`,
      icon: <DollarSign className="w-6 h-6" style={{ color: '#7D8B6F' }} />,
      color: '#7D8B6F'
    }
  ]

  // Delete building functions
  const handleDeleteClick = (buildingId: string) => {
    setBuildingToDelete(buildingId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (buildingToDelete) {
      const deletedBuilding = buildings.find(b => b.id === buildingToDelete)
      setBuildings(prevBuildings => prevBuildings.filter(building => building.id !== buildingToDelete))
      setDeleteDialogOpen(false)
      setBuildingToDelete(null)
      
      // Show success toast
      toast({
        title: "Building Deleted",
        description: `${deletedBuilding?.name} has been successfully deleted.`,
        variant: "destructive",
      })
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setBuildingToDelete(null)
  }

  // Column definitions with delete handler
  const columns: ColumnDef<Building>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
          aria-label="Select all"
          className="w-4 h-4 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value.target.checked)}
          aria-label="Select row"
          className="w-4 h-4 cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="flex items-center justify-center py-2">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {building.image ? (
                <img src={building.image} alt={building.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{building.businessName.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "businessName",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          Name
          <span className="text-xs">{column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}</span>
        </button>
      ),
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="font-medium text-foreground">{building.businessName}</div>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          Unit Number
          <span className="text-xs">{column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}</span>
        </button>
      ),
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="font-medium text-foreground">{building.name}</div>
        )
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          Type
          <span className="text-xs">{column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}</span>
        </button>
      ),
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="font-medium text-foreground">{building.type}</div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          Status
          <span className="text-xs">{column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}</span>
        </button>
      ),
      cell: ({ row }) => {
        const building = row.original
        return (
          <Badge 
            variant={building.status === 'Active' ? 'default' : 'secondary'}
            className={`text-xs gap-1 ${
              building.status === 'Active' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}
          >
            {building.status === 'Active' ? (
              <><CheckCircle className="w-3 h-3" /> Active</>
            ) : (
              <><AlertCircle className="w-3 h-3" /> Maintenance</>
            )}
          </Badge>
        )
      },
    },
    {
      accessorKey: "monthlyRevenue",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
        >
          Revenue
          <span className="text-xs">{column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}</span>
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          ETB {(row.getValue("monthlyRevenue") as number).toLocaleString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="flex items-center justify-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              style={{ backgroundColor: '#3b82f620' }}
              onClick={() => {
                setSelectedBuilding(building)
                setViewModalOpen(true)
              }}
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              style={{ backgroundColor: '#10b98120' }}
              onClick={() => {
                setSelectedBuilding(building)
                setEditModalOpen(true)
              }}
            >
              <Edit className="w-4 h-4 text-green-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              style={{ backgroundColor: '#a85c5c20' }}
              onClick={() => handleDeleteClick(building.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]

  // Filter buildings data
  const filteredBuildings = buildings.filter(building => {
    const pageSearch = buildingsSearch.toLowerCase()
    
    const matchesPageSearch = !pageSearch ||
                              building.businessName.toLowerCase().includes(pageSearch) ||
                              building.name.toLowerCase().includes(pageSearch) ||
                              building.location.toLowerCase().includes(pageSearch) ||
                              building.id.toLowerCase().includes(pageSearch)
    
    const matchesType = buildingFilter === 'all' || building.type === buildingFilter
    const matchesStatus = statusFilter === 'all' || building.status === statusFilter
    const matchesLocation = locationFilter === 'all' || building.location.includes(locationFilter)
    
    return matchesPageSearch && matchesType && matchesStatus && matchesLocation
  })

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

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedBuilding) return

    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let imageUrl = selectedBuilding.image

      // Handle image upload/deletion
      if (editFormData.newImage) {
        // Delete old image if it exists
        if (selectedBuilding.image) {
          try {
            const oldImagePath = selectedBuilding.image.split('/').pop()
            if (oldImagePath) {
              await supabase.storage
                .from('images')
                .remove([`properties/${user.id}/${oldImagePath}`])
            }
          } catch (err) {
            console.error('Error deleting old image:', err)
          }
        }

        // Upload new image
        const fileExt = editFormData.newImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `properties/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, editFormData.newImage)

        if (uploadError) throw uploadError

        // Get public URL
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }

      // Prepare update data
      const updateData: any = {
        title: editFormData.businessName || selectedBuilding.businessName,
        monthly_rent: editFormData.monthlyRevenue || selectedBuilding.monthlyRevenue,
        status: editFormData.status === 'Active' ? 'listed' : 'draft',
        updated_at: new Date().toISOString(),
      }

      if (editFormData.newImage) {
        updateData.image_url = imageUrl
      }

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', selectedBuilding.id)
        .eq('landlord_id', user.id)

      if (error) throw error

      // Update local state
      const updatedBuildings = buildings.map(b => 
        b.id === selectedBuilding.id 
          ? {
              ...b,
              businessName: editFormData.businessName || b.businessName,
              monthlyRevenue: editFormData.monthlyRevenue || b.monthlyRevenue,
              status: editFormData.status || b.status,
              image: imageUrl,
            }
          : b
      )
      setBuildings(updatedBuildings)

      toast({
        title: "Success",
        description: "Property updated successfully",
      })
      setEditModalOpen(false)
      setEditFormData({})
    } catch (err) {
      console.error('Error saving edit:', err)
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="My Listings"
          subtitle="Manage your property portfolio"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Listings Content */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" className="text-muted-foreground mb-1">{stat.title}</Text>
                    <Large className="text-3xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </Large>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search buildings by name, location, or ID..."
                  value={buildingsSearch}
                  onChange={(e) => setBuildingsSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Building Type Filter */}
              <Combobox
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Commercial", label: "Commercial" },
                  { value: "Office", label: "Office" },
                  { value: "Retail", label: "Retail" },
                  { value: "Residential", label: "Residential" },
                  { value: "Industrial", label: "Industrial" },
                  { value: "Warehouse", label: "Warehouse" },
                  { value: "Mixed", label: "Mixed" },
                ]}
                value={buildingFilter}
                onValueChange={setBuildingFilter}
                placeholder="All Types"
                className="w-40"
              />

              {/* Status Filter */}
              <Combobox
                options={[
                  { value: "all", label: "All Status" },
                  { value: "Active", label: "Active" },
                  { value: "Maintenance", label: "Maintenance" },
                ]}
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="All Status"
                className="w-40"
              />

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
              >
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
              
              {showMoreFilters && (
                <div className="flex items-center gap-3">
                  <Combobox
                    options={[
                      { value: "all", label: "All Locations" },
                      { value: "Bole", label: "Bole" },
                      { value: "Kazanchis", label: "Kazanchis" },
                      { value: "Mexico Square", label: "Mexico Square" },
                      { value: "Piassa", label: "Piassa" },
                      { value: "Sar Bet", label: "Sar Bet" },
                      { value: "Mekane Yesus", label: "Mekane Yesus" },
                      { value: "Akaki", label: "Akaki" },
                      { value: "Nifas Silk", label: "Nifas Silk" },
                      { value: "Gerji", label: "Gerji" },
                      { value: "Kolfe", label: "Kolfe" },
                      { value: "Yeka", label: "Yeka" },
                      { value: "Lideta", label: "Lideta" },
                      { value: "Gulele", label: "Gulele" },
                      { value: "Arada", label: "Arada" },
                      { value: "Kirkos", label: "Kirkos" },
                      { value: "Addis Ketema", label: "Addis Ketema" },
                      { value: "Meskel Square", label: "Meskel Square" },
                      { value: "Bole Debo", label: "Bole Debo" },
                      { value: "Gullele", label: "Gullele" },
                      { value: "Nifas Silk Lafto", label: "Nifas Silk Lafto" },
                    ]}
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                    placeholder="All Locations"
                    className="w-40"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buildings Table */}
          {loading ? (
            <div 
              className="rounded-2xl p-12 text-center border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-[#7D8B6F] rounded-full animate-spin"></div>
              </div>
              <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                Loading listings...
              </Heading>
              <Text className="text-muted-foreground">
                Fetching your properties from the database
              </Text>
            </div>
          ) : filteredBuildings.length > 0 ? (
            <DataTable columns={columns} data={filteredBuildings} pageSize={8} />
          ) : (
            <div 
              className="rounded-2xl p-12 text-center border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                No buildings found
              </Heading>
              <Text className="text-muted-foreground mb-4">
                You haven't created any listings yet. Start by creating your first property listing.
              </Text>
              <Button 
                onClick={() => router.push('/dashboard/create')}
                className="transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
              >
                Create First Listing
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent 
          className="sm:max-w-3xl border-0 p-0 overflow-hidden max-h-[90vh] flex flex-col"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <DialogTitle className="sr-only">View Building Details</DialogTitle>
          {selectedBuilding && (
            <>
              {/* Header with Image */}
              <div className="relative h-56 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex-shrink-0">
                {selectedBuilding.image ? (
                  <img 
                    src={selectedBuilding.image} 
                    alt={selectedBuilding.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                    <Building2 className="w-32 h-32 text-white opacity-30" />
                  </div>
                )}
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="w-full p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedBuilding.businessName}</h2>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={selectedBuilding.status === 'Active' ? 'default' : 'secondary'}
                        className={`text-xs gap-1 ${
                          selectedBuilding.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {selectedBuilding.status === 'Active' ? (
                          <><CheckCircle className="w-3 h-3" /> Active</>
                        ) : (
                          <><AlertCircle className="w-3 h-3" /> Maintenance</>
                        )}
                      </Badge>
                      <span className="text-sm text-white/90 font-medium">{selectedBuilding.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Unit Number</p>
                    <p className="text-xl font-bold text-foreground">{selectedBuilding.name}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Monthly Revenue</p>
                    <p className="text-xl font-bold text-foreground">ETB {selectedBuilding.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Occupancy</p>
                    <p className="text-xl font-bold text-foreground">{selectedBuilding.occupiedUnits}/{selectedBuilding.totalUnits}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Location</p>
                    <p className="text-xl font-bold text-foreground">{selectedBuilding.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                    <p className="text-3xl font-bold text-foreground">{selectedBuilding.totalUnits}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Total Units</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                    <p className="text-3xl font-bold text-foreground">{selectedBuilding.tenantCount}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Tenants</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                    <p className="text-3xl font-bold text-foreground">{Math.round((selectedBuilding.occupiedUnits / selectedBuilding.totalUnits) * 100)}%</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Occupancy</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-background/50 border-t border-border flex justify-end gap-3 flex-shrink-0">
                <Button 
                  variant="outline"
                  onClick={() => setViewModalOpen(false)}
                  className="border-border"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setViewModalOpen(false)
                    setEditModalOpen(true)
                  }}
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  Edit Unit
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent 
          className="sm:max-w-3xl border-0 p-0 overflow-hidden max-h-[90vh] flex flex-col"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <DialogTitle className="sr-only">Edit Building Details</DialogTitle>
          {selectedBuilding && (
            <>
              {/* Header with Image - Editable */}
              <div className="relative h-56 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden flex-shrink-0 group cursor-pointer">
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setEditFormData(prev => ({ ...prev, newImage: file, imagePreview: event.target?.result as string }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                {editFormData.imagePreview || selectedBuilding.image ? (
                  <img 
                    src={editFormData.imagePreview || selectedBuilding.image} 
                    alt={selectedBuilding.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                    <Edit className="w-32 h-32 text-white opacity-30" />
                  </div>
                )}
                {/* Overlay with Edit Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 flex-col gap-3">
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <div className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all">
                      <Edit className="w-4 h-4" />
                      Change Image
                    </div>
                  </label>
                  {editFormData.newImage && (
                    <button 
                      onClick={() => setEditFormData(prev => ({ ...prev, newImage: undefined, imagePreview: undefined }))}
                      className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Remove New Image
                    </button>
                  )}
                </div>
                {/* Title Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end pointer-events-none">
                  <div className="w-full p-6">
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedBuilding.businessName}</h2>
                    <p className="text-white/80 text-sm">Edit Unit Details</p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Business Name</label>
                    <input 
                      type="text" 
                      value={editFormData.businessName !== undefined ? editFormData.businessName : selectedBuilding.businessName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Unit Number</label>
                      <input 
                        type="text" 
                        value={editFormData.name !== undefined ? editFormData.name : selectedBuilding.name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Type</label>
                      <Combobox
                        options={[
                          { value: "Office", label: "Office" },
                          { value: "Retail", label: "Retail" },
                          { value: "Residential", label: "Residential" },
                          { value: "Commercial", label: "Commercial" },
                          { value: "Industrial", label: "Industrial" },
                          { value: "Warehouse", label: "Warehouse" },
                        ]}
                        value={editFormData.type || selectedBuilding.type}
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, type: value }))}
                        placeholder="Select type"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Monthly Revenue (ETB)</label>
                      <input 
                        type="number" 
                        value={editFormData.monthlyRevenue !== undefined ? editFormData.monthlyRevenue : selectedBuilding.monthlyRevenue}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, monthlyRevenue: parseFloat(e.target.value) }))}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
                      <Combobox
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Maintenance", label: "Maintenance" },
                        ]}
                        value={editFormData.status || selectedBuilding.status}
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                        placeholder="Select status"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Total Units</p>
                      <p className="text-2xl font-bold text-foreground">{selectedBuilding.totalUnits}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Occupied</p>
                      <p className="text-2xl font-bold text-foreground">{selectedBuilding.occupiedUnits}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-primary/50 transition-colors">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Vacant</p>
                      <p className="text-2xl font-bold text-foreground">{selectedBuilding.vacantUnits}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-background/50 border-t border-border flex justify-end gap-3 flex-shrink-0">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false)
                    setEditFormData({})
                  }}
                  className="border-border"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Delete Building</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete this building? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={cancelDelete}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Delete Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
