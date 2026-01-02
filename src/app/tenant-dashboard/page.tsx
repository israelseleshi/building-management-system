"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text, MutedText } from "@/components/ui/typography"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings,
  Send,
  Grid,
  FileText
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

// Note: This page now serves as a container for all tenant dashboard tabs
// Individual tabs (chat, settings) have their own pages at /chat and /settings subdirectories

export default function TenantDashboard() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Determine active tab based on current pathname
  // IMPORTANT: Check more specific paths first to avoid partial matches
  let activeTab = "dashboard"
  if (pathname === "/tenant-dashboard/leases" || pathname.startsWith("/tenant-dashboard/leases/")) {
    activeTab = "leases"
  } else if (pathname === "/tenant-dashboard/listings" || pathname.startsWith("/tenant-dashboard/listings/")) {
    activeTab = "listings"
  } else if (pathname === "/tenant-dashboard/documents" || pathname.startsWith("/tenant-dashboard/documents/")) {
    activeTab = "documents"
  } else if (pathname === "/tenant-dashboard/chat" || pathname.startsWith("/tenant-dashboard/chat/")) {
    activeTab = "chat"
  } else if (pathname === "/tenant-dashboard/settings" || pathname.startsWith("/tenant-dashboard/settings/")) {
    activeTab = "settings"
  }
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Landlord",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=landlord",
      message: "Hi! How are you doing with the apartment?",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=tenant",
      message: "Everything is great! Thanks for asking.",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Landlord",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=landlord",
      message: "Great to hear! Let me know if you need anything.",
      timestamp: "10:40 AM",
      isOwn: false
    }
  ])
  const [newMessage, setNewMessage] = useState("")

  const navItems = useMemo(() => [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: activeTab === "dashboard"
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: activeTab === "listings"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "My Rents",
      path: "/tenant-dashboard/leases",
      active: activeTab === "leases"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Documents",
      path: "/tenant-dashboard/documents",
      active: activeTab === "documents"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: activeTab === "chat"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: activeTab === "settings"
    }
  ], [activeTab])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: "You",
        senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=tenant",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }])
      setNewMessage("")
    }
  }

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

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title={activeTab === "dashboard" ? "Dashboard" : activeTab === "chat" ? "Chat with Landlord" : "Settings"}
          subtitle={activeTab === "dashboard" ? "Welcome to your tenant dashboard" : activeTab === "chat" ? "Direct messaging with your property landlord" : "Manage your account settings"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="bg-card border-b border-border px-8 py-4">
                <Heading level={2} className="text-2xl font-bold text-foreground">
                  Chat with Landlord
                </Heading>
                <Text className="text-muted-foreground mt-1">
                  Direct messaging with your property landlord
                </Text>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  >
                    <div className={`flex items-end space-x-3 max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={msg.senderImage} />
                        <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`${msg.isOwn ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-muted text-foreground rounded-bl-none'
                          }`}
                        >
                          <Text className="text-sm">{msg.message}</Text>
                        </div>
                        <Text className="text-xs text-muted-foreground mt-1">{msg.timestamp}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-card border-t border-border px-8 py-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="gap-2"
                    style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="p-8">
              <Heading level={2} className="text-2xl font-bold text-foreground mb-6">
                Welcome to Your Tenant Dashboard
              </Heading>
              <div className="bg-card rounded-lg border border-border p-6">
                <Text className="text-muted-foreground">
                  More features coming soon for tenant dashboard.
                </Text>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-8">
              <Heading level={2} className="text-2xl font-bold text-foreground mb-6">
                Settings
              </Heading>
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <Heading level={3} className="text-lg font-semibold text-foreground mb-4">
                    Profile Information
                  </Heading>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button
                      className="w-full h-10 font-semibold rounded-lg"
                      style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>

                {/* Password Settings */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <Heading level={3} className="text-lg font-semibold text-foreground mb-4">
                    Change Password
                  </Heading>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button
                      className="w-full h-10 font-semibold rounded-lg"
                      style={{ backgroundColor: '#7D8B6F', color: '#FFFFFF' }}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <Heading level={3} className="text-lg font-semibold text-foreground mb-4">
                    Notification Preferences
                  </Heading>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text weight="medium" className="text-foreground">Email Notifications</Text>
                        <MutedText className="text-sm">Receive updates via email</MutedText>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Text weight="medium" className="text-foreground">Chat Messages</Text>
                        <MutedText className="text-sm">Get notified about new messages</MutedText>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Text weight="medium" className="text-foreground">Maintenance Alerts</Text>
                        <MutedText className="text-sm">Receive maintenance updates</MutedText>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
