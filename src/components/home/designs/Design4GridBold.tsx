"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
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
  Star,
  Building,
  Users,
  Award
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
  { value: "500+", label: "Properties Listed", icon: Building },
  { value: "10K+", label: "Happy Tenants", icon: Users },
  { value: "50+", label: "Cities Covered", icon: MapPin },
  { value: "99%", label: "Satisfaction Rate", icon: Award },
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

export function Design4GridBold() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [searchQuery, setSearchQuery] = useState("")
  const { scrollY } = useScroll()
  
  const yParallax1 = useTransform(scrollY, [0, 800], [0, -100])
  const yParallax2 = useTransform(scrollY, [0, 800], [0, 100])
  const yParallax3 = useTransform(scrollY, [0, 800], [0, -80])
  const rotateParallax = useTransform(scrollY, [0, 500], [0, 5])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/home/listings?q=${encodeURIComponent(searchQuery)}`)
  }

  const featuredBuildings = landlordBuildings.slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header currentPage="home" />

      {/* Hero Section - Bold Parallax */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh]">
        {/* Floating shapes with parallax */}
        <motion.div 
          style={{ y: yParallax1, rotate: rotateParallax }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#7D8B6F]/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: yParallax2 }}
          className="absolute top-1/2 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: yParallax3 }}
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7D8B6F] to-amber-500 text-white text-sm font-medium mb-6 shadow-lg shadow-[#7D8B6F]/25"
              >
                <Star className="w-4 h-4 fill-white" />
                Rated #1 Property Platform
              </motion.div>
              
              <Heading level={1} className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-[#7D8B6F] to-amber-500 bg-clip-text text-transparent">
                  Rental Property
                </span>
              </Heading>
              
              <Text size="lg" className="text-slate-600 mb-8 text-lg">
                Discover your dream home with our intelligent platform. Connect with verified landlords, take virtual tours, and sign leases digitally.
              </Text>

              <motion.form 
                onSubmit={handleSearch}
                whileHover={{ scale: 1.02 }}
                className="mb-8"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4">
                    <MapPin className="w-5 h-5 text-[#7D8B6F]" />
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
                    className="bg-gradient-to-r from-[#7D8B6F] to-[#6a7a5e] hover:from-[#6a7a5e] hover:to-[#5a6b4f] text-white px-8 py-3 rounded-xl font-medium"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </motion.form>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/home/listings")}
                  className="bg-gradient-to-r from-[#7D8B6F] to-[#5a6b4f] text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-[#7D8B6F]/25"
                >
                  Browse Properties
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </motion.button>
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {featuredBuildings.slice(0, 2).map((building, i) => (
                    <motion.div
                      key={building.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-xl"
                    >
                      <div className="h-32 bg-slate-200 relative">
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#7D8B6F] to-[#5a6b4f] text-white px-2 py-1 rounded-lg text-xs font-medium">
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
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-xl"
                    >
                      <div className="h-32 bg-slate-200 relative">
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                        {building.vacantUnits > 0 && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
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

      {/* Features - Staggered Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          style={{ y: useTransform(scrollY, [400, 900], [60, -60]) }}
          className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#7D8B6F]/20 to-amber-500/10 rounded-full blur-3xl -z-10"
        />
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </Heading>
            <Text size="lg" className="text-slate-600 max-w-2xl mx-auto">
              Powerful features to make your property search seamless
            </Text>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gradient-to-br from-[#7D8B6F] via-[#6a7a5e] to-[#5a6b4f] rounded-3xl p-10 text-white shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3">{features[0].title}</h3>
              <p className="text-white/80 mb-8 max-w-lg text-lg">
                {features[0].desc}
              </p>
              <Button className="bg-white text-[#7D8B6F] hover:bg-white/90 px-8 py-4 rounded-xl font-medium">
                Try Advanced Search <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {features.slice(1).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7D8B6F]/20 to-amber-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#7D8B6F]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Animated Counters */}
      <section className="py-20 bg-gradient-to-r from-[#7D8B6F] to-[#5a6b4f]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring" }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          style={{ y: useTransform(scrollY, [1200, 1800], [80, -80]) }}
          className="absolute top-1/2 left-0 w-96 h-96 bg-[#7D8B6F]/5 rounded-full -z-10"
        />
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </Heading>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-8 text-lg">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#7D8B6F]"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{testimonial.name}</div>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <motion.div
          style={{ scale: useTransform(scrollY, [1500, 2000], [0.8, 1.2]) }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7D8B6F]/20 rounded-full blur-[100px] -z-10"
        />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heading level={2} className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Start Your Property Journey Today
            </Heading>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Join thousands of users who have found their perfect property. Sign up now and get started for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/auth/signup")}
                className="bg-gradient-to-r from-[#7D8B6F] to-[#5a6b4f] hover:from-[#6a7a5e] hover:to-[#4a5a3e] text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-[#7D8B6F]/25"
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
