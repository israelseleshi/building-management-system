"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heading, Text, Large } from "@/components/ui/typography"
import { Header } from "@/components/home/Header"
import { ListingDetailView } from "@/components/home/ListingDetailView"
import { supabase } from "@/lib/supabaseClient"
import { 
  Building, 
  Search, 
  Star, 
  ArrowRight, 
  MapPin, 
  Users, 
  Car, 
  Square,
  Filter,
  Grid,
  List,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  Loader
} from "lucide-react"

interface Listing {
  id: string
  title: string
  location: string
  price: number
  currency: string
  period: string
  capacity: number
  parking: number
  area: number
  rating: number
  reviews: number
  image: string
  featured: boolean
  amenities: string[]
  type: string
  listed: string
}

const ITEMS_PER_PAGE = 6

function ListingsPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredType, setFilteredType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [savedListings, setSavedListings] = useState<string[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('is_active', true)

        if (fetchError) throw fetchError

        // Transform database records to listing format
        const transformedListings: Listing[] = (data || []).map((property: any, index: number) => ({
          id: property.id.toString(),
          title: property.title,
          location: `${property.address_line1}, ${property.city}`,
          price: property.monthly_rent,
          currency: 'ETB',
          period: 'monthly',
          capacity: 20, // Default values since DB doesn't have these
          parking: 10,
          area: 150,
          rating: 4.5 + (index % 5) * 0.1, // Vary ratings
          reviews: 10 + (index % 20),
          image: property.image_url || `https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&t=${index}`,
          featured: index < 3, // First 3 are featured
          amenities: ['Air Conditioning', 'Security', 'Parking', 'Storage'],
          type: property.description?.includes('Office') ? 'office' : property.description?.includes('Retail') ? 'retail' : 'commercial',
          listed: new Date(property.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }))

        setAllListings(transformedListings)
        setError(null)
      } catch (err) {
        console.error('Error fetching listings:', err)
        setError('Failed to load listings. Please try again.')
        setAllListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Filter and sort listings
  const allFilteredListings = allListings
    .filter((listing: Listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filteredType === 'all' || listing.type === filteredType
      return matchesSearch && matchesType
    })
    .sort((a: Listing, b: Listing) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(allFilteredListings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const filteredListings = allFilteredListings.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filteredType, sortBy])

  const toggleSaveListing = (listingId: string) => {
    setSavedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing)
  }

  const handleBackToListings = () => {
    setSelectedListing(null)
  }

  // If a listing is selected, show detail view
  if (selectedListing) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header currentPage="listings" />

        {/* Detail Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ListingDetailView
              listing={selectedListing}
              onBack={handleBackToListings}
              isSaved={savedListings.includes(selectedListing.id)}
              onToggleSave={() => toggleSaveListing(selectedListing.id)}
            />
          </div>
        </section>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="listings" />
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-96">
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
            <Text className="text-muted-foreground">Loading properties...</Text>
          </div>
        </section>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPage="listings" />
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card className="text-center py-12 border-0">
              <CardContent>
                <Building className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                  Error Loading Properties
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  {error}
                </Text>
                <Button 
                  onClick={() => window.location.reload()}
                  className="transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header currentPage="listings" />

      {/* Search and Filters Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <Heading level={1} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Commercial Properties
            </Heading>
            <Text size="lg" className="text-muted-foreground max-w-2xl mx-auto">
              Discover shops, offices, warehouses and commercial spaces across Addis Ababa
            </Text>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search properties, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-border/50 focus:border-primary/50 transition-all duration-200 hover:border-primary/30"
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <select
                value={filteredType}
                onChange={(e) => setFilteredType(e.target.value)}
                className="px-4 py-3 rounded-lg border border-border/50 bg-background text-sm focus:border-primary/50 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                <option value="all">All Types</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="warehouse">Warehouse</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-lg border border-border/50 bg-background text-sm focus:border-primary/50 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1 hover:shadow-sm transition-all duration-200">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <Text className="text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, allFilteredListings.length)} of {allFilteredListings.length} commercial properties
              </Text>
            </div>
            <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:scale-105">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Listings Grid/List */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <Card 
                  key={listing.id} 
                  className="overflow-hidden border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up hover:scale-105"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)',
                    animationDelay: `${index * 0.05}s`
                  }}
                  onClick={() => handleViewDetails(listing)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.featured && (
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
                      onClick={() => toggleSaveListing(listing.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-all duration-200 ${savedListings.includes(listing.id) ? 'fill-red-500 text-red-500 scale-110' : ''}`} 
                      />
                    </Button>
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Heading level={3} className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                          {listing.title}
                        </Heading>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {listing.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      {listing.capacity > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{listing.capacity} capacity</span>
                        </div>
                      )}
                      {listing.parking > 0 && (
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          <span>{listing.parking} parking</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{listing.area} m²</span>
                      </div>
                    </div>

                    <div className="border-t border-border my-4"></div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline">
                          <Large className="text-primary">{listing.price.toLocaleString()}</Large>
                          <Text size="sm" className="text-muted-foreground ml-1">
                            {listing.currency}/{listing.period}
                          </Text>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {listing.rating} ({listing.reviews} reviews) • {listing.listed}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="gap-2 transition-all duration-200 hover:scale-105" 
                        style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                        onClick={() => handleViewDetails(listing)}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing, index) => (
                <Card 
                  key={listing.id} 
                  className="overflow-hidden border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up hover:translate-x-1"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)',
                    animationDelay: `${index * 0.05}s`
                  }}
                  onClick={() => handleViewDetails(listing)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      {listing.featured && (
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
                        onClick={() => toggleSaveListing(listing.id)}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-all duration-200 ${savedListings.includes(listing.id) ? 'fill-red-500 text-red-500 scale-110' : ''}`} 
                        />
                      </Button>
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Heading level={3} className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors duration-200">
                            {listing.title}
                          </Heading>
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {listing.location}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {listing.amenities.slice(0, 3).map((amenity, amenityIndex) => (
                              <Badge key={amenityIndex} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline">
                            <Large className="text-primary">{listing.price.toLocaleString()}</Large>
                            <Text size="sm" className="text-muted-foreground ml-1">
                              {listing.currency}/{listing.period}
                            </Text>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {listing.rating} ({listing.reviews} reviews)
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border my-4"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {listing.capacity > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{listing.capacity} capacity</span>
                            </div>
                          )}
                          {listing.parking > 0 && (
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>{listing.parking} parking</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{listing.area} m²</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Listed {listing.listed}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="gap-2 transition-all duration-200 hover:scale-105" 
                          style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                          onClick={() => handleViewDetails(listing)}
                        >
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
                <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <Heading level={3} className="text-xl font-semibold text-foreground mb-2">
                  No commercial properties found
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find commercial spaces.
                </Text>
                <Button 
                  onClick={() => { setSearchQuery(''); setFilteredType('all'); setSortBy('featured') }}
                  className="transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {allFilteredListings.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="transition-all duration-200"
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="transition-all duration-200 min-w-10"
                    style={currentPage === page ? { backgroundColor: '#7D8B6F', color: '#FFFFFF' } : {}}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="transition-all duration-200"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">BMS</span>
                </div>
                <span className="text-xl font-bold text-foreground">BMS</span>
              </div>
              <Text className="text-muted-foreground">
                The modern way to find, manage, and rent properties.
              </Text>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-4">Product</Heading>
              <ul className="space-y-2">
                <li><a href="/home" className="text-muted-foreground hover:text-foreground">Home</a></li>
                <li><a href="/home/listings" className="text-primary font-medium">Listings</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Security</a></li>
              </ul>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-4">Company</Heading>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-4">Legal</Heading>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <Text className="text-muted-foreground">
              © 2025 Building Management System. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  )
}
