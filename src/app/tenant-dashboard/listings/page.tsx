"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text, Large, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ListingDetailView } from "@/components/tenant/ListingDetailView"
import { supabase } from "@/lib/supabaseClient"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  MapPin,
  Users,
  Car,
  Square,
  Heart,
  Sparkles,
  Star,
  ArrowRight,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Loader
} from "lucide-react"

export default function TenantListings() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <ListingsContent />
    </ProtectedRoute>
  )
}

interface Unit {
  id: string
  title: string
  location: string
  price: number
  currency: string
  period: string
  capacity: number
  parking: number
  area: number
  rating: string
  reviews: number
  image: string
  featured: boolean
  type: string
  listed: string
  status: string
  buildingId: string
}

function ListingsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedListings, setSavedListings] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [allUnits, setAllUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 6

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: false
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: true
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: false
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: false
    }
  ]

  // Mock images for variety
  const mockImages = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop",
  ]

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)

        if (error) throw error

        const transformedUnits: Unit[] = (data || []).map((property: any, index: number) => ({
          id: property.id.toString(),
          title: property.title,
          location: `${property.address_line1}, ${property.city}`,
          price: property.monthly_rent,
          currency: 'ETB',
          period: 'monthly',
          capacity: 4,
          parking: 1,
          area: 80 + (index % 50),
          rating: (4.3 + (index % 5) * 0.1).toFixed(1),
          reviews: 10 + (index % 20),
          image: mockImages[index % mockImages.length],
          featured: index < 3,
          type: 'apartment',
          listed: new Date(property.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: 'active',
          buildingId: property.id.toString()
        }))

        setAllUnits(transformedUnits)
      } catch (err) {
        console.error('Error fetching listings:', err)
        setAllUnits([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Filter listings
  const filteredListings = allUnits.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedListings = filteredListings.slice(startIndex, endIndex)

  const toggleSaveListing = (unitId: string) => {
    setSavedListings(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

  const handleViewDetails = (unit: Unit) => {
    setSelectedUnit(unit)
  }

  const handleBackToListings = () => {
    setSelectedUnit(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          onNavigate={handleSidebarNavigation}
        />

        <div className="flex-1 transition-all duration-300 ease-in-out">
          <DashboardHeader
            title="Available Units"
            subtitle="Loading units..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="p-6 flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <Text className="text-muted-foreground">Loading available units...</Text>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // If a unit is selected, show detail view
  if (selectedUnit) {
    return (
      <div className="min-h-screen flex">
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
            title="Unit Details"
            subtitle="View detailed information about this unit"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Detail Content */}
          <main className="p-6">
            <ListingDetailView
              unit={selectedUnit}
              onBack={handleBackToListings}
              isSaved={savedListings.includes(selectedUnit.id)}
              onToggleSave={() => toggleSaveListing(selectedUnit.id)}
            />
          </main>
        </div>
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

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Available Units"
          subtitle="Browse all available rental units"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Listings Content */}
        <main className="p-6">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="text-foreground">
                {filteredListings.length} Units Available
              </Heading>
              <MutedText className="mt-1">Browse and save your favorite units</MutedText>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>

          {/* Listings Grid/List with Pagination */}
          {viewMode === 'grid' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedListings.map((unit, index) => (
                  <Card
                    key={unit.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 cursor-pointer"
                    style={{
                      boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={() => handleViewDetails(unit)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {unit.featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaveListing(unit.id)
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-200 ${savedListings.includes(unit.id) ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                        />
                      </Button>
                      <img
                        src={unit.image}
                        alt={unit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Heading level={3} className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                            {unit.title}
                          </Heading>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {unit.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{unit.capacity} capacity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          <span>{unit.parking} parking</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          <span>{unit.area} m²</span>
                        </div>
                      </div>

                      <div className="border-t border-border my-4"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline">
                            <Large className="text-primary">{unit.price.toLocaleString()}</Large>
                            <Text size="sm" className="text-muted-foreground ml-1">
                              {unit.currency}/{unit.period}
                            </Text>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {unit.rating} ({unit.reviews} reviews) • {unit.listed}
                          </div>
                        </div>
                        <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                          View
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "min-w-10" : ""}
                        style={currentPage === page ? { backgroundColor: '#7D8B6F', color: '#FFFFFF' } : {}}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedListings.map((unit, index) => (
                <Card
                  key={unit.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 cursor-pointer"
                  style={{
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => handleViewDetails(unit)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      {unit.featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaveListing(unit.id)
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-200 ${savedListings.includes(unit.id) ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                        />
                      </Button>
                      <img
                        src={unit.image}
                        alt={unit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Heading level={3} className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors duration-200">
                            {unit.title}
                          </Heading>
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {unit.location}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {unit.status === 'Active' ? 'Available' : 'Maintenance'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline">
                            <Large className="text-primary">{unit.price.toLocaleString()}</Large>
                            <Text size="sm" className="text-muted-foreground ml-1">
                              {unit.currency}/{unit.period}
                            </Text>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {unit.rating} ({unit.reviews} reviews)
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border my-4"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{unit.capacity} capacity</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span>{unit.parking} parking</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{unit.area} m²</span>
                          </div>
                        </div>
                        <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}

              {/* Pagination Controls for List View */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "min-w-10" : ""}
                        style={currentPage === page ? { backgroundColor: '#7D8B6F', color: '#FFFFFF' } : {}}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {filteredListings.length === 0 && (
            <Card className="text-center py-12 border-0">
              <CardContent>
                <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                  No units found
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  Try adjusting your search to find available units.
                </Text>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
