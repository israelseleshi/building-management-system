"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heading, Text, Large } from "@/components/ui/typography"
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
  Clock
} from "lucide-react"

// Mock data for commercial listings
const allListings = [
  {
    id: "1",
    title: "Prime Retail Shop in Bole",
    location: "Bole, Addis Ababa",
    price: 35000,
    currency: "ETB",
    period: "monthly",
    capacity: 15,
    parking: 8,
    area: 120,
    rating: 4.8,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
    featured: true,
    amenities: ["Air Conditioning", "Security", "Storage Room", "Display Windows"],
    type: "shop",
    listed: "2 days ago"
  },
  {
    id: "2",
    title: "Modern Office Space in Kazanchis",
    location: "Kazanchis, Addis Ababa",
    price: 45000,
    currency: "ETB",
    period: "monthly",
    capacity: 25,
    parking: 12,
    area: 200,
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    featured: true,
    amenities: ["Meeting Rooms", "High-Speed Internet", "Parking", "Kitchen"],
    type: "office",
    listed: "1 week ago"
  },
  {
    id: "3",
    title: "Small Cafe Space Near Mexico Square",
    location: "Mexico Square, Addis Ababa",
    price: 18000,
    currency: "ETB",
    period: "monthly",
    capacity: 10,
    parking: 4,
    area: 60,
    rating: 4.6,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
    featured: false,
    amenities: ["Kitchen Setup", "Outdoor Seating", "Storage"],
    type: "shop",
    listed: "3 days ago"
  },
  {
    id: "4",
    title: "Co-working Space in Bole Medhanealem",
    location: "Bole Medhanealem, Addis Ababa",
    price: 25000,
    currency: "ETB",
    period: "monthly",
    capacity: 40,
    parking: 20,
    area: 300,
    rating: 4.7,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
    featured: true,
    amenities: ["Hot Desks", "Private Offices", "Conference Room", "Lounge"],
    type: "office",
    listed: "5 days ago"
  },
  {
    id: "5",
    title: "Warehouse in Sar Bet",
    location: "Sar Bet, Addis Ababa",
    price: 55000,
    currency: "ETB",
    period: "monthly",
    capacity: 0,
    parking: 15,
    area: 500,
    rating: 4.5,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1553531088-df340cf313ce?w=400&h=250&fit=crop",
    featured: false,
    amenities: ["Loading Dock", "Security", "High Ceiling", "Parking"],
    type: "warehouse",
    listed: "1 day ago"
  },
  {
    id: "6",
    title: "Restaurant Space in Piassa",
    location: "Piassa, Addis Ababa",
    price: 40000,
    currency: "ETB",
    period: "monthly",
    capacity: 50,
    parking: 10,
    area: 180,
    rating: 4.4,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
    featured: false,
    amenities: ["Kitchen", "Dining Area", "Storage", "Restrooms"],
    type: "restaurant",
    listed: "4 days ago"
  },
  {
    id: "7",
    title: "Boutique Shop in Mekane Yesus",
    location: "Mekane Yesus, Addis Ababa",
    price: 22000,
    currency: "ETB",
    period: "monthly",
    capacity: 8,
    parking: 6,
    area: 45,
    rating: 4.6,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
    featured: false,
    amenities: ["Display Lighting", "Storage", "Security"],
    type: "shop",
    listed: "6 days ago"
  },
  {
    id: "8",
    title: "Large Warehouse in Akaki",
    location: "Akaki, Addis Ababa",
    price: 75000,
    currency: "ETB",
    period: "monthly",
    capacity: 0,
    parking: 30,
    area: 1000,
    rating: 4.3,
    reviews: 8,
    image: "https://images.unsplash.com/photo-1553531088-df340cf313ce?w=400&h=250&fit=crop",
    featured: true,
    amenities: ["Loading Bay", "Office Space", "Security", "Heavy-Duty Floors"],
    type: "warehouse",
    listed: "2 weeks ago"
  }
]

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredType, setFilteredType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [savedListings, setSavedListings] = useState<string[]>([])

  // Filter and sort listings
  const filteredListings = allListings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filteredType === 'all' || listing.type === filteredType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

  const toggleSaveListing = (listingId: string) => {
    setSavedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const handleGetStarted = () => {
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">BMS</span>
                </div>
                <span className="text-xl font-bold text-foreground">Building Management System</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/home" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="/home/listings" className="text-primary font-medium">Listings</a>
              <Button variant="ghost" onClick={handleGetStarted}>Sign In</Button>
              <Button 
                style={{ 
                  backgroundColor: '#7D8B6F', 
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                }}
                className="hover:opacity-90 transition-opacity"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Heading level={1} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Commercial Properties
            </Heading>
            <Text size="lg" className="text-muted-foreground max-w-2xl mx-auto">
              Discover shops, offices, warehouses and commercial spaces across Addis Ababa
            </Text>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search commercial properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 text-base transition-all duration-200 focus:scale-[1.02] placeholder-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Type Filter */}
              <select 
                value={filteredType}
                onChange={(e) => setFilteredType(e.target.value)}
                className="px-4 py-3 h-12 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:scale-[1.02]"
              >
                <option value="all">All Types</option>
                <option value="shop">Shops & Retail</option>
                <option value="office">Office Spaces</option>
                <option value="warehouse">Warehouses</option>
                <option value="restaurant">Restaurants</option>
              </select>

              {/* Sort */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 h-12 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:scale-[1.02]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none h-12 px-4 transition-all duration-200"
                  style={viewMode === 'grid' ? { backgroundColor: '#7D8B6F', color: '#FFFFFF' } : {}}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none h-12 px-4 transition-all duration-200"
                  style={viewMode === 'list' ? { backgroundColor: '#7D8B6F', color: '#FFFFFF' } : {}}
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
                Showing {filteredListings.length} of {allListings.length} commercial properties
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
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
                  style={{ 
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                    animationDelay: `${index * 100}ms`
                  }}
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
                      <Button size="sm" className="gap-2 transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
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
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
                  style={{ 
                    boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)',
                    animationDelay: `${index * 100}ms`
                  }}
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
