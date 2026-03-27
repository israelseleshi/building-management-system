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
  Building,
  Search, 
  MessageSquare, 
  CreditCard, 
  Shield,
  ArrowRight,
  Calendar,
  Lock,
  MapPin,
  ChevronDown,
  Sparkles,
  Key
} from "lucide-react"

const features = [
  { 
    icon: Search, 
    title: "Advanced Search", 
    desc: "AI-powered search with smart recommendations",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    icon: MessageSquare, 
    title: "In-App Messaging", 
    desc: "Real-time communication with landlords",
    color: "from-purple-500 to-pink-500"
  },
  { 
    icon: CreditCard, 
    title: "Online Payments", 
    desc: "Secure transactions & automated payouts",
    color: "from-green-500 to-emerald-500"
  },
  { 
    icon: Shield, 
    title: "Verified Listings", 
    desc: "Every property professionally verified",
    color: "from-amber-500 to-orange-500"
  },
  { 
    icon: Calendar, 
    title: "Virtual Tours", 
    desc: "Immersive 3D tours from anywhere",
    color: "from-rose-500 to-red-500"
  },
  { 
    icon: Lock, 
    title: "E-Signature", 
    desc: "Legally binding digital contracts",
    color: "from-indigo-500 to-violet-500"
  },
]

export function Design3Immersive() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [searchQuery, setSearchQuery] = useState("")
  const { scrollY } = useScroll()
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/home/listings?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <Header currentPage="home" />

      {/* Hero Section - Full Viewport */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-[#1F3549]/20" />
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#1F3549]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Floating Elements */}
        <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-64 h-64 border border-[#1F3549]/20 rounded-3xl rotate-12" />
        <motion.div style={{ y: y2 }} className="absolute bottom-20 right-10 w-48 h-48 border border-blue-500/20 rounded-3xl -rotate-12" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F3549]/20 border border-[#1F3549]/30 text-[#1F3549] text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {t("home.hero.trusted")}
            </motion.div>
            
            <Heading level={1} className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-[#1F3549] via-green-400 to-[#1F3549] bg-clip-text text-transparent">
                Rental Property
              </span>
            </Heading>
            
            <Text size="lg" className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
              Discover your dream home with our intelligent platform. Connect with verified landlords, take immersive virtual tours, and sign leases digitally.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => router.push("/home/listings")}
                className="bg-gradient-to-r from-[#1F3549] to-[#5a6b4f] hover:from-[#6a7a5e] hover:to-[#4a5a3e] text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-[#1F3549]/25"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("home.hero.browseButton")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/auth/signup")}
                className="border-2 border-slate-700 text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-medium"
              >
                <Building className="w-5 h-5 mr-2" />
                {t("home.hero.listButton")}
              </Button>
            </div>

            {/* Glassmorphism Search Bar */}
            <motion.form 
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1F3549]/20 to-blue-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        placeholder={t("home.hero.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-0 focus:outline-none text-white placeholder-slate-500"
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-[#1F3549] to-[#5a6b4f] text-white px-6 py-3 rounded-xl"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-slate-500"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Staggered */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Heading level={2} className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Powerful Features
            </Heading>
            <Text size="lg" className="text-slate-400 max-w-2xl mx-auto">
              Everything you need for a seamless property experience
            </Text>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`} />
                <div className="relative bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-8 h-full group-hover:border-slate-700 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Animated Timeline */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Heading level={2} className="text-4xl font-bold text-white mb-6">
              How It Works
            </Heading>
          </motion.div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1F3549] via-[#1F3549]/50 to-transparent hidden md:block" />

            {[
              { icon: Search, title: "Search", desc: "Browse thousands of verified properties", color: "from-blue-500 to-cyan-500" },
              { icon: MessageSquare, title: "Connect", desc: "Contact landlords and schedule tours", color: "from-purple-500 to-pink-500" },
              { icon: Key, title: "Move In", desc: "Sign digitally and get your keys", color: "from-green-500 to-emerald-500" },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center gap-8 mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 ${index % 2 === 1 ? 'text-left md:text-right' : 'text-right'}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto md:mx-0 ${index % 2 === 1 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#1F3549] border-4 border-slate-900 hidden md:block" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Glowing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F3549]/10 via-transparent to-blue-500/10" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "500+", label: "Properties" },
              { value: "10K+", label: "Users" },
              { value: "50+", label: "Cities" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#1F3549] to-green-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Glowing Gradient */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F3549]/20 via-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1F3549]/30 rounded-full blur-[120px]" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heading level={2} className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Find Your New Home?
            </Heading>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Join thousands of happy tenants who found their perfect property. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/home/listings")}
                className="bg-gradient-to-r from-[#1F3549] to-[#5a6b4f] hover:from-[#6a7a5e] hover:to-[#4a5a3e] text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-[#1F3549]/25"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                variant="outline"
                className="border-2 border-slate-700 text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-medium"
              >
                Sign Up Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

