"use client"

import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
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
      className="flex items-center gap-2 text-white hover:bg-white/20 px-3 h-9 rounded-full border border-white/30 backdrop-blur-sm transition-all"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold text-xs tracking-wider">
        {locale === "en" ? "AM" : "EN"}
      </span>
    </Button>
  )
}
