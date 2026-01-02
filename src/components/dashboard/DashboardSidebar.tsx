"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { usePathname } from "next/navigation"
import { getLandlordNavItems, getTenantNavItems } from "@/constants/navItems"

interface NavItem {
  icon: React.ReactNode
  name: string
  path: string
  active: boolean
}

interface DashboardSidebarProps {
  /**
   * Existing navItems prop is ignored; sidebar now generates a complete list
   * internally based on current pathname and user role (landlord vs tenant).
   * Keeping it optional avoids breaking existing callers while ensuring
   * consistent navigation everywhere.
   */
  navItems?: NavItem[]
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  onLogout: () => void
  onNavigate?: (isCurrentlyCollapsed: boolean) => void
}


export function DashboardSidebar({
  navItems: _ignoredNavItems,
  isSidebarCollapsed,
  onToggleSidebar,
  onLogout,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const generatedNavItems = pathname.startsWith("/tenant-dashboard")
    ? getTenantNavItems(pathname)
    : getLandlordNavItems(pathname)
  // Always use generated list to guarantee completeness
  const navItems = generatedNavItems
  const router = useRouter()

  const clearClientAuth = () => {
    try {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userRole")
    } catch {
      // ignore
    }

    // expire cookies immediately
    document.cookie = "isAuthenticated=; path=/; max-age=0"
    document.cookie = "userRole=; path=/; max-age=0"
  }

  const handleLogoutClick = async () => {
    clearClientAuth()
    router.replace("/auth/signin")
    router.refresh()

    // Fire-and-forget cleanup (do not block navigation)
    Promise.resolve()
      .then(() => supabase.auth.signOut())
      .catch(() => {})

    Promise.resolve()
      .then(() => onLogout())
      .catch(() => {})
  }

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(isSidebarCollapsed)
    }
    router.push(path)
  }

  return (
    <aside
      className={`bg-background min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-20" : "w-[290px]"
      }`}
      style={{
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="p-6 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 hover:bg-muted"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <nav className={`px-4 pb-6 ${isSidebarCollapsed ? "px-2" : ""}`}>
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`menu-item w-full mb-2 transition-all duration-200 ${
              item.active ? "menu-item-active" : "menu-item-inactive"
            } ${isSidebarCollapsed ? "justify-center px-2" : ""}`}
            title={isSidebarCollapsed ? item.name : ""}
          >
            <span
              className={`${
                item.active ? "menu-item-icon-active" : "menu-item-icon-inactive"
              } ${isSidebarCollapsed ? "mx-auto" : ""}`}
            >
              {item.icon}
            </span>
            {!isSidebarCollapsed && <span className="ml-3">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className={`px-4 pb-6 mt-auto ${isSidebarCollapsed ? "px-2" : ""}`}>
        <button
          onClick={handleLogoutClick}
          className={`menu-item w-full transition-all duration-200 hover:bg-red-50 ${
            isSidebarCollapsed ? "justify-center px-2" : ""
          }`}
          title={isSidebarCollapsed ? "Log Out" : ""}
        >
          <span
            className={`${isSidebarCollapsed ? "mx-auto" : ""}`}
            style={{ color: "#DC2626" }}
          >
            <LogOut className="w-5 h-5" />
          </span>
          {!isSidebarCollapsed && (
            <span className="ml-3" style={{ color: "#DC2626" }}>
              Log Out
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
