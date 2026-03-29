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
  Mail,
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
  const [messagingMode, setMessagingMode] = useState<"chat" | "email">("chat")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)

  const topEmojis = [
    "\u{1F600}",
    "\u{1F602}",
    "\u2764\uFE0F",
    "\u{1F44D}",
    "\u{1F525}",
    "\u{1F60D}",
    "\u{1F389}",
    "\u2728",
    "\u{1F622}",
    "\u{1F621}",
    "\u{1F44F}",
    "\u{1F64F}",
    "\u{1F4AF}",
    "\u{1F680}",
    "\u{1F60E}",
  ]

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

  const filteredContacts = (contacts || []).filter((contact) => {
    if (!contact) return false
    return (
      !chatSearch ||
      (contact.full_name && contact.full_name.toLowerCase().includes(chatSearch.toLowerCase())) ||
      (contact.username && contact.username.toLowerCase().includes(chatSearch.toLowerCase()))
    )
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/auth/signin")
          return
        }

        const userResponse = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = await userResponse.json()
        if (userData.success) {
          setCurrentUserId(String(userData.data.user.user_id))
        }

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

  useEffect(() => {
    const fetchContacts = async () => {
      const token = getAuthToken()
      if (!token) return

      try {
        const contactsRes = await fetch(`${API_BASE_URL}/conversations/contacts`, {
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
  }, [])

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
          isOwn: String(m.sender_id) === currentUserId,
        }))
        setMessages(builtMessages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const startConversationWithContact = async (contact: ContactItem) => {
    const token = getAuthToken()
    if (!token) return

    try {
      const existingConv = conversations.find((conv) => conv.participants.some((p) => p.user.user_id === contact.user_id))

      if (existingConv) {
        setActiveConversationId(existingConv.conversation_id)
        await loadMessagesForConversation(existingConv.conversation_id, token)
        return
      }

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

  const handlePersonClick = async (index: number) => {
    setSelectedPersonIndex(index)
    const contact = filteredContacts[index]
    if (!contact) return

    await startConversationWithContact(contact)
  }

  const handleSendMessage = async () => {
    if (messagingMode !== "chat" || !newMessage.trim() || !activeConversationId) return

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
        setMessages((prev) => [
          ...prev,
          {
            id: String(data.data.message.message_id),
            senderId: currentUserId || "",
            message: content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: true,
          },
        ])
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
      setNewMessage(newMessage + ` [File: ${fileName}]`)
      console.log("File selected:", file)
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

      <div className="flex-1 transition-all duration-300 ease-in-out flex flex-col">
        <DashboardHeader
          title="Messaging"
          subtitle={messagingMode === "chat" ? "Direct chat messaging" : "Email messaging"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
        />

        <div className="flex-1 p-4 flex overflow-hidden bg-[#F3F6FA]">
          <div className="w-[360px] border border-[#dbe4ee] rounded-lg overflow-hidden flex flex-col mr-4 bg-white">
            <div className="p-3 border-b border-[#e2e8f0] space-y-3">
              <div className="grid grid-cols-2 rounded-md bg-[#eef3f9] p-1">
                <button
                  type="button"
                  onClick={() => setMessagingMode("email")}
                  className={`h-9 rounded text-sm font-medium transition-colors ${
                    messagingMode === "email" ? "bg-white text-[#0F4C81] shadow-sm" : "text-[#506176] hover:text-[#0F4C81]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessagingMode("chat")}
                  className={`h-9 rounded text-sm font-medium transition-colors ${
                    messagingMode === "chat" ? "bg-white text-[#0F4C81] shadow-sm" : "text-[#506176] hover:text-[#0F4C81]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </span>
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7a8ea5]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-[#d2dce8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No contacts found</div>
              ) : (
                filteredContacts.map((contact, idx) => (
                  <button
                    key={contact.user_id}
                    onClick={() => handlePersonClick(idx)}
                    className={`w-full px-4 py-3 border-b border-[#edf2f7] text-left transition-colors ${
                      selectedPersonIndex === idx ? "bg-[#edf4fb]" : "hover:bg-[#f8fbff]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        {contact.profile_picture && <AvatarImage src={contact.profile_picture} />}
                        <AvatarFallback>{contact.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground text-sm">{contact.full_name}</h3>
                          <span className="text-xs text-muted-foreground capitalize">{contact.role}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.building_name}
                          {contact.floor !== null ? ` - Floor ${contact.floor}` : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 border border-[#dbe4ee] rounded-lg overflow-hidden flex flex-col bg-[#f8fbff]">
            <div className="border-b border-[#e2e8f0] bg-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {currentPerson?.profile_picture && <AvatarImage src={currentPerson.profile_picture} />}
                  <AvatarFallback>{currentPerson?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-foreground">{currentPerson?.full_name || "Select a contact"}</h2>
                  {currentPerson && (
                    <p className="text-xs text-muted-foreground">
                      {currentPerson.building_name}
                      {currentPerson.floor !== null ? ` - Floor ${currentPerson.floor}` : ""}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5f6e82] hover:text-[#0F4C81]">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messagingMode === "email" ? (
                <div className="h-full flex items-center justify-center text-center text-[#5f6e82]">
                  Email option is available in this screen. Switch to Chat to send real-time messages.
                </div>
              ) : !activeConversationId ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a contact to start messaging
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-end gap-2 max-w-md ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                      {!msg.isOwn && currentPerson && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback>{currentPerson.full_name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={msg.isOwn ? "text-right" : "text-left"}>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.isOwn
                              ? "bg-[#2F80ED] text-white rounded-br-none"
                              : "bg-white text-foreground border border-[#e4ebf3] rounded-bl-none"
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

            <div className="border-t border-[#e2e8f0] bg-white px-6 py-4">
              <div className="flex items-center gap-3 relative">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#5f6e82] hover:bg-[#eef4fb] hover:text-[#0F4C81]"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    disabled={messagingMode !== "chat"}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 bg-white border border-[#d2dce8] rounded-lg p-3 shadow-lg z-50 w-64">
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

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#5f6e82] hover:bg-[#eef4fb] hover:text-[#0F4C81] disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={messagingMode !== "chat"}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept="*/*" />

                <input
                  type="text"
                  placeholder={
                    messagingMode === "email"
                      ? "Email mode selected"
                      : activeConversationId
                        ? "Type a message..."
                        : "Select a contact first"
                  }
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={!activeConversationId || messagingMode !== "chat"}
                  className="flex-1 px-4 py-2 rounded-md border border-[#d2dce8] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 disabled:opacity-50"
                />
                <Button
                  onClick={handleSendMessage}
                  variant="ghost"
                  size="icon"
                  disabled={!activeConversationId || messagingMode !== "chat"}
                  className="h-9 w-9 text-[#5f6e82] hover:bg-[#eef4fb] hover:text-[#0F4C81] disabled:opacity-50"
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
