"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text, Large, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { landlordBuildings } from "@/data/buildings"
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
  List
} from "lucide-react"

export default function TenantListings() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <ListingsContent />
    </ProtectedRoute>
  )
}

function ListingsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedListings, setSavedListings] = useState<string[]>([])

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

  // Get all units from landlord buildings
  const allUnits = landlordBuildings.flatMap(building =>
    Array.from({ length: building.totalUnits }, (_, i) => ({
      id: `${building.id}-unit-${i + 1}`,
      title: `${building.businessName} - Unit ${i + 1}`,
      location: building.location,
      price: Math.floor(building.monthlyRevenue / building.totalUnits),
      currency: "ETB",
      period: "monthly",
      capacity: 4,
      parking: 1,
      area: Math.floor(Math.random() * 100) + 50,
      rating: (Math.random() * 0.5 + 4.3).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
      featured: Math.random() > 0.7,
      type: "apartment",
      listed: "2 weeks ago",
      status: building.status,
      buildingId: building.id
    }))
  )

  // Filter listings
  const filteredListings = allUnits.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          unit.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const toggleSaveListing = (unitId: string) => {
    setSavedListings(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
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

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
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

          {/* Listings Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((unit, index) => (
                <Card
                  key={unit.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
                  style={{
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                    animationDelay: `${index * 100}ms`
                  }}
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
                      onClick={() => toggleSaveListing(unit.id)}
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
          ) : (
            <div className="space-y-4">
              {filteredListings.map((unit, index) => (
                <Card
                  key={unit.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
                  style={{
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                    animationDelay: `${index * 100}ms`
                  }}
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
                        onClick={() => toggleSaveListing(unit.id)}
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
