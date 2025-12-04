"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { 
  Building, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Shield, 
  ArrowRight, 
  Calendar,
  Lock,
  ChevronDown
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleGetStarted = () => {
    router.push("/auth/signup")
  }

  const handleBrowseListings = () => {
    router.push("/home/listings")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/home/listings?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">BMS</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">BMS</span>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Features</a>
                <a href="/home/listings" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Listings</a>
                <Button variant="ghost" onClick={() => router.push("/auth/signin")} className="text-sm font-medium">Sign In</Button>
                <Button 
                  style={{ 
                    backgroundColor: '#7D8B6F', 
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                  }}
                  className="hover:opacity-90 transition-opacity text-sm font-medium px-4 py-2"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>

              <div className="md:hidden">
                <Button variant="ghost" size="sm">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with Background */}
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          {/* Background Image - Hero Only */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'url("/ethiopian-building.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-medium text-xs sm:text-sm">🏠 Trusted by 10,000+ tenants & landlords</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full ml-2 animate-pulse"></div>
            </div>
            
            <Heading level={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
              Find Your Perfect
              <span className="block text-green-300">Rental Property</span>
            </Heading>
            
            <Text size="lg" className="text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base">
              Discover your dream home with our <span className="font-semibold text-green-300">intelligent platform</span>. 
              Connect with verified landlords, take immersive virtual tours, and sign leases digitally — 
              all in one <span className="font-semibold text-amber-300">beautiful experience</span>.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center mb-8 sm:mb-16">
              <Button 
                onClick={handleBrowseListings} 
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-green-200 transition-all px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Search className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGetStarted} 
                className="group border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium transition-all shadow-lg hover:shadow-white/30 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <Building className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  List Your Property
                </span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-0 sm:px-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 flex items-center px-3 sm:px-4">
                      <Search className="w-4 sm:w-5 h-4 sm:h-5 text-white/60 mr-2 sm:mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search by location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-0 focus:outline-none text-white placeholder-white/60 text-sm sm:text-base"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium shadow-lg hover:shadow-green-200 transition-all text-sm sm:text-base w-full sm:w-auto"
                    >
                      <span className="flex items-center justify-center">
                        Search
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <div className="group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>10,000+</div>
                <Text className="text-muted-foreground font-medium text-xs sm:text-sm">Happy Users</Text>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>5,000+</div>
                <Text className="text-muted-foreground font-medium text-xs sm:text-sm">Properties Listed</Text>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>98%</div>
                <Text className="text-muted-foreground font-medium text-xs sm:text-sm">Satisfaction Rate</Text>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>24/7</div>
                <Text className="text-muted-foreground font-medium text-xs sm:text-sm">Support Available</Text>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Everything You Need for
                <span className="block" style={{ color: '#7D8B6F' }}>Property Management</span>
              </Heading>
              <Text size="lg" className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
                From advanced search to digital contracts, we've got all the tools you need to succeed
              </Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Search className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    Advanced Search
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Find your perfect property with powerful filters and smart recommendations
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    In-App Messaging
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Communicate directly with landlords and tenants through our secure messaging system
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    Online Payments
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Secure online rent payments and automated payout processing for landlords
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    Verified Listings
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    All properties are verified by our team to ensure authenticity and quality
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    Virtual Tours
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Take virtual tours of properties from the comfort of your home
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-xl sm:rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Lock className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">
                    E-Signature
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Digitally sign lease agreements and contracts securely online
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Removed */}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs sm:text-sm">BMS</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-foreground">BMS</span>
              </div>
              <Text className="text-muted-foreground text-sm">
                The modern way to find, manage, and rent properties.
              </Text>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Product</Heading>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground text-sm">Features</a></li>
                <li><a href="/home/listings" className="text-muted-foreground hover:text-foreground text-sm">Listings</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Security</a></li>
              </ul>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</Heading>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</Heading>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <Text className="text-muted-foreground text-xs sm:text-sm">
              © 2025 Building Management System. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  )
}
