"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { useTranslations } from "next-intl"
import { 
  Search, 
  MessageSquare, 
  CreditCard, 
  Shield,
  ArrowRight,
  Calendar,
  Lock,
  MapPin,
  Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { landlordBuildings } from "@/data/buildings"

const features = [
  { icon: Search, title: "Advanced Search", desc: "Find your perfect property with powerful filters and smart recommendations", size: "large" },
  { icon: MessageSquare, title: "In-App Messaging", desc: "Communicate directly with landlords", size: "small" },
  { icon: CreditCard, title: "Online Payments", desc: "Secure payments & automated payouts", size: "small" },
  { icon: Shield, title: "Verified Listings", desc: "All properties verified for authenticity", size: "small" },
  { icon: Calendar, title: "Virtual Tours", desc: "Tour properties from home", size: "small" },
  { icon: Lock, title: "E-Signature", desc: "Sign leases digitally", size: "small" },
]

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "10K+", label: "Happy Tenants" },
  { value: "50+", label: "Cities Covered" },
  { value: "99%", label: "Satisfaction Rate" },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tenant",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "Found my dream apartment within a week! The virtual tours saved me so much time.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Landlord",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "Managing my properties has never been easier. The platform handles everything smoothly.",
    rating: 5
  },
  {
    name: "Emebet Wolde",
    role: "Tenant",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote: "The verification process gave me peace of mind. Highly recommend!",
    rating: 5
  },
]

export function Design2Grid() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/home/listings?q=${encodeURIComponent(searchQuery)}`)
  }

  const featuredBuildings = landlordBuildings.slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPage="home" />

      {/* Hero Section - Split Layout */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/[0.5] -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-current" />
                Rated #1 Property Platform
              </div>
              
              <Heading level={1} className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-[#7D8B6F]">Rental Property</span>
              </Heading>
              
              <Text size="lg" className="text-slate-600 mb-8">
                Discover your dream home with our intelligent platform. Connect with verified landlords, take virtual tours, and sign leases digitally.
              </Text>

              {/* Search Bar in Hero */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t("home.hero.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-0 focus:outline-none text-slate-900 placeholder-slate-400 py-3"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-8 py-3 rounded-xl font-medium"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </form>

              <div className="flex gap-4">
                <Button 
                  onClick={() => router.push("/home/listings")}
                  className="bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-6 py-3 rounded-xl font-medium"
                >
                  Browse Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/auth/signup")}
                  className="border-2 border-slate-300 px-6 py-3 rounded-xl font-medium"
                >
                  List Property
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {featuredBuildings.slice(0, 2).map((building, i) => (
                    <motion.div
                      key={building.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg"
                    >
                      <div className="h-32 bg-slate-200 relative">
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-medium text-[#7D8B6F]">
                          {building.type}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-slate-900 text-sm">{building.businessName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {building.location}
                        </div>
                        <div className="text-sm font-bold text-[#7D8B6F] mt-1">${building.avgRentPerUnit}/mo</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-4 pt-8">
                  {featuredBuildings.slice(2, 4).map((building, i) => (
                    <motion.div
                      key={building.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg"
                    >
                      <div className="h-32 bg-slate-200 relative">
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                        {building.vacantUnits > 0 && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            Available
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-slate-900 text-sm">{building.businessName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {building.location}
                        </div>
                        <div className="text-sm font-bold text-[#7D8B6F] mt-1">${building.avgRentPerUnit}/mo</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </Heading>
            <Text size="lg" className="text-slate-600">
              Powerful features to make your property search seamless
            </Text>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Large Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gradient-to-br from-[#7D8B6F] to-[#5a6b4f] rounded-3xl p-8 text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{features[0].title}</h3>
              <p className="text-white/80 mb-6 max-w-md">
                {features[0].desc}
              </p>
              <Button className="bg-white text-[#7D8B6F] hover:bg-white/90">
                Try Advanced Search <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Small Cards */}
            {features.slice(1).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#7D8B6F]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#7D8B6F]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#7D8B6F]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </Heading>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Heading level={2} className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Start Your Property Journey Today
            </Heading>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of users who have found their perfect property. Sign up now and get started for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/signup")}
                className="bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-8 py-4 rounded-xl font-medium"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-slate-600 text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-medium"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
