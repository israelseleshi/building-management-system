"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { LogOut, ChevronDown, Settings, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { getLandlordNavGroups, getTenantNavGroups, NavItem } from "@/constants/navItems"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface DashboardSidebarProps {
  navItems?: NavItem[]
  isSidebarCollapsed: boolean
  onToggleSidebar?: () => void
  onLogout: () => void
  onNavigate?: (isCurrentlyCollapsed: boolean) => void
  appBrandName?: string
}


export function DashboardSidebar({
  navItems: _ignoredNavItems,
  isSidebarCollapsed,
  onToggleSidebar: _ignoredOnToggleSidebar,
  onLogout,
  onNavigate,
  appBrandName = "BMS",
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations("Tenant")
  const normalizedPathname = pathname.replace(/^\/(en|am)(?=\/|$)/, "")
  const isTenantDashboard = normalizedPathname.startsWith("/tenant-dashboard")

  const generatedGroups = isTenantDashboard
    ? getTenantNavGroups(pathname)
    : getLandlordNavGroups(pathname)

  const translatedGroups = isTenantDashboard
    ? generatedGroups.map((group) => {
        const titleKeyByTitle: Record<string, string> = {
          Overview: "nav.overview",
          Properties: "nav.properties",
          Management: "nav.management",
          Communication: "nav.communication",
          Insights: "nav.insights",
          Settings: "nav.settings",
        }

        const itemKeyByName: Record<string, string> = {
          Dashboard: "nav.dashboard",
          Listings: "nav.listings",
          "My Rents": "nav.myRents",
          Documents: "nav.documents",
          Chat: "nav.chat",
          Reports: "nav.reports",
          Settings: "nav.settings",
        }

        const maybeTitleKey = titleKeyByTitle[group.title]

        return {
          ...group,
          title: maybeTitleKey ? t(maybeTitleKey as any) : group.title,
          items: group.items.map((item) => {
            const maybeItemKey = itemKeyByName[item.name]
            return {
              ...item,
              name: maybeItemKey ? t(maybeItemKey as any) : item.name,
            }
          }),
        }
      })
    : generatedGroups
  // Always use generated list to guarantee completeness
  const groups = translatedGroups
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
      className={`border-r border-border/60 bg-background transition-all duration-300 ease-in-out sticky top-0 h-screen overflow-hidden flex flex-col ${
        isSidebarCollapsed ? "w-[78px]" : "w-[210px]"
      }`}
      style={{
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        className={`px-5 py-4 flex items-center gap-3 border-b border-border/60 ${
          isSidebarCollapsed ? "justify-center px-3" : "justify-start"
        }`}
      >
        {!isSidebarCollapsed && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card">
              <Building2 className="h-5 w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <div className="brand-logo truncate text-[1.95rem] leading-none text-foreground">{appBrandName}</div>
            </div>
          </div>
        )}
      </div>

      <nav className={`flex-1 min-h-0 overflow-y-auto py-4 ${isSidebarCollapsed ? "px-1.5" : "px-2"}`}>
        {isSidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            {groups.map((group, index) => {
              const isSettingsGroup = !isTenantDashboard && group.title === "Settings"
              if (isSettingsGroup) return null

              const activeItem = group.items.find((item) => item.active)
              const targetPath = activeItem?.path || group.items[0]?.path
              const isGroupActive = group.items.some((item) => item.active)

              if (!targetPath) return null

              return (
                <button
                  key={`${group.title}-${index}`}
                  onClick={() => handleNavigation(targetPath)}
                  title={group.title}
                  className={`relative flex h-10 w-full items-center justify-center rounded-lg transition-all ${
                    isGroupActive
                      ? "border border-[#BFEBCB] bg-[#D8F6DE] text-[#1C8B4C]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className={isGroupActive ? "text-[#1C8B4C]" : "text-foreground"}>{group.icon}</span>
                  {isGroupActive && !isTenantDashboard && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-y-transparent border-r-[10px] border-r-[var(--background)]"
                    />
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          groups.map((group, groupIndex) => {
            const isSingleItem = group.items.length === 1
            const singleItem = isSingleItem ? group.items[0] : null
            const isSettingsGroup = !isTenantDashboard && group.title === "Settings"

            if (isSettingsGroup) {
              return null
            }

            if (isSingleItem && singleItem) {
              return (
                <button
                  key={groupIndex}
                  onClick={() => handleNavigation(singleItem.path)}
                  className={`relative mb-1 flex items-center w-full rounded-lg px-3 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.045em] transition-all ${
                    singleItem.active
                      ? "border border-[#BFEBCB] bg-[#D8F6DE] text-[#1C8B4C]"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`shrink-0 ${singleItem.active ? "text-[#1C8B4C]" : "text-foreground"}`}>
                      {group.icon}
                    </span>
                    <span className="truncate whitespace-nowrap">{group.title}</span>
                  </div>
                  {singleItem.active && !isTenantDashboard && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-y-transparent border-r-[10px] border-r-[var(--background)]"
                    />
                  )}
                </button>
              )
            }

            return (
              <Collapsible
                key={groupIndex}
                open={openGroups[groupIndex] ?? false}
                onOpenChange={() => toggleGroup(groupIndex)}
                className="mb-1"
              >
                <>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.045em] text-foreground hover:bg-muted transition-colors">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 text-foreground">{group.icon}</span>
                      <span className="truncate">{group.title}</span>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                        openGroups[groupIndex] ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1 pl-8">
                    {group.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className={`relative flex w-full items-center rounded-lg px-3 py-2.5 text-[0.76rem] font-medium uppercase tracking-[0.04em] transition-all duration-200 ${
                          item.active
                            ? "border border-[#BFEBCB] bg-[#D8F6DE] text-[#1C8B4C]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className={`shrink-0 ${item.active ? "text-[#1C8B4C]" : "text-muted-foreground"}`}>
                          {item.icon}
                        </span>
                        <span className="ml-2.5 truncate whitespace-nowrap">{item.name}</span>
                        {item.active && !isTenantDashboard && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-y-transparent border-r-[10px] border-r-[var(--background)]"
                          />
                        )}
                      </button>
                    ))}
                  </CollapsibleContent>
                </>
              </Collapsible>
            )
          })
        )}
      </nav>

      <div className={`mt-auto border-t border-border/60 px-3 py-3 ${isSidebarCollapsed ? "px-2" : ""}`}>
        {isTenantDashboard ? (
          <button
            onClick={handleLogoutClick}
            className={`flex w-full items-center rounded-lg px-4 py-3 text-[0.95rem] transition-all duration-200 hover:bg-muted ${
              isSidebarCollapsed ? "justify-center px-2" : ""
            }`}
            title={isSidebarCollapsed ? t("nav.logout") : ""}
          >
            <span className={`${isSidebarCollapsed ? "mx-auto" : ""} text-red-300`}>
              <LogOut className="w-5 h-5" />
            </span>
            {!isSidebarCollapsed && (
              <span className="ml-3 text-red-300">
                {t("nav.logout")}
              </span>
            )}
          </button>
        ) : (
          <div className={`flex items-center gap-2 ${isSidebarCollapsed ? "flex-col" : "flex-row justify-between"}`}>
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className={`flex h-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
                isSidebarCollapsed ? "w-full" : "flex-1"
              }`}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogoutClick}
              className={`flex h-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-red-500 ${
                isSidebarCollapsed ? "w-full" : "flex-1"
              }`}
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
