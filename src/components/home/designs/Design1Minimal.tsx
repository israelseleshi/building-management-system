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
  Building, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Shield,
  ArrowRight,
  Calendar,
  Lock,
  MapPin,
  Users
} from "lucide-react"

const features = [
  { icon: Search, title: "Advanced Search", desc: "Find your perfect property with powerful filters" },
  { icon: MessageSquare, title: "In-App Messaging", desc: "Communicate directly with landlords securely" },
  { icon: CreditCard, title: "Online Payments", desc: "Secure rent payments and automated payouts" },
  { icon: Shield, title: "Verified Listings", desc: "All properties verified for authenticity" },
  { icon: Calendar, title: "Virtual Tours", desc: "Tour properties from your home" },
  { icon: Lock, title: "E-Signature", desc: "Sign leases digitally and securely" },
]

const stats = [
  { value: "500+", label: "Properties", icon: Building },
  { value: "10K+", label: "Users", icon: Users },
  { value: "50+", label: "Cities", icon: MapPin },
]

const steps = [
  { number: 1, title: "Search", desc: "Browse thousands of listings" },
  { number: 2, title: "Connect", desc: "Contact landlords directly" },
  { number: 3, title: "Move In", desc: "Sign and get your keys" },
]

export function Design1Minimal() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/home/listings?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7D8B6F]/10 text-[#7D8B6F] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#7D8B6F] rounded-full animate-pulse" />
              {t("home.hero.trusted")}
            </div>
            
            <Heading level={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              {t("home.hero.title")}
              <span className="block bg-gradient-to-r from-[#7D8B6F] to-[#5a6b4f] bg-clip-text text-transparent">
                {t("home.hero.titleAccent")}
              </span>
            </Heading>
            
            <Text size="lg" className="text-slate-600 max-w-2xl mx-auto mb-10">
              {t("home.hero.subtitle1")}{" "}
              <span className="font-semibold text-[#7D8B6F]">{t("home.hero.subtitle2")}</span>.{" "}
              {t("home.hero.subtitle3")}{" "}
              <span className="font-semibold text-amber-600">{t("home.hero.subtitle4")}</span>.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => router.push("/home/listings")}
                className="bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-8 py-4 rounded-xl font-medium"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("home.hero.browseButton")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/auth/signup")}
                className="border-2 border-slate-300 px-8 py-4 rounded-xl font-medium"
              >
                <Building className="w-5 h-5 mr-2" />
                {t("home.hero.listButton")}
              </Button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-2">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-slate-400 ml-3" />
                  <input
                    type="text"
                    placeholder={t("home.hero.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-0 focus:outline-none text-slate-900 placeholder-slate-400"
                  />
                  <Button 
                    type="submit"
                    className="bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-6 py-3 rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7D8B6F]/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#7D8B6F]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t("home.features.title")}
              <span className="text-[#7D8B6F]"> {t("home.features.titleAccent")}</span>
            </Heading>
            <Text size="lg" className="text-slate-600 max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </Text>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-[#7D8B6F]/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#7D8B6F]/10 flex items-center justify-center mb-4 group-hover:bg-[#7D8B6F] transition-colors">
                  <feature.icon className="w-6 h-6 text-[#7D8B6F] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heading level={2} className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </Heading>
            <Text size="lg" className="text-slate-600">
              Find your perfect place in three simple steps
            </Text>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex-1 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#7D8B6F] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#7D8B6F] to-[#5a6b4f] rounded-3xl p-12 text-white"
          >
            <Heading level={2} className="text-3xl font-bold mb-4">
              Ready to Find Your New Home?
            </Heading>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of happy tenants who found their perfect property through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/home/listings")}
                className="bg-white text-[#7D8B6F] hover:bg-white/90 px-8 py-4 rounded-xl font-medium"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-medium"
              >
                List Your Property
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
