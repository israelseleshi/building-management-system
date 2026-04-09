"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { LanguageToggle } from "./LanguageToggle"
import {
  Menu,
  X,
  Landmark,
  ChevronDown,
  CreditCard,
  FileText,
  ShieldCheck,
  Wrench,
  Building2,
  Users2,
  MessageSquare,
  BarChart3,
  HandCoins,
  ClipboardCheck,
  BadgeDollarSign,
  ScrollText,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"

type PageKey = "home" | "listings" | "about" | "services" | "contact"

interface HeaderProps {
  currentPage?: PageKey
}

type ServicesFeature = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type ServicesSection = {
  title: string
  items: ServicesFeature[]
}

const servicesSections: ServicesSection[] = [
  {
    title: "Accounting",
    items: [
      { title: "Rent & Payment Management", href: "/home/services/property-management", icon: HandCoins },
      { title: "Late Fee Control", href: "/home/services/property-management", icon: BadgeDollarSign },
      { title: "Financial Management", href: "/home/services/reporting-analytics", icon: CreditCard },
    ],
  },
  {
    title: "Leasing",
    items: [
      { title: "Property and Unit Management", href: "/home/services/property-management", icon: Building2 },
      { title: "Property Listings", href: "/home/services/property-management", icon: ClipboardCheck },
      { title: "Lease Management", href: "/home/services/property-management", icon: ScrollText },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Maintenance Management", href: "/home/services/maintenance-management", icon: Wrench },
      { title: "Document Management", href: "/home/services/document-management", icon: FileText },
      { title: "Commercial Operations", href: "/home/services/commercial-operations", icon: ShieldCheck },
      { title: "Reporting & Analytics", href: "/home/services/reporting-analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Resident Experience",
    items: [
      { title: "Tenant Experience", href: "/home/services/tenant-experience", icon: Users2 },
      { title: "Tenant Management", href: "/home/services/tenant-experience", icon: UserCheck },
      { title: "SMS & Communication", href: "/home/services/tenant-experience", icon: MessageSquare },
    ],
  },
]

export function Header({ currentPage = "home" }: HeaderProps) {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDesktopMenu, setOpenDesktopMenu] = useState<"services" | null>(null)
  const desktopMenuRef = useRef<HTMLElement | null>(null)
  const textColor = hasScrolled ? "#1F3549" : "#FFFFFF"

  const navLinks = [
    { label: t("nav.home"), href: "/home", page: "home" },
    { label: t("nav.services"), href: "/home/services", page: "services" },
    { label: t("nav.listings"), href: "/home/listings", page: "listings" },
    { label: t("nav.about"), href: "/home/about", page: "about" },
    { label: t("nav.contact"), href: "/home/contact", page: "contact" },
  ]

  const handleLogoClick = () => {
    router.push("/home")
  }

  const handleSignIn = () => {
    router.push("/auth/signin")
  }

  const handleRegisterAsOwner = () => {
    router.push("/home/register")
  }

  useEffect(() => {
    const handleScroll = () => {
      const marker = document.getElementById("hero-switch-point")
      if (marker) {
        setHasScrolled(marker.getBoundingClientRect().top <= 108)
        return
      }
      setHasScrolled(window.scrollY > 360)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!desktopMenuRef.current) return
      if (!desktopMenuRef.current.contains(event.target as Node)) {
        setOpenDesktopMenu(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDesktopMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <header
      ref={desktopMenuRef}
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-300",
        hasScrolled ? "top-0 border-b border-[#1F3549]/10 bg-white/95 backdrop-blur-md" : "top-3 bg-transparent",
      )}
      style={{
        boxShadow: hasScrolled ? "0 1px 0 rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.1)" : "none",
      }}
    >
      <style>{`
        .nav-fill-btn {
          position: relative;
          overflow: hidden;
          z-index: 0;
          transition: color 0.2s ease;
        }
        .nav-fill-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
          z-index: -1;
        }
        .nav-fill-btn:hover::before { transform: scaleX(1); }
        .nav-fill-btn--light::before { background: #1F3549; }
        .nav-fill-btn--accent::before { background: #2db79f; }
        .nav-fill-btn:hover { color: #ffffff !important; }
      `}</style>

      <nav className="mx-auto flex w-full max-w-[1260px] items-center justify-between px-4 py-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8 lg:px-8 lg:py-4">
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100 hover:bg-white/10"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Landmark className="size-8" style={{ color: textColor }} />
            <span className="text-[1.5rem] leading-none font-semibold tracking-tight" style={{ color: textColor }}>
              BMS
            </span>
          </button>
        </div>

        <div className="relative hidden items-center justify-start gap-4 lg:flex">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page
            const isServicesLink = link.page === "services"
            const isServicesMenuOpen = openDesktopMenu === "services"

            if (isServicesLink) {
              return (
                <div key={link.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDesktopMenu(isServicesMenuOpen ? null : "services")}
                    className="relative flex items-center gap-1 px-3 py-2 text-[1rem] font-medium transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      color: isActive || isServicesMenuOpen ? textColor : hasScrolled ? "#4b5563" : "rgba(255,255,255,0.9)",
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={cn("size-4 transition-transform duration-200", isServicesMenuOpen && "rotate-180")}
                    />
                    {(isActive || isServicesMenuOpen) && (
                      <span
                        className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                        style={{ backgroundColor: hasScrolled ? "#1F3549" : "#FFFFFF" }}
                      />
                    )}
                  </button>

                </div>
              )
            }

            return (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-2 text-[1rem] font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: isActive ? textColor : hasScrolled ? "#4b5563" : "rgba(255,255,255,0.9)",
                  backgroundColor: "transparent",
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                    style={{ backgroundColor: hasScrolled ? "#1F3549" : "#FFFFFF" }}
                  />
                )}
              </a>
            )
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle inverse={!hasScrolled} className="nav-fill-btn nav-fill-btn--light" />
          <Button
            onClick={handleSignIn}
            size="sm"
            variant={hasScrolled ? "outline" : "ghost"}
            className={cn(
              "nav-fill-btn nav-fill-btn--light h-10 px-6 text-[0.98rem] font-medium",
              hasScrolled
                ? "border-[#1F3549]/20 text-[#1F3549] hover:bg-transparent"
                : "border border-white/45 text-white hover:bg-transparent",
            )}
            style={{ backgroundColor: hasScrolled ? "white" : "rgba(255,255,255,0.06)" }}
          >
            Login
          </Button>
          <Button
            onClick={handleRegisterAsOwner}
            size="sm"
            className="nav-fill-btn nav-fill-btn--accent h-10 px-6 text-[0.98rem] font-semibold border border-transparent"
            style={{ backgroundColor: "#42d3bb", color: "#FFFFFF" }}
          >
            {t("auth.registerOwner")}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle inverse={!hasScrolled} className="nav-fill-btn nav-fill-btn--light" />
          <Button
            size="icon"
            variant={hasScrolled ? "outline" : "ghost"}
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(
              "lg:hidden h-10 w-10",
              hasScrolled ? "border-[#1F3549]/20 text-[#1F3549]" : "border border-white/35 text-white hover:bg-white/15",
            )}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </nav>

      {openDesktopMenu === "services" && (
        <div className="absolute inset-x-0 top-full hidden border-t border-[#dde4ef] bg-white pb-10 pt-8 lg:block">
          <div className="mx-auto grid w-full max-w-[1700px] grid-cols-4 gap-10 px-10">
            {servicesSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-[1.05rem] font-semibold tracking-tight text-[#112544]">{section.title}</h3>
                <div className="grid gap-2">
                  {section.items.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        router.push(item.href)
                        setOpenDesktopMenu(null)
                      }}
                      className="flex items-center gap-3 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-[#f5f8fd]"
                    >
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#dce7f5] bg-[#eaf0fb] text-[#1f6fff]">
                        <item.icon className="size-5" />
                      </span>
                      <span className="text-[0.95rem] font-medium leading-tight text-[#16335e]">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg w-[300px] sm:w-[350px]"
          showClose={false}
          side="left"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Landmark className="size-6 text-[#1F3549]" />
              <span className="text-base font-bold tracking-tight text-[#1F3549]">BMS</span>
            </button>
            <Button size="icon" variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid gap-y-2 overflow-y-auto px-4 py-6">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "justify-start px-4 py-3 rounded-lg text-base font-semibold transition-all",
                    isActive
                      ? "bg-[#1F3549]/10 text-[#1F3549]"
                      : "text-muted-foreground hover:bg-[#1F3549]/10 hover:text-[#1F3549]",
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="p-4 border-t space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                handleSignIn()
                setIsMobileMenuOpen(false)
              }}
              className="w-full border-[#1F3549] text-[#1F3549] hover:bg-[#1F3549] hover:text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                handleRegisterAsOwner()
                setIsMobileMenuOpen(false)
              }}
              style={{ backgroundColor: "#1F3549", color: "#FFFFFF" }}
              className="w-full"
            >
              {t("auth.registerOwner")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

