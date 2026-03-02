"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text, Large, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ListingDetailView } from "@/components/tenant/ListingDetailView"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
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
  unitNumber?: string
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
  const t = useTranslations("Tenant")
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [savedListings, setSavedListings] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [allUnits, setAllUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 6
  const dateLocale = locale === "am" ? "am-ET" : "en-US"

  const getUnitTitle = (unit: Unit) => {
    if (unit.unitNumber) {
      return t("listings.unitTitle", { number: unit.unitNumber })
    }
    return unit.title
  }

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

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        // Use public listings endpoint - accessible to all users including tenants
        const listingsRes = await fetch(`${API_BASE_URL}/public/listings`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const listingsPayload = await listingsRes.json().catch(() => ({}))
        if (!listingsRes.ok || listingsPayload?.success === false) {
          throw new Error(listingsPayload?.error || listingsPayload?.message || "Failed to load listings")
        }

        const units = (listingsPayload?.data?.units || []) as any[]

        const transformedUnits: Unit[] = (units || []).map((unit: any, index: number) => {
          const unitNumber = unit.unit_number?.toString() || ""
          return {
            id: unit.unit_id?.toString() || `${unit.building?.building_id}-${unit.unit_number}`,
            title: unitNumber ? `Unit ${unitNumber}` : "Unit",
            unitNumber,
            location: unit.building?.address || 'Unknown location',
          price: unit.rent_amount,
          currency: 'ETB',
          period: 'monthly',
          capacity: (unit.bedrooms || 1) * 2,
          parking: 1,
          area: unit.size_sqm || 80 + (index % 50),
          rating: (4.3 + (index % 5) * 0.1).toFixed(1),
          reviews: 10 + (index % 20),
          image: mockImages[index % mockImages.length],
          featured: index < 3,
          type: 'apartment',
          listed: new Date().toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' }),
          status: unit.status || 'vacant',
          buildingId: unit.building?.building_id?.toString() || ''
          }
        })

        setAllUnits(transformedUnits)
      } catch (err) {
        console.error('Error fetching listings:', err)
        setAllUnits([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [dateLocale])

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
            title={t("listings.loading.title")}
            subtitle={t("listings.loading.subtitle")}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t("header.searchPlaceholder")}
          />

          <main className="p-6 flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <Text className="text-muted-foreground">{t("listings.loading.message")}</Text>
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
            title={t("listings.details.title")}
            subtitle={t("listings.details.subtitle")}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t("header.searchPlaceholder")}
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
          title={t("listings.header.title")}
          subtitle={t("listings.header.subtitle")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("header.searchPlaceholder")}
        />

        {/* Listings Content */}
        <main className="p-6">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="text-foreground">
                {t("listings.results.title", { count: filteredListings.length })}
              </Heading>
              <MutedText className="mt-1">{t("listings.results.subtitle")}</MutedText>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid className="w-4 h-4" />
                {t("listings.view.grid")}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                {t("listings.view.list")}
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
                            {t("listings.badge.featured")}
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
                        alt={getUnitTitle(unit)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Heading level={3} className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                            {getUnitTitle(unit)}
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
                          <span>{unit.capacity} {t("listings.stats.capacity")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          <span>{unit.parking} {t("listings.stats.parking")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          <span>{unit.area} {t("listings.stats.areaUnit")}</span>
                        </div>
                      </div>

                      <div className="border-t border-border my-4"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline">
                            <Large className="text-primary">{unit.price?.toLocaleString() || '0'}</Large>
                            <Text size="sm" className="text-muted-foreground ml-1">
                              {unit.currency}/{unit.period}
                            </Text>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {unit.rating} ({unit.reviews} {t("listings.stats.reviews")}) • {unit.listed}
                          </div>
                        </div>
                        <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                          {t("listings.actions.view")}
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
                    {t("listings.pagination.previous")}
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
                    {t("listings.pagination.next")}
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
                            {t("listings.badge.featured")}
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
                        alt={getUnitTitle(unit)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Heading level={3} className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors duration-200">
                            {getUnitTitle(unit)}
                          </Heading>
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {unit.location}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {unit.status === 'Active'
                              ? t("listings.status.available")
                              : t("listings.status.maintenance")}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline">
                            <Large className="text-primary">{unit.price?.toLocaleString() || '0'}</Large>
                            <Text size="sm" className="text-muted-foreground ml-1">
                              {unit.currency}/{unit.period}
                            </Text>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {unit.rating} ({unit.reviews} {t("listings.stats.reviews")})
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border my-4"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{unit.capacity} {t("listings.stats.capacity")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span>{unit.parking} {t("listings.stats.parking")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{unit.area} {t("listings.stats.areaUnit")}</span>
                          </div>
                        </div>
                        <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                          {t("listings.actions.viewDetails")}
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
                    {t("listings.pagination.previous")}
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
                    {t("listings.pagination.next")}
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
                  {t("listings.empty.title")}
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  {t("listings.empty.subtitle")}
                </Text>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  {t("listings.empty.clear")}
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
