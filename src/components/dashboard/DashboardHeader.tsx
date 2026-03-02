"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heading, MutedText } from "@/components/ui/typography"
import { Search, Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { NotificationsDropdown } from "./NotificationsDropdown"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
}

export function DashboardHeader({
  title,
  subtitle,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
}: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = useLocale()
  const normalizedPathname = pathname.replace(/^\/(en|am)(?=\/|$)/, "")
  const isTenantDashboard = normalizedPathname.startsWith("/tenant-dashboard")

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

  return (
    <header className="bg-card border-b border-border shadow-sm px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <Heading level={2} className="text-foreground">
              {title}
            </Heading>
            <MutedText className="text-sm">{subtitle}</MutedText>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-black"
            />
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

          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/landlord.png" alt="Landlord" />
              <AvatarFallback>LL</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
