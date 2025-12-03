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
    router.push("/auth/signin")
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
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-medium">🏠 Trusted by 10,000+ tenants & landlords</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full ml-2 animate-pulse"></div>
            </div>
            
            <Heading level={1} className="text-5xl md:text-7xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-green-300">Rental Property</span>
            </Heading>
            
            <Text size="xl" className="text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover your dream home with our <span className="font-semibold text-green-300">intelligent platform</span>. 
              Connect with verified landlords, take immersive virtual tours, and sign leases digitally — 
              all in one <span className="font-semibold text-amber-300">beautiful experience</span>.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={handleBrowseListings} 
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-green-200 transition-all px-8 py-4 rounded-xl text-lg font-medium"
              >
                <span className="relative z-10 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Properties
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleGetStarted} 
                className="group border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg hover:shadow-white/30"
              >
                <span className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  List Your Property
                </span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-2">
                  <div className="flex items-center">
                    <div className="flex-1 flex items-center px-4">
                      <Search className="w-5 h-5 text-white/60 mr-3" />
                      <input
                        type="text"
                        placeholder="🔍 Search by location, property type, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-0 focus:outline-none text-white placeholder-white/60 text-lg"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-green-200 transition-all"
                    >
                      Search
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>10,000+</div>
                <Text className="text-muted-foreground font-medium">Happy Users</Text>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>5,000+</div>
                <Text className="text-muted-foreground font-medium">Properties Listed</Text>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>98%</div>
                <Text className="text-muted-foreground font-medium">Satisfaction Rate</Text>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform" style={{ color: '#7D8B6F' }}>24/7</div>
                <Text className="text-muted-foreground font-medium">Support Available</Text>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Heading level={2} className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Everything You Need for
                <span className="block" style={{ color: '#7D8B6F' }}>Property Management</span>
              </Heading>
              <Text size="xl" className="text-muted-foreground max-w-3xl mx-auto">
                From advanced search to digital contracts, we've got all the tools you need to succeed
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    Advanced Search
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
                    Find your perfect property with powerful filters and smart recommendations
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    In-App Messaging
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
                    Communicate directly with landlords and tenants through our secure messaging system
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    Online Payments
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
                    Secure online rent payments and automated payout processing for landlords
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    Verified Listings
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
                    All properties are verified by our team to ensure authenticity and quality
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    Virtual Tours
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
                    Take virtual tours of properties from the comfort of your home
                  </Text>
                </div>
              </div>

              <div 
                className="group relative bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <div className="relative p-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}>
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <Heading level={3} className="text-2xl font-bold text-foreground mb-4 group-hover:text-green-600 transition-colors">
                    E-Signature
                  </Heading>
                  <Text className="text-muted-foreground leading-relaxed">
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
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">BMS</span>
                </div>
                <span className="text-lg font-bold text-foreground">BMS</span>
              </div>
              <Text className="text-muted-foreground">
                The modern way to find, manage, and rent properties.
              </Text>
            </div>
            
            <div>
              <Heading level={4} className="font-semibold text-foreground mb-4">Product</Heading>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="/home/listings" className="text-muted-foreground hover:text-foreground">Listings</a></li>
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
