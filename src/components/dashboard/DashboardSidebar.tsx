"use client"

import { LogOut, Settings, Building2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { getLandlordNavGroups, getTenantNavGroups, NavItem } from "@/constants/navItems"
import * as React from "react"
import { useEffect, useState } from "react"
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
  onNavigate: _ignoredOnNavigate,
  appBrandName = "BMS",
}: DashboardSidebarProps) {
  const PANEL_STORAGE_KEY = "bms.dashboard.activePanelGroup"
  const PANEL_CLOSED_VALUE = "closed"
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
          Reports: "nav.reports",
          Insights: "nav.reports",
          Settings: "nav.settings",
        }

        const itemKeyByName: Record<string, string> = {
          Dashboard: "nav.dashboard",
          Listings: "nav.listings",
          "My Rents": "nav.myRents",
          Documents: "nav.documents",
          "Leave Requests": "nav.leaveRequests",
          Chat: "nav.chat",
          Reports: "nav.reports",
          Payments: "nav.reports",
          Maintenance: "nav.maintenance",
          Notifications: "nav.notifications",
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

  const groups = translatedGroups
  const router = useRouter()

  const [activePanelGroup, setActivePanelGroup] = useState<number | null>(null)
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const handleGroupClick = (index: number) => {
    setActivePanelGroup((current) => {
      const next = current === index ? null : index
      try {
        if (next === null) {
          localStorage.setItem(PANEL_STORAGE_KEY, PANEL_CLOSED_VALUE)
        } else {
          localStorage.setItem(PANEL_STORAGE_KEY, String(next))
        }
      } catch {}
      return next
    })
  }

  const closePanel = () => {
    setActivePanelGroup(null)
    setHoveredGroup(null)
    try {
      localStorage.setItem(PANEL_STORAGE_KEY, PANEL_CLOSED_VALUE)
    } catch {}
  }

  const clearClientAuth = () => {
    try {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userRole")
    } catch {
      // ignore
    }
    document.cookie = "isAuthenticated=; path=/; max-age=0"
    document.cookie = "userRole=; path=/; max-age=0"
  }

  const confirmLogout = async () => {
    setIsLogoutConfirmOpen(false)
    clearClientAuth()
    router.replace("/auth/signin")
    router.refresh()
    Promise.resolve()
      .then(() => onLogout())
      .catch(() => {})
  }

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const isApplicationsPage = !isTenantDashboard

  const sidebarBg = isTenantDashboard ? "bg-[#EEF1F8]" : "bg-[#0A2A43]"
  const sidebarBorderColor = isTenantDashboard ? "border-[#D8DEE9]" : "border-white/10"

  // Active item highlight — warm neutral to match the sandy background
  const activeHighlightClass = isTenantDashboard
    ? "bg-white text-[#223042] border border-[#CFD7E5]"
    : "bg-[#113B5E] text-white"
  
  // Highlight class to connect separated icon & label with a pseudo-element behind them
  const connectedHighlightClass = isTenantDashboard
    ? "bg-white text-[#223042] before:bg-white"
    : "bg-[#113B5E] text-white before:bg-[#113B5E]"
    
  // Hover style for non-active items
  const sidebarHoverBg = isTenantDashboard ? "hover:bg-white" : "hover:bg-[#113B5E]"
  const sidebarHoverText = isTenantDashboard ? "hover:text-[#223042]" : "hover:text-white"
  const hoverClass = isTenantDashboard ? "hover:bg-white hover:text-[#223042]" : "hover:bg-[#113B5E] hover:text-white"
  const sidebarBaseTextClass = isTenantDashboard ? "text-[#4E5D70]" : "text-white/70"
  const groupTitleTextClass = isTenantDashboard
    ? "text-[1.02rem] font-semibold tracking-[0.01em]"
    : "text-[0.74rem] font-medium uppercase tracking-[0.03em]"
  const subItemTextClass = isTenantDashboard
    ? "text-[0.96rem] font-medium tracking-[0.01em]"
    : "text-[0.74rem] font-medium"

  const isPanelOpen = activePanelGroup !== null

  useEffect(() => {
    let restoredIndex: number | null = null
    try {
      const raw = localStorage.getItem(PANEL_STORAGE_KEY)
      if (raw !== null) {
        if (raw === PANEL_CLOSED_VALUE) {
          restoredIndex = null
        } else {
        const parsed = Number(raw)
        if (Number.isInteger(parsed) && groups[parsed] && groups[parsed].items.length > 1) {
          restoredIndex = parsed
        }
        }
      }
    } catch {}

    if (restoredIndex !== null || (typeof window !== "undefined" && localStorage.getItem(PANEL_STORAGE_KEY) === PANEL_CLOSED_VALUE)) {
      setActivePanelGroup(restoredIndex)
      return
    }

    const currentGroupIndex = groups.findIndex(
      (group) => group.items.length > 1 && group.items.some((item) => item.active)
    )

    if (currentGroupIndex >= 0) {
      setActivePanelGroup(currentGroupIndex)
      try {
        localStorage.setItem(PANEL_STORAGE_KEY, String(currentGroupIndex))
      } catch {}
    }
  }, [pathname, groups])

  useEffect(() => {
    document.body.classList.toggle("tenant-portal-theme", isTenantDashboard)
    return () => {
      document.body.classList.remove("tenant-portal-theme")
    }
  }, [isTenantDashboard])

  return (
    <aside
      className={`border-r ${sidebarBorderColor} ${sidebarBg} transition-all duration-300 ease-in-out sticky top-0 h-screen flex flex-col select-none relative z-30 ${
        isSidebarCollapsed ? "w-[68px]" : isTenantDashboard ? "w-[272px]" : "w-[180px]"
      }`}
      style={{ boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Backdrop for collapsed-mode flyout */}
      <div
        onClick={isPanelOpen && isSidebarCollapsed ? closePanel : undefined}
        className={`fixed inset-0 z-20 transition-opacity duration-300 ${
          isPanelOpen && isSidebarCollapsed
            ? "opacity-100 cursor-pointer bg-black/10 dark:bg-black/30"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Main sidebar body ── */}
      <div className="flex flex-col h-full w-full">

        {/* Brand header */}
        <div
          className={`px-4 py-6 flex items-center gap-2 border-b ${sidebarBorderColor} ${
            isSidebarCollapsed ? "justify-center px-1" : "justify-start"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${sidebarBorderColor} ${
                isApplicationsPage ? "bg-white/10" : "bg-white"
              }`}
            >
              <Building2
                className={`h-4 w-4 ${isApplicationsPage ? "text-white" : "text-foreground"}`}
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div
                  className={`brand-logo truncate ${isTenantDashboard ? "text-[1.9rem]" : "text-[1.6rem]"} leading-none ${
                    isApplicationsPage ? "text-white" : "text-[#2A3A4E]"
                  }`}
                >
                  {isTenantDashboard ? "BMS" : appBrandName}
                </div>
                {isTenantDashboard && (
                  <div className="mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-[#617086]">
                    Tenant Portal
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            NAVIGATION — collapsed mode: icon strip only
        ══════════════════════════════════════════════════ */}
        {isSidebarCollapsed ? (
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-7">
            <div className="flex flex-col items-center gap-2 px-1.5">
              {groups.map((group, index) => {
                const isSettingsGroup = !isTenantDashboard && group.title === "Settings"
                if (isSettingsGroup) return null

                const isSingleItem = group.items.length === 1
                const isGroupActive = group.items.some((item) => item.active)
                const isPanelActive = activePanelGroup === index

                return (
                  <button
                    key={`${group.title}-${index}`}
                    onClick={() => {
                      if (isSingleItem) {
                        handleNavigation(group.items[0].path)
                        closePanel()
                      } else {
                        handleGroupClick(index)
                      }
                    }}
                    title={group.title}
                    className={`relative flex ${isTenantDashboard ? "h-11 w-11" : "h-10 w-10"} items-center justify-center rounded-lg transition-all duration-200 ${
                      isGroupActive || isPanelActive
                        ? activeHighlightClass
                        : `${isApplicationsPage ? "text-white/70" : sidebarBaseTextClass} ${hoverClass}`
                    }`}
                  >
                    <span
                      className={`transition-colors ${
                        isGroupActive || isPanelActive
                          ? isApplicationsPage ? "text-white" : "text-[#5C4A1E]"
                          : `${isApplicationsPage ? "text-white" : "text-[#4E5D70]"}`
                      }`}
                    >
                        {React.cloneElement(group.icon as React.ReactElement<any>, { className: `${isTenantDashboard ? "w-5.5 h-5.5" : "w-5 h-5"} ${isTenantDashboard ? "text-[#3E5876]" : "text-white"}` })}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>
        ) : (
          /* ══════════════════════════════════════════════════
              NAVIGATION — expanded mode: fixed rail + sliding panels
          ══════════════════════════════════════════════════ */
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* ── Fixed icon rail (40px) ── */}
            <div className="flex flex-col py-7 gap-1 shrink-0 w-[44px] items-center overflow-y-auto no-scrollbar">
              {groups.map((group, groupIndex) => {
                const isSettingsGroup = !isTenantDashboard && group.title === "Settings"
                if (isSettingsGroup) return null

                const isSingleItem = group.items.length === 1
                const singleItem = isSingleItem ? group.items[0] : null
                const isGroupActive = group.items.some((item) => item.active)
                const isHoveredGroup = hoveredGroup === groupIndex
                // When secondary panel is open, completely remove the active highlight 
                // from the primary side items (only show hover interactions).
                const isLit = isHoveredGroup || (!isPanelOpen && isGroupActive)

                return (
                  <div key={groupIndex} className={`flex ${isTenantDashboard ? "h-11" : "h-9"} w-full items-center justify-center`}>
                    <button
                      onMouseEnter={() => setHoveredGroup(groupIndex)}
                      onMouseLeave={() => setHoveredGroup(null)}
                      onClick={() => {
                        if (isSingleItem && singleItem) {
                          handleNavigation(singleItem.path)
                          closePanel()
                        } else {
                          handleGroupClick(groupIndex)
                        }
                      }}
                      title={group.title}
                      className={`flex ${isTenantDashboard ? "h-10 w-10" : "h-9 w-9"} items-center justify-center rounded-l-md transition-all duration-150 ${
                        isLit
                          ? activeHighlightClass
                          : `${isApplicationsPage ? "text-white/70" : sidebarBaseTextClass} ${hoverClass}`
                      }`}
                    >
                      <span className={`${isTenantDashboard ? "text-[#3E5876]" : "text-white"} transition-colors`}>
                        {React.cloneElement(group.icon as React.ReactElement<any>, { className: `w-4 h-4 ${isTenantDashboard ? "text-[#3E5876]" : "text-white"}` })}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* ── Sliding Panel Container ── */}
            <div className="relative flex-1 min-h-0 overflow-visible">
              
              {/* Level 1: group title labels (slides out to left) */}
              <div
                className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isPanelOpen ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                <div className="flex flex-col py-7 gap-1 overflow-y-auto flex-1 pr-2 no-scrollbar">
                  {groups.map((group, groupIndex) => {
                    const isSettingsGroup = !isTenantDashboard && group.title === "Settings"
                    if (isSettingsGroup) return null

                    const isSingleItem = group.items.length === 1
                    const singleItem = isSingleItem ? group.items[0] : null
                    const isGroupActive = group.items.some((item) => item.active)
                    const isHoveredGroup = hoveredGroup === groupIndex
                    const isLit = isHoveredGroup || (!isPanelOpen && isGroupActive)

                    return (
                      <div key={groupIndex} className={`${isTenantDashboard ? "h-11" : "h-9"} flex items-center group`}>
                        <button
                          onMouseEnter={() => setHoveredGroup(groupIndex)}
                          onMouseLeave={() => setHoveredGroup(null)}
                          onClick={() => {
                            if (isSingleItem && singleItem) {
                              handleNavigation(singleItem.path)
                              closePanel()
                            } else {
                              handleGroupClick(groupIndex)
                            }
                          }}
                          className={`relative flex items-center justify-between w-full ${isTenantDashboard ? "h-10 pl-2.5 pr-3 py-2" : "h-9 pl-1 pr-2 py-1.5"} rounded-r-md ${groupTitleTextClass} transition-all duration-150 before:absolute before:-left-[40px] before:top-0 before:h-full before:w-[40px] before:content-[''] ${
                            isLit
                              ? connectedHighlightClass
                              : `${isApplicationsPage ? "text-white" : "text-[#4E5D70]"} ${sidebarHoverBg} ${sidebarHoverText}`
                          }`}
                        >
                          <span className="relative z-10 truncate">{group.title}</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Level 2: submenu panel (slides in from right) */}
              <div
                className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isPanelOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {activePanelGroup !== null && groups[activePanelGroup] && (
                  <div className="flex flex-col h-full bg-background border-l border-border/10">
                    {/* Header: back arrow + shortened group title */}
                    <div className="pt-4 pb-2 px-1">
                      <button
                        onClick={closePanel}
                        className={`flex items-center gap-1.5 w-full px-1.5 py-1.5 rounded-md transition-colors group ${
                          isApplicationsPage
                            ? "hover:bg-white/10 text-white"
                            : "hover:bg-[#C8B99A] text-foreground"
                        }`}
                      >
                        <ArrowLeft
                          className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:-translate-x-1 ${
                            !isApplicationsPage && "text-[#5C4A1E]"
                          }`}
                        />
                        <span
                          className={`font-semibold text-[0.72rem] uppercase tracking-[0.03em] truncate ${
                            !isApplicationsPage && "text-[#5C4A1E]"
                          }`}
                        >
                          {groups[activePanelGroup].title}
                        </span>
                      </button>
                    </div>

                    {/* Sub-items */}
                    <nav className="flex-1 overflow-y-auto px-1 pb-4 space-y-1 no-scrollbar">
                      {groups[activePanelGroup].items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => { handleNavigation(item.path) }}
                          className={`flex w-full items-center ${isTenantDashboard ? "px-2.5 py-2.5" : "px-2 py-2"} rounded-md ${subItemTextClass} transition-all duration-200 ${
                            item.active
                              ? isApplicationsPage
                                ? "bg-[#113B5E] text-white shadow-sm"
                                : `${activeHighlightClass} font-bold`
                              : `${isApplicationsPage ? "text-white/70" : "text-[#4E5D70]"} ${hoverClass}`
                          }`}
                        >
                          <span className="truncate whitespace-nowrap">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-auto border-t ${sidebarBorderColor} px-3 py-4 ${isSidebarCollapsed ? "px-2" : ""}`}>
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
                <span className="ml-3 text-red-300">{t("nav.logout")}</span>
              )}
            </button>
          ) : (
            <div className={`flex items-center gap-2 ${isSidebarCollapsed ? "flex-col" : "flex-row justify-between"}`}>
              <button
                onClick={() => { handleNavigation("/dashboard/settings"); closePanel() }}
                className={`flex h-11 items-center justify-center rounded-lg ${
                  isApplicationsPage ? "text-white/70" : "text-muted-foreground"
                } transition-colors ${
                  isApplicationsPage
                    ? "hover:bg-white/10 hover:text-white"
                    : "hover:bg-muted hover:text-foreground"
                } ${isSidebarCollapsed ? "w-10" : "flex-1"}`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogoutClick}
                className={`flex h-11 items-center justify-center rounded-lg ${
                  isApplicationsPage ? "text-white/70" : "text-muted-foreground"
                } transition-colors ${
                  isApplicationsPage ? "hover:bg-white/10" : "hover:bg-muted"
                } hover:text-red-500 ${isSidebarCollapsed ? "w-10" : "flex-1"}`}
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Collapsed mode flyout panel ── */}
      {isSidebarCollapsed && (
        <div
          className={`absolute top-0 left-[68px] h-screen ${isTenantDashboard ? "w-[272px]" : "w-[200px]"} ${sidebarBg} border-r ${sidebarBorderColor} flex flex-col z-30 transition-all duration-300 ease-out ${
            isPanelOpen
              ? "translate-x-0 opacity-100 shadow-[8px_0_20px_-4px_rgba(0,0,0,0.12)]"
              : "-translate-x-3 opacity-0 pointer-events-none"
          }`}
        >
          {activePanelGroup !== null && groups[activePanelGroup] && (
            <>
              <div className={`flex items-center gap-2 px-3 border-b ${sidebarBorderColor} min-h-[76px]`}>
                <button
                  onClick={closePanel}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isApplicationsPage
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span
                  className={`font-semibold text-[0.88rem] uppercase tracking-[0.045em] truncate pl-1 ${
                    isApplicationsPage ? "text-white" : "text-foreground"
                  }`}
                >
                  {groups[activePanelGroup].title}
                </span>
              </div>

              <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {groups[activePanelGroup].items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => { handleNavigation(item.path) }}
                    className={`flex w-full items-center px-3 py-2.5 rounded-lg text-[0.80rem] font-medium transition-all duration-200 ${
                      item.active
                        ? isApplicationsPage
                          ? "bg-[#113B5E] text-white shadow-sm"
                          : activeHighlightClass
                        : `${isApplicationsPage ? "text-white/70" : "text-[#4E5D70]"} ${hoverClass}`
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{item.name}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-[#0A2A43] shadow-[0_18px_50px_rgba(5,18,30,0.45)]">
            <div className="border-b border-white/15 px-5 py-4">
              <h3 className="text-base font-semibold text-white">Confirm Logout</h3>
              <p className="mt-1 text-sm text-white/75">Are you sure you want to sign out from the dashboard?</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="h-9 rounded-md border border-white/20 px-4 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="h-9 rounded-md bg-[#E15949] px-4 text-sm font-medium text-white transition-colors hover:bg-[#C84A3B]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
