import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/dashboard/listings', '/dashboard/create', '/dashboard/payouts', '/dashboard/analytics', '/dashboard/boost', '/dashboard/settings']
  
  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ['/auth/signin', '/auth/signup']

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Get authentication status from cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  const userRole = request.cookies.get('userRole')?.value || ""

  // Redirect unauthenticated users from protected routes to sign-in
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users from auth routes to their dashboard
  if (isAuthRoute && isAuthenticated) {
    if (userRole.toLowerCase() === "tenant") {
      const tenantUrl = new URL('/tenant-dashboard', request.url)
      return NextResponse.redirect(tenantUrl)
    }
    if (userRole) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // If role is missing, allow auth route to render so user can re-auth
  }

  // Role-based protection (example: only landlords can access certain routes)
  if (pathname.startsWith('/dashboard') && isAuthenticated) {
    // You can add role-specific logic here
    // For now, we'll allow all authenticated users to access dashboard routes
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
