"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Users,
} from "lucide-react"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ChatContent />
    </ProtectedRoute>
  )
}

type PersonItem = {
  id: string
  name: string
  avatar: string | null
  unread: number
}

type MessageItem = {
  id: string
  senderId: string
  message: string
  timestamp: string
  isOwn: boolean
}

function ChatContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [chatSearch, setChatSearch] = useState("")
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0)
  const [people, setPeople] = useState<PersonItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Top 15 used emojis
  const topEmojis = ["😀", "😂", "❤️", "👍", "🔥", "😍", "🎉", "✨", "😢", "😡", "👏", "🙏", "💯", "🚀", "😎"]

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
      active: true,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Reports",
      path: "/dashboard/reports",
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
      active: false,
    },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/auth/signin")
          return
        }

        // Fetch user info for currentUserId
        const userResponse = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = await userResponse.json()
        if (userData.success) {
          setCurrentUserId(userData.data.user.user_id)
        }

        // Fetch conversations
        const convsResponse = await fetch(`${API_BASE_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const convsData = await convsResponse.json()
        
        if (convsData.success && convsData.data.conversations.length > 0) {
          const formattedPeople = convsData.data.conversations.map((c: any) => ({
            id: c.conversation_id,
            name: c.participants.find((p: any) => p.user.user_id !== userData.data.user.user_id)?.user.full_name || "User",
            avatar: c.participants.find((p: any) => p.user.user_id !== userData.data.user.user_id)?.user.profile_picture || null,
            unread: c.unreadCount || 0
          }))
          setPeople(formattedPeople)
          setSelectedPersonIndex(0)
          await loadMessagesForConversation(convsData.data.conversations[0].conversation_id, token)
        }
      } catch (error) {
        console.error("Error loading chat data:", error)
      }
    }

    const loadMessagesForConversation = async (conversationId: string, token: string) => {
      try {
        const msgsResponse = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const msgsData = await msgsResponse.json()
        
        if (msgsData.success) {
          const builtMessages: MessageItem[] = msgsData.data.messages.map((m: any) => ({
            id: m.message_id,
            senderId: m.sender_id,
            message: m.content,
            timestamp: new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: m.sender_id === currentUserId
          }))
          setMessages(builtMessages)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadData()
  }, [currentUserId])

  const handlePersonClick = async (index: number) => {
    setSelectedPersonIndex(index)
    const person = people[index]
    const token = getAuthToken()
    if (!person || !token) return

    try {
      const msgsResponse = await fetch(`${API_BASE_URL}/conversations/${person.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const msgsData = await msgsResponse.json()
      
      if (msgsData.success) {
        const builtMessages: MessageItem[] = msgsData.data.messages.map((m: any) => ({
          id: m.message_id,
          senderId: m.sender_id,
          message: m.content,
          timestamp: new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: m.sender_id === currentUserId
        }))
        setMessages(builtMessages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const person = people[selectedPersonIndex]
    const token = getAuthToken()
    if (!person || !token) return

    const content = newMessage.trim()
    setNewMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${person.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })
      
      const data = await response.json()
      if (data.success) {
        setMessages((prev) => [...prev, {
          id: data.data.message.message_id,
          senderId: currentUserId || "",
          message: content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: true
        }])
      }
    } catch (error) {
      console.error("Error sending message:", error)
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

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(newMessage + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const fileName = file.name
      // Add file name to message
      setNewMessage(newMessage + ` [File: ${fileName}]`)
      console.log("File selected:", file)
      // In a real app, you would upload to Supabase storage here
    }
  }

  const currentPerson = people[selectedPersonIndex]

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
      <div className="flex-1 transition-all duration-300 ease-in-out flex flex-col">
        <DashboardHeader
          title="Chat"
          subtitle="Direct messaging"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: '#F5EFE7' }}>
          {/* Conversations Sidebar */}
          <div className="w-96 border-r border-border flex flex-col" style={{ backgroundColor: '#F5EFE7' }}>
            {/* Search Bar */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Chats search..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Tenants list */}
            <div className="flex-1 overflow-y-auto">
              {people.map((person, idx) => (
                <button
                  key={person.id}
                  onClick={() => handlePersonClick(idx)}
                  className={`w-full px-4 py-3 border-b border-border text-left transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                    selectedPersonIndex === idx ? 'bg-white/60 shadow-sm' : 'hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        {person.avatar && <AvatarImage src={person.avatar} />}
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground text-sm">{person.name}</h3>
                        <span className="text-xs text-muted-foreground">Tenant</span>
                      </div>
                      {/* last message preview could be added with an extra query */}
                    </div>
                    {person.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {person.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F5EFE7' }}>
            {/* Chat Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {currentPerson?.avatar && <AvatarImage src={currentPerson.avatar} />}
                  <AvatarFallback>{currentPerson?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-foreground">{currentPerson?.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex items-end gap-2 max-w-md ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                    {!msg.isOwn && currentPerson && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback>{currentPerson.name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`${msg.isOwn ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                          msg.isOwn
                            ? 'bg-gray-200 text-foreground rounded-br-none'
                            : 'bg-gray-100 text-foreground rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-border px-6 py-4">
              <div className="flex items-center gap-3 relative">
                {/* Emoji Picker Button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  
                  {/* Emoji Picker Dropdown */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 bg-white border border-border rounded-lg p-3 shadow-lg z-50 w-64">
                      <div className="grid grid-cols-5 gap-2">
                        {topEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl hover:bg-gray-100 rounded p-2 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* File Upload Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*"
                />

                <input
                  type="text"
                  placeholder="Enter message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200"
                />
                <Button
                  onClick={handleSendMessage}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
