"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/typography"
import { Search, Globe, MapPin, AlignLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { NotificationsDropdown } from "./NotificationsDropdown"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  buildingName?: string
  buildingAddress?: string
  buildingMotto?: string
  buildingLogo?: string | null
  appBrandName?: string
  onToggleSidebar?: () => void
}

export function DashboardHeader({
  title,
  subtitle: _subtitle,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  buildingName,
  buildingAddress,
  buildingMotto,
  buildingLogo,
  appBrandName: _appBrandName = "BMS",
  onToggleSidebar,
}: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [localQuery, setLocalQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const currentLocale = useLocale()
  const normalizedPathname = pathname.replace(/^\/(en|am)(?=\/|$)/, "")
  const isTenantDashboard = normalizedPathname.startsWith("/tenant-dashboard")
  const isOverviewStyleHeader = Boolean(buildingName)
  const hasExternalSearchState = typeof onSearchChange === "function"
  const activeQuery = (hasExternalSearchState ? searchQuery : localQuery).trim()

  const globalSearchItems = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard", keywords: "overview home" },
      { label: "Calendar", path: "/dashboard/calendar", keywords: "schedule events" },
      { label: "My Units", path: "/dashboard/listings", keywords: "units listings rentals" },
      { label: "Create Units", path: "/dashboard/create", keywords: "add create listing unit" },
      { label: "Tenants", path: "/dashboard/tenants", keywords: "people tenant portal" },
      { label: "Employees", path: "/dashboard/employees", keywords: "staff team people" },
      { label: "Attendance", path: "/dashboard/attendance", keywords: "staff checkin time tracking" },
      { label: "Chat", path: "/dashboard/chat", keywords: "messages messaging inbox" },
      { label: "Announcements", path: "/dashboard/notices", keywords: "notice notices broadcast" },
      { label: "Payouts", path: "/dashboard/payouts", keywords: "payments transfer finance" },
      { label: "Invoices", path: "/dashboard/invoices", keywords: "billing invoice payments" },
      { label: "Documents", path: "/dashboard/documents", keywords: "files tenant docs" },
      { label: "Reports", path: "/dashboard/reports", keywords: "risk warnings reports" },
      { label: "Analytics", path: "/dashboard/analytics", keywords: "insights charts trends" },
      { label: "Settings", path: "/dashboard/settings", keywords: "account preferences configuration" },
      { label: "Settings - Account", path: "/dashboard/settings", keywords: "profile account user details" },
      { label: "Settings - Notifications", path: "/dashboard/settings", keywords: "alerts notifications email sms" },
      { label: "Settings - Security", path: "/dashboard/settings", keywords: "password security access" },
    ],
    []
  )

  const globalMatches = useMemo(() => {
    const q = activeQuery.toLowerCase()
    if (!q) return []
    return globalSearchItems
      .filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [activeQuery, globalSearchItems])

  const handleToggleLocale = () => {
    const nextLocale = currentLocale === "en" ? "am" : "en"
    try {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`
      // Use full page reload to ensure the new cookie is picked up by server components
      window.location.reload()
    } catch {
      router.refresh()
    }
  }

  const handleSearchChange = (value: string) => {
    if (hasExternalSearchState) {
      onSearchChange?.(value)
    } else {
      setLocalQuery(value)
    }
  }

  const navigateToSearchItem = (path: string) => {
    setIsSearchFocused(false)
    if (!hasExternalSearchState) setLocalQuery("")
    router.push(path)
  }

  return (
    <header className="bg-white">
      <div
        className={[
          "flex items-center justify-between rounded-none bg-white",
          isOverviewStyleHeader ? "min-h-[60px] gap-5 px-6 py-2.5" : "min-h-[52px] gap-4 px-5 py-2",
        ].join(" ")}
      >
        <div className={`flex min-w-0 items-center ${isOverviewStyleHeader ? "gap-3" : "gap-3"}`}>
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className={`shrink-0 rounded-md border border-transparent text-foreground hover:bg-muted ${
                isOverviewStyleHeader ? "h-8 w-8" : "h-6.5 w-6.5"
              }`}
              aria-label="Toggle dashboard navigation"
            >
              <AlignLeft
                className={isOverviewStyleHeader ? "h-[1.1rem] w-[1.1rem]" : "h-[0.95rem] w-[0.95rem]"}
                strokeWidth={1.85}
              />
            </Button>
          )}

          {isOverviewStyleHeader ? (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-muted/40">
                {buildingLogo ? (
                  <img src={buildingLogo} alt="Building Logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-foreground">
                    {buildingName?.split(" ").slice(0, 2).map((part) => part[0]).join("") || "BLD"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Heading level={2} className="truncate text-[1.8rem] leading-none text-foreground tracking-tight">
                  {buildingName}
                </Heading>
                <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate text-[0.67rem] font-medium uppercase tracking-[0.2em]">
                    {buildingMotto || buildingAddress}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <div className="text-[0.76rem] font-semibold uppercase tracking-[0.035em] text-foreground">
                {title}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={hasExternalSearchState ? searchQuery : localQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && globalMatches.length > 0) {
                  event.preventDefault()
                  navigateToSearchItem(globalMatches[0].path)
                }
              }}
              className="h-10 w-64 rounded-lg border border-border bg-card py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
            />
            {isSearchFocused && activeQuery.length >= 2 && globalMatches.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {globalMatches.map((item) => (
                  <button
                    key={`${item.path}-${item.label}`}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => navigateToSearchItem(item.path)}
                    className="block w-full border-b border-border/50 px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted/50 last:border-b-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isTenantDashboard && (
            <Button
              variant="ghost"
              onClick={handleToggleLocale}
              className="flex items-center gap-2 h-9 px-3 font-semibold rounded-full border border-border/50 hover:bg-accent transition-all"
              title={currentLocale === "en" ? "Switch to Amharic" : "Switch to English"}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs tracking-wider">
                {currentLocale === "en" ? "AM" : "EN"}
              </span>
            </Button>
          )}

          <NotificationsDropdown />
        </div>
      </div>
    </header>
  )
}
