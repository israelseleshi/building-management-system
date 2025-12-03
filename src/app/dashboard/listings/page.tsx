"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heading, Text, Large } from "@/components/ui/typography"
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
  Building2, 
  Search, 
  ArrowRight, 
  MapPin, 
  Home,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter
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

export default function LandlordListingsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ListingsContent />
    </ProtectedRoute>
  )
}

function ListingsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter buildings data
  const filteredBuildings = landlordBuildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          building.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          building.id.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Heading level={1} className="text-2xl font-bold text-foreground">
                My Buildings
              </Heading>
              <Text className="text-muted-foreground">
                Manage your property portfolio and track performance
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Dashboard
              </Button>
              <Button 
                style={{ 
                  backgroundColor: '#7D8B6F', 
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                }}
                className="hover:opacity-90 transition-opacity gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Building
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm mb-1">Total Buildings</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    {landlordBuildings.length}
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">In your portfolio</Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <Building2 className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm mb-1">Total Units</Text>
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
            </CardContent>
          </Card>

          <Card className="border-0" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm mb-1">Occupancy Rate</Text>
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
            </CardContent>
          </Card>

          <Card className="border-0" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-muted-foreground text-sm mb-1">Monthly Revenue</Text>
                  <Large className="text-3xl font-bold" style={{ color: '#7D8B6F' }}>
                    ETB {(landlordBuildings.reduce((sum, b) => sum + b.monthlyRevenue, 0) / 1000000).toFixed(1)}M
                  </Large>
                  <Text className="text-xs text-muted-foreground mt-1">From all properties</Text>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                  <DollarSign className="w-6 h-6" style={{ color: '#7D8B6F' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search buildings by name, location, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 text-base"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        <Card className="border-0" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Building ID</TableHead>
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
                      <TableCell className="font-medium">{building.id}</TableCell>
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
          </CardContent>
        </Card>

        {/* No Results */}
        {filteredBuildings.length === 0 && (
          <Card className="text-center py-12 border-0">
            <CardContent>
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                No buildings found
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find buildings.
              </Text>
              <Button 
                onClick={() => { setSearchQuery(''); setBuildingFilter('all'); setStatusFilter('all') }}
                className="transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
