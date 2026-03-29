"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  attachments: Array<{ url: string; name: string }>
}

type HistoryItem = {
  conversationId: number
  userId: number
  fullName: string
  username: string
  profilePicture: string | null
  role: string
  buildingName: string
  floor: number | null
  unreadCount: number
}

function ChatContent() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const [chatSearch, setChatSearch] = useState("")
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])

  const [newMessage, setNewMessage] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messagingMode, setMessagingMode] = useState<"chat" | "email">("chat")
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)

  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [pendingAttachment, setPendingAttachment] = useState<{ name: string; url: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const decodeAttachmentName = (rawUrl: string, fallback: string) => {
    const marker = "#name="
    const markerIndex = rawUrl.indexOf(marker)
    if (markerIndex === -1) return fallback
    const encoded = rawUrl.slice(markerIndex + marker.length)
    try {
      return decodeURIComponent(encoded) || fallback
    } catch {
      return fallback
    }
  }

  const stripAttachmentFragment = (rawUrl: string) => {
    const markerIndex = rawUrl.indexOf("#name=")
    return markerIndex === -1 ? rawUrl : rawUrl.slice(0, markerIndex)
  }

  const normalizeAttachments = (attachments: unknown): Array<{ url: string; name: string }> => {
    if (!attachments || !Array.isArray(attachments)) return []

    return attachments
      .map((item, index) => {
        if (typeof item === "string") {
          const fallbackName = `attachment-${index + 1}`
          return {
            url: stripAttachmentFragment(item),
            name: decodeAttachmentName(item, fallbackName),
          }
        }

        if (typeof item === "object" && item !== null && "url" in item) {
          const rawUrl = String((item as any).url || "")
          if (!rawUrl) return null
          const fallbackName = `attachment-${index + 1}`
          return {
            url: stripAttachmentFragment(rawUrl),
            name: String((item as any).name || decodeAttachmentName(rawUrl, fallbackName)),
          }
        }

        return null
      })
      .filter((item): item is { url: string; name: string } => Boolean(item?.url))
  }

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
    const loadInitialData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/auth/signin")
          return
        }

        const [userResponse, convsResponse, contactsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/conversations/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const userData = await userResponse.json()
        if (userData.success) {
          setCurrentUserId(String(userData.data.user.user_id))
        }

        const convsData = await convsResponse.json()
        if (convsData.success) {
          setConversations(convsData.data.conversations || [])
        }

        const contactsData = await contactsResponse.json()
        if (contactsData.success) {
          setContacts(contactsData.data.contacts || [])
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [router])

  const contactsByUserId = useMemo(() => {
    const map = new Map<number, ContactItem>()
    for (const contact of contacts) {
      map.set(contact.user_id, contact)
    }
    return map
  }, [contacts])

  const historyItems = useMemo<HistoryItem[]>(() => {
    return conversations
      .map((conv) => {
        const participant =
          conv.participants.find((p) => String(p.user.user_id) !== currentUserId)?.user || conv.participants[0]?.user

        if (!participant) return null

        const contact = contactsByUserId.get(participant.user_id)

        return {
          conversationId: conv.conversation_id,
          userId: participant.user_id,
          fullName: participant.full_name || contact?.full_name || "Unknown User",
          username: contact?.username || "",
          profilePicture: participant.profile_picture || contact?.profile_picture || null,
          role: participant.role || contact?.role || "tenant",
          buildingName: contact?.building_name || "",
          floor: contact?.floor ?? null,
          unreadCount: conv.unreadCount || 0,
        }
      })
      .filter((item): item is HistoryItem => Boolean(item))
  }, [conversations, contactsByUserId, currentUserId])

  const filteredHistory = useMemo(() => {
    if (!chatSearch.trim()) return historyItems
    const query = chatSearch.toLowerCase()
    return historyItems.filter((item) => {
      return (
        item.fullName.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.buildingName.toLowerCase().includes(query)
      )
    })
  }, [chatSearch, historyItems])

  const activeHistoryItem = useMemo(() => {
    return historyItems.find((item) => item.conversationId === activeConversationId) || null
  }, [historyItems, activeConversationId])

  useEffect(() => {
    if (historyItems.length === 0) {
      setActiveConversationId(null)
      setMessages([])
      return
    }

    if (!activeConversationId || !historyItems.some((item) => item.conversationId === activeConversationId)) {
      setActiveConversationId(historyItems[0].conversationId)
    }
  }, [historyItems, activeConversationId])

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) return
      const token = getAuthToken()
      if (!token) return

      try {
        const msgsResponse = await fetch(`${API_BASE_URL}/conversations/${activeConversationId}/messages`, {
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
            attachments: normalizeAttachments(m.attachments),
          }))
          setMessages(builtMessages)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadMessages()
  }, [activeConversationId, currentUserId])

  const handleHistoryClick = (conversationId: number) => {
    setActiveConversationId(conversationId)
  }

  const handleSendMessage = async () => {
    if (messagingMode !== "chat" || (!newMessage.trim() && !pendingAttachment) || !activeConversationId) return

    const token = getAuthToken()
    if (!token) return

    const content = newMessage.trim()
    const outgoingAttachments = pendingAttachment ? [{ ...pendingAttachment }] : []
    setNewMessage("")
    setPendingAttachment(null)

    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          attachments: outgoingAttachments.length
            ? outgoingAttachments.map((attachment) => `${attachment.url}#name=${encodeURIComponent(attachment.name)}`)
            : undefined,
        }),
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
            attachments: outgoingAttachments,
          },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
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
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : ""
        if (!result) return
        setPendingAttachment({ name: file.name, url: result })
      }
      reader.readAsDataURL(file)
    }
    if (e.target) {
      e.target.value = ""
    }
  }

  const handleEmailSend = () => {
    if (!activeHistoryItem) return
    if (!emailSubject.trim() && !emailBody.trim()) return
    setEmailSubject("")
    setEmailBody("")
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
    <div className="h-screen overflow-hidden flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 min-h-0 transition-all duration-300 ease-in-out flex flex-col">
        <DashboardHeader
          title="Messaging"
          subtitle={messagingMode === "chat" ? "Chat" : "Email"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
        />

        <div className="flex-1 min-h-0 p-4 bg-[#F4F5F8]">
          <div className="h-full min-h-0 flex border border-[#D6DCE6] rounded-md overflow-hidden bg-white">
            <div className="w-[76px] border-r border-[#E3E8F0] bg-[#F7F9FC] flex flex-col items-stretch py-2">
              <button
                type="button"
                onClick={() => setMessagingMode("email")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded px-2 py-2 text-[11px] ${
                  messagingMode === "email" ? "bg-[#E8EFF7] text-[#0F4C81]" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMessagingMode("chat")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded px-2 py-2 text-[11px] ${
                  messagingMode === "chat" ? "bg-[#E8EFF7] text-[#0F4C81]" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </button>
            </div>

            <div className="w-[320px] border-r border-[#E3E8F0] flex flex-col min-h-0 bg-white">
              <div className="p-3 border-b border-[#E8EDF4]">
                <div className="mb-2 text-sm font-semibold text-[#203247]">{messagingMode === "chat" ? "Chat" : "Email"}</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8EA5]" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full h-9 rounded-md border border-[#D2DCE8] bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-sm text-[#738599]">No message history found.</div>
                ) : (
                  filteredHistory.map((item) => {
                    const isActive = item.conversationId === activeConversationId
                    return (
                      <button
                        key={item.conversationId}
                        type="button"
                        onClick={() => handleHistoryClick(item.conversationId)}
                        className={`w-full border-b border-[#EEF2F8] px-3 py-2 text-left ${
                          isActive ? "bg-[#EEF4FB]" : "hover:bg-[#F8FBFF]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Avatar className="h-8 w-8">
                            {item.profilePicture && <AvatarImage src={item.profilePicture} />}
                            <AvatarFallback>{item.fullName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[13px] font-medium text-[#203247]">{item.fullName}</p>
                              {item.unreadCount > 0 ? (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F80ED] px-1 text-[10px] text-white">
                                  {item.unreadCount}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 truncate text-[12px] text-[#6C7D90]">
                              {item.buildingName}
                              {item.floor !== null ? ` - Floor ${item.floor}` : ""}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col bg-[#FDFDFE]">
              <div className="h-[62px] border-b border-[#E3E8F0] bg-white px-5 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9">
                    {activeHistoryItem?.profilePicture && <AvatarImage src={activeHistoryItem.profilePicture} />}
                    <AvatarFallback>{activeHistoryItem?.fullName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#203247]">
                      {activeHistoryItem?.fullName || "Select a conversation"}
                    </p>
                    {activeHistoryItem?.buildingName ? (
                      <p className="truncate text-xs text-[#6C7D90]">{activeHistoryItem.buildingName}</p>
                    ) : null}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5F6F82] hover:text-[#0F4C81]">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {messagingMode === "chat" ? (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-3 bg-[#F5F7FA]">
                    {!activeConversationId ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">
                        Select a conversation from history.
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">
                        No messages yet.
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[72%]">
                            <div
                              className={`rounded-md px-3 py-2 text-sm ${
                                msg.isOwn
                                  ? "bg-[#2F80ED] text-white rounded-br-none"
                                  : "bg-white text-[#1F2E40] border border-[#E4EBF3] rounded-bl-none"
                              }`}
                            >
                              {msg.message}
                            </div>
                            {msg.attachments.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {msg.attachments.map((attachment, index) => (
                                  <a
                                    key={`${msg.id}-att-${index}`}
                                    href={attachment.url}
                                    download={attachment.name}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] ${
                                      msg.isOwn
                                        ? "border-white/40 bg-white/10 text-white"
                                        : "border-[#d3dce7] bg-[#f4f8fc] text-[#1f4c7e]"
                                    }`}
                                  >
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                            <p className={`mt-1 text-[11px] text-[#7B8DA1] ${msg.isOwn ? "text-right" : "text-left"}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-[#E3E8F0] bg-white px-5 py-3">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                          disabled={!activeConversationId}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>

                        {showEmojiPicker ? (
                          <div className="absolute bottom-11 left-0 z-50 w-64 rounded-md border border-[#D2DCE8] bg-white p-2 shadow-lg">
                            <div className="grid grid-cols-5 gap-1">
                              {topEmojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleEmojiClick(emoji)}
                                  className="rounded p-2 text-xl hover:bg-[#F2F6FB]"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!activeConversationId}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="*/*" />

                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            void handleSendMessage()
                          }
                        }}
                        disabled={!activeConversationId}
                        placeholder={activeConversationId ? "Type a message" : "Select a conversation first"}
                        className="h-9 flex-1 rounded-md border border-[#D2DCE8] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 disabled:opacity-50"
                      />
                      {pendingAttachment ? (
                        <div className="max-w-[200px] truncate rounded border border-[#d2dce8] bg-[#f6f9fd] px-2 py-1 text-[11px] text-[#39506a]">
                          {pendingAttachment.name}
                        </div>
                      ) : null}

                      <Button
                        onClick={() => {
                          void handleSendMessage()
                        }}
                        variant="ghost"
                        size="icon"
                        disabled={!activeConversationId}
                        className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col bg-[#F5F7FA]">
                  <div className="flex-1 min-h-0 overflow-y-auto p-5">
                    {!activeHistoryItem ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">
                        Select a conversation from history.
                      </div>
                    ) : (
                      <div className="mx-auto max-w-3xl rounded-md border border-[#D9E1EC] bg-white">
                        <div className="border-b border-[#E7EDF5] px-4 py-3">
                          <p className="text-sm font-semibold text-[#1F2E40]">Compose Email</p>
                        </div>

                        <div className="space-y-3 p-4">
                          <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                            <label className="text-sm text-[#5F6F82]">To</label>
                            <input
                              type="text"
                              readOnly
                              value={activeHistoryItem.fullName}
                              className="h-9 rounded-md border border-[#D2DCE8] bg-[#FAFCFF] px-3 text-sm text-[#1F2E40]"
                            />
                          </div>

                          <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                            <label className="text-sm text-[#5F6F82]">Subject</label>
                            <input
                              type="text"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              placeholder="Enter subject"
                              className="h-9 rounded-md border border-[#D2DCE8] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                            />
                          </div>

                          <div className="grid grid-cols-[70px_1fr] gap-2">
                            <label className="pt-2 text-sm text-[#5F6F82]">Message</label>
                            <textarea
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                              placeholder="Write your email..."
                              rows={10}
                              className="w-full rounded-md border border-[#D2DCE8] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#E7EDF5] px-4 py-3">
                          <Button variant="ghost" className="text-[#4D6075] hover:bg-[#EEF4FB]">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attach
                          </Button>
                          <Button
                            onClick={handleEmailSend}
                            className="bg-[#2F80ED] text-white hover:bg-[#1F6FD8]"
                            disabled={!activeHistoryItem}
                          >
                            Send Email
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
