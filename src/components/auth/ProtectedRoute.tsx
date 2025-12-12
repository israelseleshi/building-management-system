"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

// Helper function to get cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isRoleAllowed = (role: string | null, required: string) => {
    if (!role) return false
    if (role === required) return true
    // Alias support: DB uses 'owner' but app sometimes stores 'landlord'
    if (required === "owner" && role === "landlord") return true
    if (required === "landlord" && role === "owner") return true
    return false
  }

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Check both localStorage and cookies
      const localStorageAuth = localStorage.getItem("isAuthenticated")
      const cookieAuth = getCookie("isAuthenticated")
      const localStorageRole = localStorage.getItem("userRole")
      const cookieRole = getCookie("userRole")

      const authStatus = localStorageAuth === "true" || cookieAuth === "true"
      const role = localStorageRole || cookieRole

      if (authStatus) {
        setIsAuthenticated(true)

        // Check if specific role is required
        if (requiredRole && !isRoleAllowed(role, requiredRole)) {
          // Redirect to unauthorized page or dashboard
          router.push("/auth/unauthorized")
          return
        }
      } else {
        // Not authenticated, redirect to sign-in
        router.push("/auth/signin")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // This will redirect in the useEffect, but return null to prevent flash
    return null
  }

  return <>{children}</>
}
