"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { supabase } from "@/lib/supabaseClient"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
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
  Users,
} from "lucide-react"

interface SettingsTab {
  id: string
  label: string
  icon: React.ReactNode
}

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const router = useRouter()
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
    company: "",
    bio: "",
  })
  const [loading, setLoading] = useState(true)

  // Fetch profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company_name || "",
          bio: data.bio || "",
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
    { id: "inquiries", label: "New Property Inquiries", description: "Get notified when tenants inquire about your listed properties", enabled: true },
    { id: "offers", label: "Lease Offers Received", description: "Receive alerts when tenants submit lease offers for your properties", enabled: true },
    { id: "messages", label: "Tenant Messages", description: "Get notified for new messages from interested tenants", enabled: true },
    { id: "payments", label: "Payment Confirmations", description: "Receive payment confirmation notifications for property transactions", enabled: true },
    { id: "listings", label: "Listing Performance", description: "Get alerts about your property listing views and engagement metrics", enabled: false },
    { id: "maintenance", label: "Maintenance Requests", description: "Receive notifications when tenants submit maintenance requests", enabled: true },
  ])

  // Billing state
  const [billingInfo, setBillingInfo] = useState({
    cardHolder: "Abebe Kebede",
    cardNumber: "•••• •••• •••• 4242",
    expiryDate: "12/25",
    billingAddress: "Bole Road, Bole Sub-City, Addis Ababa, Ethiopia",
  })

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false,
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: true,
    },
  ]

  const settingsTabs: SettingsTab[] = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Lock className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="w-5 h-5" /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          company_name: profile.company,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Failed to save profile changes')
    }
  }

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      alert("Passwords do not match")
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Map field names to database column names
      const fieldMap: { [key: string]: string } = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        phone: 'phone',
        company: 'company_name',
        bio: 'bio',
      }

      const dbField = fieldMap[field]
      if (!dbField) return

      const { error } = await supabase
        .from('profiles')
        .update({
          [dbField]: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile((prev) => ({ ...prev, [field]: value }))
      setEditingField(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving field:', err)
      alert('Failed to save changes')
    }
  }

  const renderEditableField = (field: string, label: string, type: string = "text", rows?: number) => {
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
                title="Save changes"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground flex items-center justify-between">
              <span className={value ? "text-foreground" : "text-muted-foreground"}>
                {value || `Enter ${label.toLowerCase()}`}
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
          title="Settings"
          subtitle="Manage your account and preferences"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Tabs Navigation */}
            <div className="flex justify-start gap-4 border-b border-border overflow-x-auto mb-8">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`}
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
                <span className="text-sm font-medium text-green-800">Changes saved successfully!</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    Profile Information
                  </Heading>
                  <Text className="text-sm text-muted-foreground">Update your personal and professional information</Text>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderEditableField("firstName", "First Name")}
                    {renderEditableField("lastName", "Last Name")}
                  </div>

                  {renderEditableField("email", "Email Address", "email")}
                  {renderEditableField("phone", "Phone Number", "tel")}
                  {renderEditableField("company", "Company Name")}
                  {renderEditableField("bio", "Bio", "text", 4)}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveProfile} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                  <div>
                    <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                      Change Password
                    </Heading>
                    <Text className="text-sm text-muted-foreground">Update your password to keep your account secure</Text>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
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
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
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
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
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
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    Notification Preferences
                  </Heading>
                  <Text className="text-sm text-muted-foreground">Choose which notifications you want to receive</Text>
                </div>

                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-background/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground">{notif.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
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
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveProfile} style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    Payment Method
                  </Heading>
                  <Text className="text-sm text-muted-foreground">Manage your billing and payment information</Text>
                </div>

                <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Card Holder</p>
                      <p className="font-medium text-foreground mt-1">{billingInfo.cardHolder}</p>
                      <p className="text-lg font-mono text-foreground mt-3">{billingInfo.cardNumber}</p>
                      <p className="text-sm text-muted-foreground mt-2">Expires: {billingInfo.expiryDate}</p>
                    </div>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm">Edit</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Billing Address</label>
                  <textarea
                    value={billingInfo.billingAddress}
                    onChange={(e) => setBillingInfo({ ...billingInfo, billingAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Billing
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <div>
                  <Heading level={3} className="text-xl font-bold text-foreground mb-1">
                    Privacy & Security
                  </Heading>
                  <Text className="text-sm text-muted-foreground">Control your privacy settings and data sharing preferences</Text>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Profile Visibility", description: "Allow other users to see your profile", enabled: true },
                    { label: "Show Online Status", description: "Let others know when you're online", enabled: true },
                    { label: "Allow Search Indexing", description: "Allow search engines to index your profile", enabled: false },
                    { label: "Data Collection", description: "Allow us to collect usage data for improvements", enabled: true },
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
