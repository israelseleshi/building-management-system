"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { LogOut, Menu, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { usePathname } from "next/navigation"
import { getLandlordNavGroups, getTenantNavGroups, NavItem } from "@/constants/navItems"
import { useState } from "react"

interface DashboardSidebarProps {
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
  const generatedGroups = pathname.startsWith("/tenant-dashboard")
    ? getTenantNavGroups(pathname)
    : getLandlordNavGroups(pathname)
  // Always use generated list to guarantee completeness
  const groups = generatedGroups
  const router = useRouter()
  
  // Track open/closed state of each group
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    groups.forEach((group, index) => {
      initial[index] = group.defaultOpen || false
    })
    return initial
  })

  const toggleGroup = (index: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

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

  // When collapsed, show all groups expanded for better UX
  const getOpenState = (index: number) => {
    return isSidebarCollapsed ? true : (openGroups[index] ?? false)
  }

  return (
    <aside
      className={`bg-background min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-20" : "w-[320px]"
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

      <nav className={`flex-1 px-4 py-8 ${isSidebarCollapsed ? "px-2" : ""}`}>
        {groups.map((group, groupIndex) => {
          const isSingleItem = group.items.length === 1
          const singleItem = isSingleItem ? group.items[0] : null

          if (isSingleItem && singleItem) {
            return (
              <button
                key={groupIndex}
                onClick={() => handleNavigation(singleItem.path)}
                className={`flex items-center w-full px-3 py-3 text-sm font-semibold rounded-md transition-all ${
                  singleItem.active
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${
                  isSidebarCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={singleItem.active ? "text-green-700" : "text-foreground"}>
                    {group.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap">{group.title}</span>
                  )}
                </div>
              </button>
            )
          }

          return (
            <Collapsible
              key={groupIndex}
              open={getOpenState(groupIndex)}
              onOpenChange={() => toggleGroup(groupIndex)}
              className="mb-4"
            >
              {!isSidebarCollapsed ? (
                <>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground">{group.icon}</span>
                      <span>{group.title}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openGroups[groupIndex] ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-11 mt-1 space-y-1">
                    {group.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className={`menu-item w-full transition-all duration-200 ${
                          item.active ? "bg-green-100 text-green-700 border border-green-200" : "menu-item-inactive"
                        }`}
                        >
                        <span
                          className={
                            item.active ? "text-green-700" : "menu-item-icon-inactive"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="ml-3 whitespace-nowrap">{item.name}</span>
                      </button>
                    ))}
                  </CollapsibleContent>
                </>
              ) : (
                // Collapsed view - show group icon that expands on hover
                <div className="flex flex-col items-center gap-1">
                  <CollapsibleTrigger className="flex items-center justify-center w-full p-2 rounded-md hover:bg-muted transition-colors">
                    <span className="text-foreground">{group.icon}</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="absolute left-full ml-2 top-0 bg-card border rounded-md shadow-lg p-2 min-w-[200px] z-50">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                      {group.title}
                    </div>
                    {group.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className={`menu-item w-full text-left px-2 py-1.5 rounded transition-all duration-200 ${
                          item.active ? "bg-green-100 text-green-700 border border-green-200" : "menu-item-inactive"
                        }`}
                        >
                        <span
                          className={
                            item.active ? "text-green-700" : "menu-item-icon-inactive"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="ml-2 whitespace-nowrap">{item.name}</span>
                      </button>
                    ))}
                  </CollapsibleContent>
                </div>
              )}
            </Collapsible>
          )
        })}
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
