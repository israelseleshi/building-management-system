"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { ListingDetailView } from "@/components/home/ListingDetailView"
import { API_BASE_URL } from "@/lib/apiClient"
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

const ITEMS_PER_PAGE = 8

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

  // Fetch listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const url = `${API_BASE_URL}/public/listings`
        const response = await fetch(url)
        const contentType = response.headers.get("content-type") || ""
        const isJson = contentType.includes("application/json")

        const payload = isJson ? await response.json().catch(() => ({})) : null
        const rawText = !isJson ? await response.text().catch(() => "") : ""

        if (!response.ok) {
          const backendMessage = (payload as any)?.message || (payload as any)?.error
          const preview = rawText ? rawText.slice(0, 120) : ""
          throw new Error(
            backendMessage ||
              `Failed to fetch listings (${response.status}). ${preview ? `Response: ${preview}` : `URL: ${url}`}`
          )
        }

        // Transform database records to listing format
        const transformedListings: Listing[] = (((payload as any)?.data?.units as any[]) || []).map((row: any, index: number) => {
          const unit = row
          const building = row?.building
          const buildingName = building?.name || "Building"
          const unitNumber = unit?.unit_number?.toString?.() || "Unit"
          const title = `${buildingName} - ${unitNumber}`
          const location = building?.address || building?.city || ""
          const amenitiesRaw = building?.amenities
          const amenities = Array.isArray(amenitiesRaw) ? amenitiesRaw : []

          // Professional empty room/modern office images
          const roomImages = [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", // Modern office
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", // Bright conference
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80", // Minimalist workspace
            "https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=800&q=80", // Industrial loft
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", // Luxury empty room
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", // Clean modern interior
          ]

          return {
            id: (unit?.unit_id ?? unit?.id ?? `${index}`).toString(),
            title,
            location,
            price: Number(unit?.base_rent || 0),
            currency: 'ETB',
            period: 'monthly',
            capacity: 20, 
            parking: 10,
            area: Number(unit?.sqft || 0) || 150,
            rating: 4.5 + (index % 5) * 0.1,
            reviews: 10 + (index % 20),
            image: roomImages[index % roomImages.length],
            featured: index < 3,
            amenities: amenities.length > 0 ? amenities : ['Security', 'Parking'],
            type: 'commercial',
            listed: new Date(building?.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }
        })

        setAllListings(transformedListings)
        setError(null)
      } catch (err: any) {
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
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', display: 'flex', flexDirection: 'column' }}>
        <Header currentPage="listings" />
        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <ListingDetailView
              listing={selectedListing}
              onBack={handleBackToListings}
              isSaved={savedListings.includes(selectedListing.id)}
              onToggleSave={() => toggleSaveListing(selectedListing.id)}
            />
          </div>
        </main>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', display: 'flex', flexDirection: 'column' }}>
        <Header currentPage="listings" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader style={{ width: '48px', height: '48px', color: '#1F3549', animation: 'spin 1s linear infinite' }} />
            <Text style={{ color: '#6b7280' }}>Loading properties...</Text>
          </div>
        </main>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', display: 'flex', flexDirection: 'column' }}>
        <Header currentPage="listings" />
        <main style={{ flex: 1, padding: '3rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem' }}>
            <Building style={{ width: '64px', height: '64px', color: '#ef4444', margin: '0 auto 1rem' }} />
            <Heading level={3} style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F3549', marginBottom: '0.5rem' }}>
              Error Loading Properties
            </Heading>
            <Text style={{ color: '#6b7280', marginBottom: '1rem' }}>
              {error}
            </Text>
            <Button 
              onClick={() => window.location.reload()}
              style={{ backgroundColor: '#1F3549', color: '#FFFFFF', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', display: 'flex', flexDirection: 'column' }}>
      <Header currentPage="listings" />
      <main style={{ flex: 1 }}>
      {/* Search and Filters Section */}
      <section style={{ padding: 'clamp(2rem, 5vw, 3rem) 1rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e3' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Heading level={1} style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#152A3D', marginBottom: '0.75rem' }}>
              Commercial Properties
            </Heading>
            <Text size="lg" style={{ color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
              Discover shops, offices, warehouses and commercial spaces across Addis Ababa
            </Text>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px', width: '100%' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search properties, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 44px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e5e3',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={filteredType}
                onChange={(e) => setFilteredType(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e5e3',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Types</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="warehouse">Warehouse</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e5e3',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f5f5f4', borderRadius: '0.5rem', padding: '4px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? '#1F3549' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : '#6b7280',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Grid style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#1F3549' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#6b7280',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <List style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <TrendingUp style={{ width: '16px', height: '16px' }} />
              <span>Showing {startIndex + 1}-{Math.min(endIndex, allFilteredListings.length)} of {allFilteredListings.length} commercial properties</span>
            </div>
            <Button variant="outline" size="sm" style={{ gap: '0.5rem', border: '1px solid #e5e5e3' }}>
              <Filter style={{ width: '16px', height: '16px' }} />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Listings Grid/List */}
      <section style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredListings.map((listing, index) => (
                <div 
                  key={listing.id} 
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    animationDelay: `${index * 0.05}s`
                  }}
                  onClick={() => handleViewDetails(listing)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {listing.featured && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          <Sparkles style={{ width: '12px', height: '12px' }} />
                          Featured
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaveListing(listing.id); }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Heart 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          color: savedListings.includes(listing.id) ? '#ef4444' : '#6b7280',
                          fill: savedListings.includes(listing.id) ? '#ef4444' : 'none'
                        }} 
                      />
                    </button>
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F3549', marginBottom: '0.25rem' }}>
                          {listing.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                          <MapPin style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                          {listing.location}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      {listing.capacity > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users style={{ width: '14px', height: '14px' }} />
                          <span>{listing.capacity} capacity</span>
                        </div>
                      )}
                      {listing.parking > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Car style={{ width: '14px', height: '14px' }} />
                          <span>{listing.parking} parking</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Square style={{ width: '14px', height: '14px' }} />
                        <span>{listing.area} m²</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e5e5e3', margin: '1rem 0' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F3549' }}>{listing.price.toLocaleString()}</span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{listing.currency}/{listing.period}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                          <Star style={{ width: '12px', height: '12px', color: '#f59e0b', marginRight: '4px' }} />
                          {listing.rating} ({listing.reviews} reviews)
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        style={{ 
                          backgroundColor: '#1F3549', 
                          color: '#FFFFFF',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                        onClick={() => handleViewDetails(listing)}
                      >
                        View Details
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredListings.map((listing) => (
                <div 
                  key={listing.id} 
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => handleViewDetails(listing)}
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* Image */}
                    <div style={{ width: '300px', height: '200px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      {listing.featured && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 12px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <Sparkles style={{ width: '12px', height: '12px' }} />
                            Featured
                          </div>
                        </div>
                      )}
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F3549', marginBottom: '0.25rem' }}>
                            {listing.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                            <MapPin style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                            {listing.location}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {listing.amenities.slice(0, 3).map((amenity, i) => (
                              <span key={i} style={{
                                padding: '4px 8px',
                                backgroundColor: '#f5f5f4',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                color: '#6b7280'
                              }}>
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F3549' }}>{listing.price.toLocaleString()}</span>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{listing.currency}/{listing.period}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                            <Star style={{ width: '12px', height: '12px', color: '#f59e0b', marginRight: '4px' }} />
                            {listing.rating} ({listing.reviews} reviews)
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e5e3' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          {listing.capacity > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Users style={{ width: '14px', height: '14px' }} />
                              <span>{listing.capacity} capacity</span>
                            </div>
                          )}
                          {listing.parking > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Car style={{ width: '14px', height: '14px' }} />
                              <span>{listing.parking} parking</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Square style={{ width: '14px', height: '14px' }} />
                            <span>{listing.area} m²</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '14px', height: '14px' }} />
                            <span>Listed {listing.listed}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          style={{ 
                            backgroundColor: '#1F3549', 
                            color: '#FFFFFF',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                          onClick={() => handleViewDetails(listing)}
                        >
                          View Details
                          <ArrowRight style={{ width: '14px', height: '14px' }} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredListings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem' }}>
              <Building style={{ width: '64px', height: '64px', color: '#6b7280', margin: '0 auto 1rem' }} />
              <Heading level={3} style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F3549', marginBottom: '0.5rem' }}>
                No commercial properties found
              </Heading>
              <Text style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Try adjusting your search or filters to find commercial spaces.
              </Text>
              <Button 
                onClick={() => { setSearchQuery(''); setFilteredType('all'); setSortBy('featured') }}
                style={{ backgroundColor: '#1F3549', color: '#FFFFFF', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {allFilteredListings.length > 0 && totalPages > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{ border: '1px solid #e5e5e3' }}
              >
                Previous
              </Button>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    style={currentPage === page ? 
                      { backgroundColor: '#1F3549', color: '#FFFFFF', minWidth: '40px', border: 'none' } : 
                      { border: '1px solid #e5e5e3', minWidth: '40px' }
                    }
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
                style={{ border: '1px solid #e5e5e3' }}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen home-theme flex items-center justify-center">
          <Loader className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  )
}

