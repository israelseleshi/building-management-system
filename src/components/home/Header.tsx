"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  currentPage?: 'home' | 'listings'
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const router = useRouter()

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

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
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

          {/* Navigation Links - Right Side */}
          <div className="hidden md:flex items-center gap-0">
            <a 
              href="/home" 
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Home
            </a>
            <a 
              href="/home/listings" 
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 'listings' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Listings
            </a>
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
              className="hover:opacity-90 transition-opacity text-sm font-medium px-4 py-2 ml-2"
            >
              Register as Owner
            </Button>
            <Button 
              style={{ 
                backgroundColor: '#7D8B6F', 
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
              }}
              className="hover:opacity-90 transition-opacity text-sm font-medium px-4 py-2 ml-2"
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
