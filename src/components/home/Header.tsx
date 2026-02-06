"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type PageKey = 'home' | 'listings' | 'about' | 'services' | 'contact'

const NAV_LINKS: { label: string; href: string; page: PageKey }[] = [
  { label: 'Home', href: '/home', page: 'home' },
  { label: 'Listings', href: '/home/listings', page: 'listings' },
  { label: 'About Us', href: '/home/about', page: 'about' },
  { label: 'Services', href: '/home/services', page: 'services' },
  { label: 'Contact Us', href: '/home/contact', page: 'contact' },
]

interface HeaderProps {
  currentPage?: PageKey
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const router = useRouter()
  const [hasScrolled, setHasScrolled] = useState(false)

  const handleLogoClick = () => {
    router.push("/home")
  }

  const handleGetStarted = () => {
    router.push("/auth/signin")
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

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
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

          {/* Action Buttons - Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={handleSignIn}
              className="px-4 py-2 text-sm font-medium"
            >
              Sign In
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
              Register as Owner
            </Button>
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
        </div>
      </div>
    </nav>
  )
}
