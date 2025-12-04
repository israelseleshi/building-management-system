"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Heading, Text, Large, MutedText } from "@/components/ui/typography"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  MapPin,
  Users,
  Car,
  Square,
  Star,
  Heart,
  Phone,
  Mail,
  Home,
  ArrowLeft,
  Sparkles,
  CheckCircle
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
  type: string
  listed: string
  amenities?: string[]
}

interface ListingDetailViewProps {
  listing: Listing
  onBack: () => void
  isSaved: boolean
  onToggleSave: () => void
}

export function ListingDetailView({
  listing,
  onBack,
  isSaved,
  onToggleSave
}: ListingDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Listings", onClick: onBack },
          { label: listing.title, active: true }
        ]}
      />

      {/* Back Button - Ghost Variant with Icon */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Button>

      {/* Main Content - Image Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Image */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-0 sticky top-6" style={{ boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' }}>
            <div className="relative h-80 overflow-hidden">
              {listing.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </Badge>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200"
                onClick={onToggleSave}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${isSaved ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                />
              </Button>
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </div>

        {/* Right Side - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Basic Info */}
          <div className="space-y-4">
            <div>
              <Heading level={1} className="text-3xl font-bold text-foreground mb-3">
                {listing.title}
              </Heading>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <Text className="text-base">{listing.location}</Text>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm">
                  <CheckCircle className="w-3 h-3 mr-1" /> Available
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {listing.type}
                </Badge>
                <MutedText className="text-sm">{listing.listed}</MutedText>
              </div>
            </div>

            {/* Price Section */}
            <Card className="border-0 p-6" style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}>
              <div className="flex items-baseline justify-between">
                <div>
                  <MutedText className="text-sm mb-2">Price</MutedText>
                  <div className="flex items-baseline">
                    <Large className="text-4xl font-bold text-primary">{listing.price.toLocaleString()}</Large>
                    <Text size="sm" className="text-muted-foreground ml-2">
                      {listing.currency}/{listing.period}
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">{listing.rating}</span>
                    <span className="text-sm text-muted-foreground">({listing.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {listing.capacity > 0 && (
                <Card className="border-0 p-6 text-center" style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}>
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <MutedText className="text-xs mb-1">Capacity</MutedText>
                  <Heading level={3} className="text-2xl font-bold text-foreground">
                    {listing.capacity}
                  </Heading>
                  <Text size="sm" className="text-muted-foreground mt-1">People</Text>
                </Card>
              )}

              {listing.parking > 0 && (
                <Card className="border-0 p-6 text-center" style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}>
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <MutedText className="text-xs mb-1">Parking</MutedText>
                  <Heading level={3} className="text-2xl font-bold text-foreground">
                    {listing.parking}
                  </Heading>
                  <Text size="sm" className="text-muted-foreground mt-1">Spaces</Text>
                </Card>
              )}

              <Card className="border-0 p-6 text-center" style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                    <Square className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <MutedText className="text-xs mb-1">Area</MutedText>
                <Heading level={3} className="text-2xl font-bold text-foreground">
                  {listing.area}
                </Heading>
                <Text size="sm" className="text-muted-foreground mt-1">m²</Text>
              </Card>

              <Card className="border-0 p-6 text-center" style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7D8B6F20' }}>
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <MutedText className="text-xs mb-1">Type</MutedText>
                <Heading level={3} className="text-lg font-bold text-foreground capitalize">
                  {listing.type}
                </Heading>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section - Bento Grid */}
      {listing.amenities && listing.amenities.length > 0 && (
        <div className="space-y-4">
          <Heading level={2} className="text-2xl font-bold text-foreground">
            Amenities & Features
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {listing.amenities.map((amenity, index) => (
              <Card 
                key={index} 
                className="border-0 p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#7D8B6F20' }}>
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <Text className="font-semibold text-sm text-foreground">{amenity}</Text>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* About Section - Bento Grid */}
      <div className="space-y-4">
        <Heading level={2} className="text-2xl font-bold text-foreground">
          About This Property
        </Heading>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card 
            className="border-0 p-8 lg:col-span-2"
            style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}
          >
            <Text className="text-muted-foreground mb-4 leading-relaxed">
              This is a premium {listing.type} property located in {listing.location}. 
              {listing.capacity > 0 && ` Perfect for ${listing.capacity} people with ${listing.parking} parking space${listing.parking !== 1 ? 's' : ''}`}
              and {listing.area} square meters of space.
            </Text>
            <Text className="text-muted-foreground leading-relaxed">
              The property features modern amenities, excellent natural lighting, and is well-maintained. 
              Highly rated by previous tenants with an average rating of {listing.rating} stars.
            </Text>
          </Card>
        </div>
      </div>

      {/* Contact Section - Bento Grid */}
      <div className="space-y-4">
        <Heading level={2} className="text-2xl font-bold text-foreground">
          Contact Owner
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="border-0 p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
            style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}
          >
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#7D8B6F20' }}>
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <MutedText className="text-sm mb-2">Phone</MutedText>
            <Text className="font-semibold text-foreground">+251 911 234 567</Text>
          </Card>
          <Card 
            className="border-0 p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
            style={{ backgroundColor: 'var(--card)', boxShadow: '0 4px 12px rgba(107, 90, 70, 0.15)' }}
          >
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#7D8B6F20' }}>
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <MutedText className="text-sm mb-2">Email</MutedText>
            <Text className="font-semibold text-foreground">owner@example.com</Text>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back to Listings
        </Button>
        <Button
          className="flex-1 gap-2"
          style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
        >
          <Mail className="w-4 h-4" />
          Contact Owner
        </Button>
      </div>
    </div>
  )
}
