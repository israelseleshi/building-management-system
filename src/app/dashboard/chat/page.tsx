"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Combobox } from "@/components/ui/combobox"
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
    <ProtectedRoute requiredRole="owner">
      <ChatContent />
    </ProtectedRoute>
  )
}

type ContactItem = {
  user_id: number
  full_name: string
  username: string
  profile_picture: string | null
  role: string
  building_id: number
  building_name: string
  unit_id: number | null
  unit_number: string | null
  floor: number | null
}

type ConversationItem = {
  conversation_id: number
  participants: Array<{
    user: {
      user_id: number
      full_name: string
      profile_picture: string | null
      role: string
    }
  }>
  unreadCount?: number
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
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Building/Floor filters
  const [buildings, setBuildings] = useState<Array<{ value: string; label: string }>>([])
  const [floors, setFloors] = useState<Array<{ value: string; label: string }>>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all")
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)

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

  // Local search filtering
  const filteredContacts = (contacts || []).filter(contact => {
    if (!contact) return false;
    return !chatSearch || 
      (contact.full_name && contact.full_name.toLowerCase().includes(chatSearch.toLowerCase())) ||
      (contact.username && contact.username.toLowerCase().includes(chatSearch.toLowerCase()))
  })

  // Load contacts and conversations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/auth/signin")
          return
        }

        // Fetch user info
        const userResponse = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = await userResponse.json()
        if (userData.success) {
          setCurrentUserId(String(userData.data.user.user_id))
        }

        // Fetch user's buildings and floors for filters
        const buildingsRes = await fetch(`${API_BASE_URL}/buildings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const buildingsData = await buildingsRes.json()
        if (buildingsData.success) {
          const formattedBuildings = buildingsData.data.buildings.map((b: any) => ({
            value: String(b.building_id),
            label: b.name
          }))
          setBuildings([{ value: "all", label: "All Buildings" }, ...formattedBuildings])
          
          const allFloors = new Set<number>()
          buildingsData.data.buildings.forEach((b: any) => {
            if (b.number_of_floors) {
              for (let i = 1; i <= b.number_of_floors; i++) {
                allFloors.add(i)
              }
            }
          })
          const formattedFloors = Array.from(allFloors)
            .sort((a, b) => a - b)
            .map(f => ({ value: String(f), label: `Floor ${f}` }))
          setFloors([{ value: "all", label: "All Floors" }, ...formattedFloors])
        }

        // Fetch existing conversations
        const convsResponse = await fetch(`${API_BASE_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const convsData = await convsResponse.json()
        if (convsData.success) {
          setConversations(convsData.data.conversations)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadData()
  }, [router])

  // Fetch contacts whenever filters change
  useEffect(() => {
    const fetchContacts = async () => {
      const token = getAuthToken()
      if (!token) return

      try {
        const queryParams = new URLSearchParams()
        if (selectedBuilding !== "all") queryParams.append("buildingId", selectedBuilding)
        if (selectedFloor !== "all") queryParams.append("floor", selectedFloor)

        const contactsRes = await fetch(`${API_BASE_URL}/conversations/contacts?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const contactsData = await contactsRes.json()
        if (contactsData.success) {
          setContacts(contactsData.data.contacts)
        }
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    fetchContacts()
  }, [selectedBuilding, selectedFloor])

  // Start conversation with a contact
  const startConversationWithContact = async (contact: ContactItem) => {
    const token = getAuthToken()
    if (!token) return

    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => 
        conv.participants.some(p => p.user.user_id === contact.user_id)
      )

      if (existingConv) {
        setActiveConversationId(existingConv.conversation_id)
        await loadMessagesForConversation(existingConv.conversation_id, token)
        return
      }

      // Create new conversation
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participantIds: [contact.user_id] }),
      })

      const data = await response.json()
      if (data.success) {
        const newConvId = data.data.conversation?.conversation_id || data.data.conversationId
        setActiveConversationId(newConvId)
        
        // Refresh conversations list
        const convsResponse = await fetch(`${API_BASE_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const convsData = await convsResponse.json()
        if (convsData.success) {
          setConversations(convsData.data.conversations)
        }

        await loadMessagesForConversation(newConvId, token)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    }
  }

  const loadMessagesForConversation = async (conversationId: number, token: string) => {
    try {
      const msgsResponse = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const msgsData = await msgsResponse.json()

      if (msgsData.success) {
        const builtMessages: MessageItem[] = msgsData.data.messages.map((m: any) => ({
          id: String(m.message_id),
          senderId: String(m.sender_id),
          message: m.content,
          timestamp: new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: String(m.sender_id) === currentUserId
        }))
        setMessages(builtMessages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handlePersonClick = async (index: number) => {
    setSelectedPersonIndex(index)
    const contact = filteredContacts[index]
    if (!contact) return

    await startConversationWithContact(contact)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return

    const token = getAuthToken()
    if (!token) return

    const content = newMessage.trim()
    setNewMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${activeConversationId}/messages`, {
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
          id: String(data.data.message.message_id),
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

  const currentPerson = filteredContacts[selectedPersonIndex]

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

        {/* Chat Container with padding gap */}
        <div className="flex-1 p-4 flex overflow-hidden" style={{ backgroundColor: '#F5EFE7' }}>
          {/* Conversations Sidebar */}
          <div className="w-96 border border-border rounded-lg overflow-hidden flex flex-col mr-4" style={{ backgroundColor: '#F5EFE7' }}>
            {/* Filters */}
            <div className="p-4 border-b border-border space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Building Filter */}
              <Combobox
                options={buildings}
                value={selectedBuilding}
                onValueChange={setSelectedBuilding}
                placeholder="All Buildings"
                className="w-full"
              />

              {/* Floor Filter */}
              <Combobox
                options={floors}
                value={selectedFloor}
                onValueChange={setSelectedFloor}
                placeholder="All Floors"
                className="w-full"
              />
            </div>

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No contacts found
                </div>
              ) : (
                filteredContacts.map((contact, idx) => (
                  <button
                    key={contact.user_id}
                    onClick={() => handlePersonClick(idx)}
                    className={`w-full px-4 py-3 border-b border-border text-left transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                      selectedPersonIndex === idx ? 'bg-white/60 shadow-sm' : 'hover:bg-white/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          {contact.profile_picture && <AvatarImage src={contact.profile_picture} />}
                          <AvatarFallback>{contact.full_name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground text-sm">{contact.full_name}</h3>
                          <span className="text-xs text-muted-foreground capitalize">{contact.role}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.building_name} {contact.floor !== null && `• Floor ${contact.floor}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 border border-border rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor: '#F5EFE7' }}>
            {/* Chat Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {currentPerson?.profile_picture && <AvatarImage src={currentPerson.profile_picture} />}
                  <AvatarFallback>{currentPerson?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-foreground">{currentPerson?.full_name || "Select a contact"}</h2>
                  {currentPerson && (
                    <p className="text-xs text-muted-foreground">
                      {currentPerson.building_name} {currentPerson.floor !== null && `• Floor ${currentPerson.floor}`}
                    </p>
                  )}
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
              {!activeConversationId ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a contact to start messaging
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`flex items-end gap-2 max-w-md ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                      {!msg.isOwn && currentPerson && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback>{currentPerson.full_name[0]}</AvatarFallback>
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
                ))
              )}
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
                  placeholder={activeConversationId ? "Enter message..." : "Select a contact first"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!activeConversationId}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 disabled:opacity-50"
                />
                <Button
                  onClick={handleSendMessage}
                  variant="ghost"
                  size="icon"
                  disabled={!activeConversationId}
                  className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95 disabled:opacity-50"
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
