"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { LanguageToggle } from "./LanguageToggle"
import { Menu, X, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"

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
    { label: t("nav.services"), href: '/home/services', page: 'services' },
    { label: t("nav.listings"), href: '/home/listings', page: 'listings' },
    { label: t("nav.about"), href: '/home/about', page: 'about' },
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
    <header
      className={cn(
        "sticky top-5 z-50 mx-auto w-full max-w-6xl rounded-2xl border shadow-lg transition-all duration-500",
        hasScrolled
          ? "bg-white/70 supports-[backdrop-filter]:bg-white/60 backdrop-blur-2xl border-white/50 shadow-2xl"
          : "bg-white/50 supports-[backdrop-filter]:bg-white/30 backdrop-blur-xl border-white/30 shadow-md"
      )}
      style={{
        background: hasScrolled
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hasScrolled
          ? '0 8px 32px rgba(31, 53, 73, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          : '0 4px 16px rgba(31, 53, 73, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
      }}
    >
      <nav className="mx-auto flex items-center justify-between p-1.5">
        {/* Logo - Left Side */}
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick}
            className="hover:bg-[#1F3549]/10 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Landmark className="size-6 text-[#1F3549]" />
            <span className="text-base font-bold tracking-tight text-[#1F3549]">BMS</span>
          </button>
        </div>

        {/* Navigation Links - Center (Desktop) */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? 'text-[#1F3549]'
                    : 'text-muted-foreground hover:text-[#1F3549]'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#1F3549]" />
                )}
              </a>
            )
          })}
        </div>

        {/* Action Buttons - Right Side (Desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <Button 
            variant="ghost" 
            onClick={handleSignIn}
            size="sm"
            className="text-sm font-medium text-[#1F3549] hover:bg-[#1F3549]/10"
          >
            {t("auth.signIn")}
          </Button>
          <Button 
            onClick={handleRegisterAsOwner}
            size="sm"
            style={{ 
              backgroundColor: '#1F3549', 
              color: '#FFFFFF',
            }}
            className="hover:opacity-90 transition-opacity text-sm font-medium"
          >
            {t("auth.registerOwner")}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden"
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent 
          className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg w-[300px] sm:w-[350px]"
          showClose={false}
          side="left"
        >
          <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Landmark className="size-6 text-[#1F3549]" />
            <span className="text-base font-bold tracking-tight text-[#1F3549]">BMS</span>
          </button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        
        <div className="grid gap-y-2 overflow-y-auto px-4 py-6">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "justify-start px-4 py-3 rounded-lg text-base font-semibold transition-all",
                  isActive
                    ? "bg-[#1F3549]/10 text-[#1F3549]"
                    : "text-muted-foreground hover:bg-[#1F3549]/10 hover:text-[#1F3549]"
                )}
              >
                {link.label}
              </a>
            )
          })}
        </div>
        
        <div className="p-4 border-t space-y-3">
          <Button 
            variant="outline" 
            onClick={() => {
              handleSignIn()
              setIsMobileMenuOpen(false)
            }}
            className="w-full border-[#1F3549] text-[#1F3549] hover:bg-[#1F3549] hover:text-white"
          >
            {t("auth.signIn")}
          </Button>
          <Button 
            onClick={() => {
              handleRegisterAsOwner()
              setIsMobileMenuOpen(false)
            }}
            style={{ 
              backgroundColor: '#1F3549', 
              color: '#FFFFFF'
            }}
            className="w-full"
          >
            {t("auth.registerOwner")}
          </Button>
        </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}