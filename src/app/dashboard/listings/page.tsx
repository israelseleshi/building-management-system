"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heading, Text, MutedText, Large } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table"
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
  X,
  MapPin,
  Home,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Plus
} from "lucide-react"

// Mock data for landlord buildings
const landlordBuildings = [
  {
    id: "BLD001",
    name: "Bole Commercial Center",
    type: "Commercial",
    location: "Bole, Addis Ababa",
    floors: 12,
    totalUnits: 48,
    occupiedUnits: 42,
    vacantUnits: 6,
    yearBuilt: 2018,
    manager: "Abebe Kebede",
    status: "Active",
    monthlyRevenue: 875000,
    lastInspection: "2024-11-15",
    nextMaintenance: "2025-01-20",
    tenantCount: 42,
    avgRentPerUnit: 20833
  },
  {
    id: "BLD002",
    name: "Kazanchis Plaza",
    type: "Office",
    location: "Kazanchis, Addis Ababa",
    floors: 8,
    totalUnits: 32,
    occupiedUnits: 28,
    vacantUnits: 4,
    yearBuilt: 2020,
    manager: "Tigist Haile",
    status: "Active",
    monthlyRevenue: 620000,
    lastInspection: "2024-10-28",
    nextMaintenance: "2025-02-15",
    tenantCount: 28,
    avgRentPerUnit: 22143
  },
  {
    id: "BLD003",
    name: "Mexico Square Mall",
    type: "Retail",
    location: "Mexico Square, Addis Ababa",
    floors: 4,
    totalUnits: 120,
    occupiedUnits: 98,
    vacantUnits: 22,
    yearBuilt: 2015,
    manager: "Dawit Mengistu",
    status: "Active",
    monthlyRevenue: 1240000,
    lastInspection: "2024-11-01",
    nextMaintenance: "2025-01-10",
    tenantCount: 98,
    avgRentPerUnit: 12653
  },
  {
    id: "BLD004",
    name: "Piassa Heritage Building",
    type: "Mixed",
    location: "Piassa, Addis Ababa",
    floors: 6,
    totalUnits: 24,
    occupiedUnits: 18,
    vacantUnits: 6,
    yearBuilt: 2012,
    manager: "Sara Tesfaye",
    status: "Maintenance",
    monthlyRevenue: 380000,
    lastInspection: "2024-09-20",
    nextMaintenance: "2024-12-01",
    tenantCount: 18,
    avgRentPerUnit: 21111
  },
  {
    id: "BLD005",
    name: "Sar Bet Industrial Complex",
    type: "Industrial",
    location: "Sar Bet, Addis Ababa",
    floors: 3,
    totalUnits: 16,
    occupiedUnits: 14,
    vacantUnits: 2,
    yearBuilt: 2019,
    manager: "Mohammed Ali",
    status: "Active",
    monthlyRevenue: 450000,
    lastInspection: "2024-11-10",
    nextMaintenance: "2025-03-01",
    tenantCount: 14,
    avgRentPerUnit: 32143
  },
  {
    id: "BLD006",
    name: "Mekane Yesus Residences",
    type: "Residential",
    location: "Mekane Yesus, Addis Ababa",
    floors: 10,
    totalUnits: 80,
    occupiedUnits: 76,
    vacantUnits: 4,
    yearBuilt: 2021,
    manager: "Lemma Bekele",
    status: "Active",
    monthlyRevenue: 520000,
    lastInspection: "2024-11-05",
    nextMaintenance: "2025-02-10",
    tenantCount: 76,
    avgRentPerUnit: 6842
  },
  {
    id: "BLD007",
    name: "Akaki Logistics Hub",
    type: "Warehouse",
    location: "Akaki, Addis Ababa",
    floors: 2,
    totalUnits: 8,
    occupiedUnits: 6,
    vacantUnits: 2,
    yearBuilt: 2020,
    manager: "Kassahun Yimer",
    status: "Active",
    monthlyRevenue: 280000,
    lastInspection: "2024-10-15",
    nextMaintenance: "2025-01-25",
    tenantCount: 6,
    avgRentPerUnit: 46667
  },
  {
    id: "BLD008",
    name: "Bole Medhanealem Tower",
    type: "Office",
    location: "Bole Medhanealem, Addis Ababa",
    floors: 15,
    totalUnits: 60,
    occupiedUnits: 55,
    vacantUnits: 5,
    yearBuilt: 2022,
    manager: "Ruth Gebre",
    status: "Active",
    monthlyRevenue: 980000,
    lastInspection: "2024-11-20",
    nextMaintenance: "2025-04-01",
    tenantCount: 55,
    avgRentPerUnit: 17818
  }
]

export default function LandlordListings() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ListingsContent />
    </ProtectedRoute>
  )
}

function ListingsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [buildingsSearch, setBuildingsSearch] = useState("")
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  // Filter buildings data
  const filteredBuildings = landlordBuildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(buildingsSearch.toLowerCase()) ||
                          building.location.toLowerCase().includes(buildingsSearch.toLowerCase()) ||
                          building.id.toLowerCase().includes(buildingsSearch.toLowerCase())
    const matchesType = buildingFilter === 'all' || building.type === buildingFilter
    const matchesStatus = statusFilter === 'all' || building.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewBuilding = (buildingId: string) => {
    console.log("View building:", buildingId)
  }

  const handleEditBuilding = (buildingId: string) => {
    console.log("Edit building:", buildingId)
  }

  const handleDeleteBuilding = (buildingId: string) => {
    console.log("Delete building:", buildingId)
  }

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
    <div className="min-h-screen flex">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-muted"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
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
                  className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Bell className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/landlord.png" alt="Landlord" />
                      <AvatarFallback>LL</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <Text weight="medium" className="text-foreground">Landlord</Text>
                      <Text size="sm" className="text-muted-foreground">landlord@bms.com</Text>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Listings Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-muted-foreground mb-1">Total Buildings</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    {landlordBuildings.length}
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">In your portfolio</Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <Building2 className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-muted-foreground mb-1">Total Units</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    {landlordBuildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {landlordBuildings.reduce((sum, b) => sum + b.vacantUnits, 0)} vacant
                  </Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <Home className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-muted-foreground mb-1">Occupancy Rate</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    {Math.round((landlordBuildings.reduce((sum, b) => sum + b.occupiedUnits, 0) / landlordBuildings.reduce((sum, b) => sum + b.totalUnits, 0)) * 100)}%
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {landlordBuildings.reduce((sum, b) => sum + b.occupiedUnits, 0)} occupied units
                  </Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl p-5 md:p-6 border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-muted-foreground mb-1">Monthly Revenue</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    ETB {(landlordBuildings.reduce((sum, b) => sum + b.monthlyRevenue, 0) / 1000000).toFixed(1)}M
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">From all properties</Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <DollarSign className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </div>
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
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="gap-2" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                <Plus className="w-4 h-4" />
                Add Building
              </Button>
              
              {/* Building Type Filter */}
              <select 
                value={buildingFilter}
                onChange={(e) => setBuildingFilter(e.target.value)}
                className="px-3 py-2 h-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              >
                <option value="all">All Types</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Mixed">Mixed</option>
              </select>

              {/* Status Filter */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 h-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Buildings Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-center">Occupancy</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuildings.map((building) => {
                  const occupancyRate = Math.round((building.occupiedUnits / building.totalUnits) * 100)
                  return (
                    <TableRow key={building.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {building.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{building.occupiedUnits}/{building.totalUnits}</div>
                          <div className="text-xs text-muted-foreground">{building.vacantUnits} vacant</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
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
                          <span className="text-xs font-medium">{occupancyRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">ETB {building.monthlyRevenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            Avg: ETB {building.avgRentPerUnit.toLocaleString()}/unit
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                            onClick={() => handleViewBuilding(building.id)}
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            onClick={() => handleEditBuilding(building.id)}
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-red-100"
                            onClick={() => handleDeleteBuilding(building.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableCaption>
                Showing {filteredBuildings.length} of {landlordBuildings.length} buildings
              </TableCaption>
            </Table>
          </div>

          {/* No Results */}
          {filteredBuildings.length === 0 && (
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
                onClick={() => { setBuildingsSearch(''); setBuildingFilter('all'); setStatusFilter('all') }}
                className="transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
