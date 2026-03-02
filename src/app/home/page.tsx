"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Header } from "@/components/home/Header"
import { TopBannerSlider } from "@/components/ads/TopBannerSlider"
import { VerticalAdSlider } from "@/components/ads/VerticalAdSlider"
import { leftAds, rightAds } from "@/data/verticalAds"
import { HeroVideo } from "@/components/HeroVideo"
import { FeatureCard } from "@/components/FeatureCard"
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
  Lock
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const t = useTranslations("Tenant")
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
      <TopBannerSlider />
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header currentPage="home" />

        {/* Hero Section with Background Video */}
        <section className="relative flex items-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh] md:min-h-[80vh]">
          {/* Background video + poster */}
          <HeroVideo
            youtubeUrl="https://youtu.be/DPKlFPs4zII?si=P30TVCGlv-dTo-Vt"
            posterSrc="/ethiopian-building.jpg"
            loopStart={12}
            loopEnd={22}
          />

          {/* Gradient overlay for contrast (slightly lighter to let video show through) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-0" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-medium text-xs sm:text-sm">{t("home.hero.trusted")}</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full ml-2 animate-pulse"></div>
            </div>
            
            <Heading level={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 px-4">
              {t("home.hero.title")}
              <span className="block text-green-300">{t("home.hero.titleAccent")}</span>
            </Heading>
            
            <Text size="lg" className="text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base px-6">
              {t("home.hero.subtitle1")} <span className="font-semibold text-green-300">{t("home.hero.subtitle2")}</span>. 
              {t("home.hero.subtitle3")} <span className="font-semibold text-amber-300">{t("home.hero.subtitle4")}</span>.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-16 px-8">
              <Button 
                onClick={handleBrowseListings} 
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-green-200 transition-all px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Search className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  {t("home.hero.browseButton")}
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
                  {t("home.hero.listButton")}
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
                        placeholder={t("home.hero.searchPlaceholder")}
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
                        {t("home.hero.searchPlaceholder").split("...")[0]}
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                {t("home.features.title")}
                <span className="block" style={{ color: '#7D8B6F' }}>{t("home.features.titleAccent")}</span>
              </Heading>
              <Text size="lg" className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
                {t("home.features.subtitle")}
              </Text>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_220px] gap-6 lg:gap-8 items-start">
              {/* Left Vertical Ads - Hidden on mobile, shown on desktop only */}
              <div className="hidden lg:block">
                <VerticalAdSlider ads={leftAds} position="left" />
              </div>

              {/* Main feature cards */}
              <div className="px-4 sm:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {[
                    {
                      icon: <Search className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.advancedSearch.title"),
                      desc: t("home.features.advancedSearch.desc"),
                    },
                    {
                      icon: <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.messaging.title"),
                      desc: t("home.features.messaging.desc"),
                    },
                    {
                      icon: <CreditCard className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.payments.title"),
                      desc: t("home.features.payments.desc"),
                    },
                    {
                      icon: <Shield className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.verified.title"),
                      desc: t("home.features.verified.desc"),
                    },
                    {
                      icon: <Calendar className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.virtualTours.title"),
                      desc: t("home.features.virtualTours.desc"),
                    },
                    {
                      icon: <Lock className="w-6 sm:w-8 h-6 sm:h-8" />, 
                      title: t("home.features.eSignature.title"),
                      desc: t("home.features.eSignature.desc"),
                    },
                  ].map((feature, index) => (
                    <FeatureCard
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      desc={feature.desc}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Right Vertical Ads - desktop only, start at cards */}
              <div className="hidden lg:block">
                <VerticalAdSlider ads={rightAds} position="right" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Removed */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
