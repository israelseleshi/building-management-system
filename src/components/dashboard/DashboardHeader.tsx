"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heading, MutedText } from "@/components/ui/typography"
import { Search, Globe, MapPin, Building2, ImagePlus, Upload, Pencil } from "lucide-react"
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
  buildingLogo?: string | null
  onLogoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploadingLogo?: boolean
}

export function DashboardHeader({
  title,
  subtitle,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  buildingName,
  buildingAddress,
  buildingLogo,
  onLogoUpload,
  isUploadingLogo = false,
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
          {buildingName ? (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div
                  className={[
                    "w-14 h-14 rounded-xl flex items-center justify-center shadow-inner overflow-hidden transition-all",
                    buildingLogo
                      ? "border border-primary/20 bg-primary/10"
                      : "border-2 border-dashed border-primary/40 bg-primary/5",
                  ].join(" ")}
                >
                  {buildingLogo ? (
                    <img src={buildingLogo} alt="Building Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-primary/70">
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-[9px] font-semibold tracking-wide">Add Logo</span>
                    </div>
                  )}
                </div>
                {onLogoUpload && (
                  <>
                    <label className="absolute inset-0 cursor-pointer">
                      <span className="sr-only">Upload Building Logo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onLogoUpload}
                        disabled={isUploadingLogo}
                      />
                    </label>

                    <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {buildingLogo ? (
                        <Pencil className="w-5 h-5 text-white" />
                      ) : (
                        <Upload className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {buildingLogo ? "Change Logo" : "Upload Building Logo"}
                    </div>

                    {isUploadingLogo && (
                      <div className="absolute inset-0 rounded-xl bg-background/70 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <Heading level={2} className="text-foreground flex items-center gap-2 tracking-tight">
                  {buildingName}
                </Heading>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" />
                  <span className="text-xs font-medium uppercase tracking-wider">{buildingAddress}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Heading level={2} className="text-foreground">
                {title}
              </Heading>
              <MutedText className="text-sm">{subtitle}</MutedText>
            </div>
          )}
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
