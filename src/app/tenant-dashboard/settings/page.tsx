"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
  Lock,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  Edit2,
  Grid,
} from "lucide-react"

interface SettingsTab {
  id: string
  label: string
  icon: React.ReactNode
}

interface NotificationSetting {
  id: string
  enabled: boolean
}

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const router = useRouter()
  const t = useTranslations("Tenant")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })
  const [loading, setLoading] = useState(true)

  // Fetch profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/user/me`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.error || payload?.message || t("settings.alerts.loadProfileFailed"))
        }

        const data = payload?.data?.user || {}
        const fullName = data?.full_name || ""
        const [firstName, ...rest] = fullName.split(" ")
        const lastName = rest.join(" ")

        setProfile({
          firstName: firstName || "",
          lastName: lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: "",
          bio: "",
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // Notification state
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "messages", enabled: true },
    { id: "maintenance", enabled: true },
    { id: "payments", enabled: true },
    { id: "announcements", enabled: true },
    { id: "offers", enabled: false },
  ])

  const notificationContent: Record<string, { label: string; description: string }> = {
    messages: {
      label: t("settings.notifications.items.messages.label"),
      description: t("settings.notifications.items.messages.description"),
    },
    maintenance: {
      label: t("settings.notifications.items.maintenance.label"),
      description: t("settings.notifications.items.maintenance.description"),
    },
    payments: {
      label: t("settings.notifications.items.payments.label"),
      description: t("settings.notifications.items.payments.description"),
    },
    announcements: {
      label: t("settings.notifications.items.announcements.label"),
      description: t("settings.notifications.items.announcements.description"),
    },
    offers: {
      label: t("settings.notifications.items.offers.label"),
      description: t("settings.notifications.items.offers.description"),
    },
  }

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: false,
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: true,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Text className="text-muted-foreground text-sm">{t("settings.loading")}</Text>
      </div>
    )
  }

  const settingsTabs: SettingsTab[] = [
    { id: "profile", label: t("settings.tabs.profile"), icon: <User className="w-5 h-5" /> },
    { id: "security", label: t("settings.tabs.security"), icon: <Lock className="w-5 h-5" /> },
    { id: "notifications", label: t("settings.tabs.notifications"), icon: <Bell className="w-5 h-5" /> },
    { id: "privacy", label: t("settings.tabs.privacy"), icon: <Shield className="w-5 h-5" /> },
  ]

  const handleLogout = () => {
    const token = getAuthToken()
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }).catch(() => undefined)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPassword((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    )
  }

  const handleSaveProfile = async () => {
    try {
      const token = getAuthToken()
      const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ")
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: profile.phone,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || payload?.message || "Failed to save profile changes")
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      } catch (err) {
        console.error('Error saving profile:', err)
        alert(t("settings.alerts.saveProfileFailed"))
      }
  }

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      alert(t("settings.alerts.passwordMismatch"))
      return
    }
    if (!password.current || !password.new) {
      alert(t("settings.alerts.passwordIncomplete"))
      return
    }
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/user/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        currentPassword: password.current,
        newPassword: password.new,
      }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload?.success === false) {
      alert(payload?.error || payload?.message || t("settings.alerts.changePasswordFailed"))
      return
    }
    setSaveSuccess(true)
    setPassword({ current: "", new: "", confirm: "" })
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleFieldEdit = (field: string) => {
    setEditingField(field)
  }

  const handleFieldSave = async (field: string, value: string) => {
    try {
      if (["email", "address", "bio"].includes(field)) {
        alert(t("settings.alerts.fieldNotSupported"))
        return
      }

      const token = getAuthToken()
      const fullName = field === "firstName" || field === "lastName"
        ? [field === "firstName" ? value : profile.firstName, field === "lastName" ? value : profile.lastName]
            .filter(Boolean)
            .join(" ")
        : [profile.firstName, profile.lastName].filter(Boolean).join(" ")

      const body: Record<string, string> = {
        full_name: fullName,
        phone: field === "phone" ? value : profile.phone,
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || payload?.message || t("settings.alerts.saveChangesFailed"))
      }

      setProfile((prev) => ({ ...prev, [field]: value }))
      setEditingField(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving field:', err)
      alert(t("settings.alerts.saveChangesFailed"))
    }
  }

  const renderEditableField = (
    field: string,
    label: string,
    placeholder: string,
    type: string = "text",
    rows?: number
  ) => {
    const value = profile[field as keyof typeof profile]
    const isEditing = editingField === field

    return (
      <div key={field}>
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
        <div className="relative">
          {isEditing ? (
            <div className="flex gap-2">
              {rows ? (
                <textarea
                  value={value}
                  onChange={(e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }))}
                  rows={rows}
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  autoFocus
                />
              ) : (
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              )}
              <button
                onClick={() => handleFieldSave(field, value)}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
                title={t("settings.profile.save")}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground flex items-center justify-between">
              <span className={value ? "text-foreground" : "text-muted-foreground"}>
                {value || placeholder}
              </span>
              <button onClick={() => handleFieldEdit(field)} className="p-1 hover:bg-muted rounded">
                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title={t("settings.page.title")}
          subtitle={t("settings.page.subtitle")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("header.searchPlaceholder")}
        />

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Tabs Navigation */}
            <div className="flex justify-start gap-4 border-b border-border overflow-x-auto mb-8">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap rounded-lg ${
                    activeTab === tab.id
                      ? "text-primary border-primary relative overflow-hidden"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`}
                  style={{
                    ...(activeTab === tab.id && {
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    })
                  }}
                >
                  <span className={activeTab === tab.id ? "text-primary" : "text-muted-foreground"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">{t("settings.success")}</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="rounded-2xl p-8 space-y-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    {t("settings.profile.title")}
                  </Heading>
                  <Text className="text-sm text-muted-foreground">{t("settings.profile.subtitle")}</Text>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderEditableField(
                      "firstName",
                      t("settings.profile.firstName.label"),
                      t("settings.profile.firstName.placeholder")
                    )}
                    {renderEditableField(
                      "lastName",
                      t("settings.profile.lastName.label"),
                      t("settings.profile.lastName.placeholder")
                    )}
                  </div>

                  {renderEditableField(
                    "email",
                    t("settings.profile.email.label"),
                    t("settings.profile.email.placeholder"),
                    "email"
                  )}
                  {renderEditableField(
                    "phone",
                    t("settings.profile.phone.label"),
                    t("settings.profile.phone.placeholder"),
                    "tel"
                  )}
                  {renderEditableField(
                    "address",
                    t("settings.profile.address.label"),
                    t("settings.profile.address.placeholder")
                  )}
                  {renderEditableField(
                    "bio",
                    t("settings.profile.bio.label"),
                    t("settings.profile.bio.placeholder"),
                    "text",
                    4
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveProfile} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                    <Save className="w-4 h-4 mr-2" />
                    {t("settings.profile.save")}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-2xl p-8 space-y-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                  <div>
                    <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                      {t("settings.security.title")}
                    </Heading>
                    <Text className="text-sm text-muted-foreground">{t("settings.security.subtitle")}</Text>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("settings.security.currentPassword")}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password.current}
                          onChange={(e) => handlePasswordChange("current", e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("settings.security.newPassword")}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={password.new}
                          onChange={(e) => handlePasswordChange("new", e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("settings.security.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        value={password.confirm}
                        onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button onClick={handleChangePassword} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                      <Save className="w-4 h-4 mr-2" />
                      {t("settings.security.update")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl p-8 space-y-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    {t("settings.notifications.title")}
                  </Heading>
                  <Text className="text-sm text-muted-foreground">{t("settings.notifications.subtitle")}</Text>
                </div>

                <div className="space-y-4">
                  {notifications.map((notif) => {
                    const content = notificationContent[notif.id] || { label: notif.id, description: "" }
                    return (
                    <div key={notif.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-background/50 transition-colors"
                      style={{
                        background: "rgba(125, 139, 111, 0.1)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(125, 139, 111, 0.2)"
                      }}>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground">{content.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(notif.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-4 ${
                          notif.enabled ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notif.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveProfile} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                    <Save className="w-4 h-4 mr-2" />
                    {t("settings.notifications.save")}
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="rounded-2xl p-8 space-y-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    {t("settings.privacy.title")}
                  </Heading>
                  <Text className="text-sm text-muted-foreground">{t("settings.privacy.subtitle")}</Text>
                </div>

                <div className="space-y-4">
                  {[
                    { label: t("settings.privacy.items.profileVisibility.label"), description: t("settings.privacy.items.profileVisibility.description"), enabled: true },
                    { label: t("settings.privacy.items.contactInfo.label"), description: t("settings.privacy.items.contactInfo.description"), enabled: true },
                    { label: t("settings.privacy.items.searchIndexing.label"), description: t("settings.privacy.items.searchIndexing.description"), enabled: false },
                    { label: t("settings.privacy.items.dataCollection.label"), description: t("settings.privacy.items.dataCollection.description"), enabled: true },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-background/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground">{setting.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-4 ${
                          setting.enabled ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
