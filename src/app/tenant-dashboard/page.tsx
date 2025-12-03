"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heading, Text } from "@/components/ui/typography"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Send
} from "lucide-react"

export default function TenantDashboard() {
  return <DashboardContent />
}

function DashboardContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
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

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: true
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard",
      active: true
    }
  ]

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
    router.push("/auth/logout")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">BMS</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-foreground">BMS</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.name.toLowerCase())}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {item.icon}
              {!isSidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-200"
          >
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-200">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=tenant" />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                {!isSidebarCollapsed && <span className="text-sm font-medium flex-1 text-left">Tenant</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=tenant" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
          </div>
        </div>

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
        </div>
      </div>
    </div>
  )
}
