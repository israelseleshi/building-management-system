"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { LanguageToggle } from "./LanguageToggle"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type PageKey = 'home' | 'listings' | 'about' | 'services' | 'contact'

interface HeaderProps {
  currentPage?: PageKey
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: t("nav.home"), href: '/home', page: 'home' },
    { label: t("nav.listings"), href: '/home/listings', page: 'listings' },
    { label: t("nav.about"), href: '/home/about', page: 'about' },
    { label: t("nav.services"), href: '/home/services', page: 'services' },
    { label: t("nav.contact"), href: '/home/contact', page: 'contact' },
  ]

  const handleLogoClick = () => {
    router.push("/home")
  }

  const handleSignIn = () => {
    router.push("/auth/signin")
  }

  const handleRegisterAsOwner = () => {
    router.push("/home/register")
  }

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        hasScrolled
          ? "bg-card shadow-xl border-border"
          : "bg-card/60 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BMS</span>
              </div>
            </button>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-semibold transition-all duration-200 border-b-2 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:border-primary/60'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary transition-all duration-250 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-70 group-hover:scale-100'
                    }`}
                  />
                </a>
              )
            })}
          </div>

          {/* Action Buttons - Right Side (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <Button 
              variant="ghost" 
              onClick={handleSignIn}
              className="px-4 py-2 text-sm font-medium"
            >
              {t("auth.signIn")}
            </Button>
            <Button 
              onClick={handleRegisterAsOwner}
              style={{ 
                backgroundColor: '#7D8B6F', 
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
              }}
              className="hover:opacity-90 transition-opacity text-sm font-medium px-4 py-2"
            >
              {t("auth.registerOwner")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-card border-l border-border shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">BMS</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = currentPage === link.page
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        {link.label}
                      </a>
                    )
                  })}
                </div>

                <div className="pt-6 border-t border-border flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleSignIn()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full h-12 rounded-xl text-base font-medium"
                  >
                    {t("auth.signIn")}
                  </Button>
                  <Button 
                    onClick={() => {
                      handleRegisterAsOwner()
                      setIsMobileMenuOpen(false)
                    }}
                    style={{ 
                      backgroundColor: '#7D8B6F', 
                      color: '#FFFFFF'
                    }}
                    className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-[#7D8B6F]/20"
                  >
                    {t("auth.registerOwner")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
