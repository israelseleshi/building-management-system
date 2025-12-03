"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Heading, Text, MutedText, Large } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Combobox } from "@/components/ui/combobox"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { landlordBuildings } from "@/data/buildings"
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  MapPin,
  Home,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter
} from "lucide-react"

type Building = typeof landlordBuildings[0]

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
  const [buildings, setBuildings] = useState(landlordBuildings)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null)

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
      accessorKey: "name",
      header: "Building Details",
      cell: ({ row }) => {
        const building = row.original
        return (
          <div>
            <div className="font-medium">{building.name}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {building.location}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Manager: {building.manager} • {building.floors} floors
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "totalUnits",
      header: "Units",
      cell: ({ row }) => {
        const building = row.original
        return (
          <div className="text-center">
            <div className="font-medium">{building.occupiedUnits}/{building.totalUnits}</div>
            <div className="text-xs text-muted-foreground">{building.vacantUnits} vacant</div>
          </div>
        )
      },
    },
    {
      accessorKey: "occupiedUnits",
      header: "Occupancy",
      cell: ({ row }) => {
        const building = row.original
        const occupancyRate = Math.round((building.occupiedUnits / building.totalUnits) * 100)
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  occupancyRate >= 90 ? 'bg-green-500' : 
                  occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{occupancyRate}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
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
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "monthlyRevenue",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="text-right font-medium text-foreground">
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
              className="h-8 w-8 p-0 hover:bg-blue-100"
              onClick={() => console.log("View building:", building.id)}
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-green-100"
              onClick={() => console.log("Edit building:", building.id)}
            >
              <Edit className="w-4 h-4 text-green-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-red-100"
              onClick={() => handleDeleteClick(building.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Filter buildings data
  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(buildingsSearch.toLowerCase()) ||
                          building.location.toLowerCase().includes(buildingsSearch.toLowerCase()) ||
                          building.id.toLowerCase().includes(buildingsSearch.toLowerCase())
    const matchesType = buildingFilter === 'all' || building.type === buildingFilter
    const matchesStatus = statusFilter === 'all' || building.status === statusFilter
    const matchesLocation = locationFilter === 'all' || building.location.includes(locationFilter)
    return matchesSearch && matchesType && matchesStatus && matchesLocation
  })

  const handleNavigation = (path: string) => {
    router.push(path)
  }

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

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={`bg-card min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-[290px]'
        }`}
        style={{ 
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="p-6 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex-1" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-muted ml-auto"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <nav className={`px-4 pb-6 ${isSidebarCollapsed ? 'px-2' : ''}`}>
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`menu-item w-full mb-2 transition-all duration-200 ${
                item.active ? 'menu-item-active' : 'menu-item-inactive'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <span className={`${item.active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'} ${
                isSidebarCollapsed ? 'mx-auto' : ''
              }`}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={`px-4 pb-6 mt-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
          <button 
            onClick={handleLogout}
            className={`menu-item w-full transition-all duration-200 hover:bg-red-50 ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isSidebarCollapsed ? "Log Out" : ''}
          >
            <span className={`${isSidebarCollapsed ? 'mx-auto' : ''}`} style={{ color: '#DC2626' }}>
              <LogOut className="w-5 h-5" />
            </span>
            {!isSidebarCollapsed && (
              <span className="ml-3" style={{ color: '#DC2626' }}>Log Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header 
          className="bg-card"
          style={{ 
            boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <div>
                <Heading level={2} className="text-foreground">My Listings</Heading>
                <MutedText className="text-sm">Manage your property portfolio</MutedText>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-black"
                />
              </div>

              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Bell className="w-4 h-4" />
              </Button>

              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/landlord.png" alt="Landlord" />
                  <AvatarFallback>LL</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </header>

        {/* Listings Content */}
        <main className="p-6">
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
          {filteredBuildings.length > 0 ? (
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
                Try adjusting your search or filters to find buildings.
              </Text>
              <Button 
                onClick={() => { setBuildingsSearch(''); setBuildingFilter('all'); setStatusFilter('all'); setLocationFilter('all') }}
                className="transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>

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
