"use client"

import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  inverse?: boolean
  className?: string
}

export function LanguageToggle({ inverse = false, className }: LanguageToggleProps) {
  const locale = useLocale()

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "am" : "en"
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-2 px-4 h-11 rounded-full border transition-all",
        inverse
          ? "text-white border-white/40 hover:bg-white/15"
          : "text-[#1F3549] border-[#1F3549]/30 hover:bg-[#1F3549]/10",
        className,
      )}
      style={{ backgroundColor: inverse ? "rgba(255,255,255,0.06)" : "white" }}
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold text-sm tracking-wider">{locale === "en" ? "AM" : "EN"}</span>
    </Button>
  )
}

