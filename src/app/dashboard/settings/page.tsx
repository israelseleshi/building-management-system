"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { getAuthToken, API_BASE_URL } from "@/lib/apiClient"
import { SectionSettingsModal, type SettingsField } from "@/components/shared/SectionSettingsModal"
import {
  Building2,
  Briefcase,
  DollarSign,
  Users,
  Cog,
  Shield,
  Receipt,
  WalletCards,
  Landmark,
  FileBadge2,
  UserRoundCog,
  ScanSearch,
  Languages,
  CalendarClock,
  ShieldEllipsis,
} from "lucide-react"

type FeatureItem = {
  title: string
  description: string
  subFeatures: string[]
  icon: React.ReactNode
}

type FeatureGroup = {
  key: string
  title: string
  icon: React.ReactNode
  features: FeatureItem[]
}

const SETTINGS_GROUPS: FeatureGroup[] = [
  {
    key: "business",
    title: "Business",
    icon: <Briefcase className="h-5 w-5" />,
    features: [
      {
        title: "Building Identity",
        description: "Motto, logo, building name, and address.",
        subFeatures: ["Motto", "Logo", "Name", "Address"],
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        title: "Company Info",
        description: "TIN, slogan, and legal company name.",
        subFeatures: ["TIN", "Slogan", "Legal Name"],
        icon: <FileBadge2 className="h-5 w-5" />,
      },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    icon: <DollarSign className="h-5 w-5" />,
    features: [
      {
        title: "ETB Payouts",
        description: "Bank accounts and payout schedule.",
        subFeatures: ["Bank Accounts", "Payout Schedule"],
        icon: <WalletCards className="h-5 w-5" />,
      },
      {
        title: "Invoice Rules",
        description: "VAT, late fees, and grace periods.",
        subFeatures: ["VAT", "Late Fees", "Grace Periods"],
        icon: <Receipt className="h-5 w-5" />,
      },
    ],
  },
  {
    key: "team",
    title: "Team",
    icon: <Users className="h-5 w-5" />,
    features: [
      {
        title: "Staff Roles",
        description: "Permissions, invites, and access levels.",
        subFeatures: ["Permissions", "Invites", "Access Levels"],
        icon: <UserRoundCog className="h-5 w-5" />,
      },
      {
        title: "Attendance",
        description: "Working hours and geo-fencing radius.",
        subFeatures: ["Working Hours", "Geo-fencing Radius"],
        icon: <ScanSearch className="h-5 w-5" />,
      },
    ],
  },
  {
    key: "system",
    title: "System",
    icon: <Cog className="h-5 w-5" />,
    features: [
      {
        title: "Localization",
        description: "English/Amharic toggle and date format.",
        subFeatures: ["English/Amharic toggle", "Date Format"],
        icon: <Languages className="h-5 w-5" />,
      },
      {
        title: "Calendar Sync",
        description: "Google integration status.",
        subFeatures: ["Google Integration status"],
        icon: <CalendarClock className="h-5 w-5" />,
      },
    ],
  },
  {
    key: "safety",
    title: "Safety",
    icon: <Shield className="h-5 w-5" />,
    features: [
      {
        title: "Security",
        description: "Password, 2FA, and login history.",
        subFeatures: ["Password", "2FA", "Login History"],
        icon: <ShieldEllipsis className="h-5 w-5" />,
      },
    ],
  },
]

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <OwnerSettingsContent />
    </ProtectedRoute>
  )
}

function OwnerSettingsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const navItems = [
    { icon: <Building2 className="w-5 h-5" />, name: "Dashboard", path: "/dashboard", active: false },
    { icon: <Building2 className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings", active: true },
  ]

  const handleLogout = () => {
    const token = getAuthToken()
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const featureFields: Record<string, SettingsField[]> = {
    "Building Identity": [
      { key: "motto", label: "Motto", placeholder: "Enter building motto" },
      { key: "logo", label: "Logo URL", placeholder: "Paste logo image URL" },
      { key: "name", label: "Name", placeholder: "Enter building name" },
      { key: "address", label: "Address", placeholder: "Enter building address" },
    ],
    "Company Info": [
      { key: "tin", label: "TIN", placeholder: "Enter tax identification number" },
      { key: "slogan", label: "Slogan", placeholder: "Enter company slogan" },
      { key: "legalName", label: "Legal Name", placeholder: "Enter legal company name" },
    ],
    "ETB Payouts": [
      { key: "bankAccounts", label: "Bank Accounts", type: "textarea", placeholder: "List payout bank accounts" },
      { key: "payoutSchedule", label: "Payout Schedule", type: "select", options: ["Daily", "Weekly", "Monthly"] },
    ],
    "Invoice Rules": [
      { key: "vat", label: "VAT (%)", type: "number", placeholder: "15" },
      { key: "lateFees", label: "Late Fees", placeholder: "Enter late fee policy" },
      { key: "gracePeriods", label: "Grace Periods (days)", type: "number", placeholder: "5" },
    ],
    "Staff Roles": [
      { key: "permissions", label: "Permissions", type: "textarea", placeholder: "Define permissions" },
      { key: "invites", label: "Invites", type: "select", options: ["Enabled", "Disabled"] },
      { key: "accessLevels", label: "Access Levels", type: "select", options: ["Admin", "Manager", "Staff"] },
    ],
    Attendance: [
      { key: "workingHours", label: "Working Hours", placeholder: "e.g. 08:00 - 17:00" },
      { key: "geoRadius", label: "Geo-fencing Radius (meters)", type: "number", placeholder: "100" },
    ],
    Localization: [
      { key: "language", label: "Language", type: "select", options: ["English", "Amharic"] },
      { key: "dateFormat", label: "Date Format", type: "select", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
    ],
    "Calendar Sync": [
      { key: "googleStatus", label: "Google Integration Status", type: "select", options: ["Connected", "Disconnected"] },
    ],
    Security: [
      { key: "password", label: "Password", placeholder: "Enter new password" },
      { key: "twoFactor", label: "2FA", type: "select", options: ["Enabled", "Disabled"] },
      { key: "loginHistory", label: "Login History", type: "textarea", placeholder: "Recent login activity notes" },
    ],
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        onLogout={handleLogout}
      />

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="General Settings"
          subtitle="Manage your organization settings"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        />

        <main className="bg-[#EEF2F6] p-6">
          <div className="mx-auto max-w-[1500px]">
            <div className="border-b border-[#D8DEE7] pb-3">
              <h1 className="text-[2rem] font-bold tracking-tight text-[#1D2D3D]">General Settings</h1>
            </div>

            <div className="mt-6 space-y-7">
              {SETTINGS_GROUPS.map((group) => (
                <section key={group.key}>
                  <h2 className="mb-4 text-[1.35rem] font-bold text-[#1D2D3D]">{group.title}</h2>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-2">
                    {group.features.map((feature) => (
                      <button
                        key={feature.title}
                        type="button"
                        onClick={() => {
                          setSelectedFeature(feature)
                          setIsSettingsModalOpen(true)
                        }}
                        className={`flex min-h-[88px] items-start gap-3.5 rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                          selectedFeature?.title === feature.title
                            ? "border-[#4E88C8] bg-[#F8FBFF] shadow-sm"
                            : "border-[#DDE5EF] bg-white hover:border-[#4E88C8]/50 hover:shadow-md"
                        }`}
                      >
                        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F3F6FA] text-[#2F4C67]">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-[1.2rem] leading-tight font-semibold text-[#1E3247]">{feature.title}</h3>
                          <p className="mt-1 text-[0.95rem] leading-[1.35] text-[#6A7D90]">{feature.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>

      <SectionSettingsModal
        open={isSettingsModalOpen}
        title={selectedFeature ? `${selectedFeature.title} Settings` : "Settings"}
        subtitle={selectedFeature?.description}
        fields={selectedFeature ? featureFields[selectedFeature.title] ?? [] : []}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  )
}
