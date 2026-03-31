"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Send,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Grid,
  Mail,
  MessagesSquare,
  RotateCcw,
} from "lucide-react"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
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
}

type MessageItem = {
  id: string
  senderId: string
  message: string
  timestamp: string
  isOwn: boolean
  attachments: Array<{ url: string; name: string }>
}

function ChatContent() {
  const router = useRouter()
  const t = useTranslations("Tenant")

  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [chatSearch, setChatSearch] = useState("")
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [messagingMode, setMessagingMode] = useState<"chat" | "email">("chat")
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0)
  const [pendingAttachment, setPendingAttachment] = useState<{ file: File; name: string; url: string } | null>(null)
  const [emailAttachment, setEmailAttachment] = useState<{ file: File; name: string; url: string } | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  const [unitFilter, setUnitFilter] = useState("all")
  const [conversationScope, setConversationScope] = useState("following")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const emailFileInputRef = useRef<HTMLInputElement>(null)

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
    { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/tenant-dashboard", active: false },
    { icon: <Grid className="w-5 h-5" />, name: "Listings", path: "/tenant-dashboard/listings", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/tenant-dashboard/chat", active: true },
    { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/tenant-dashboard/settings", active: false },
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

  const filteredContacts = useMemo(() => {
    return (contacts || []).filter((contact) => {
      if (!contact) return false
      const matchesUnit = unitFilter === "all" || contact.unit_number === unitFilter
      const query = chatSearch.trim().toLowerCase()
      const matchesSearch = !query || contact.full_name.toLowerCase().includes(query) || contact.username.toLowerCase().includes(query)
      return matchesUnit && matchesSearch
    })
  }, [contacts, unitFilter, chatSearch])

  const unitOptions = useMemo(() => {
    const units = Array.from(new Set((contacts || []).map((c) => c.unit_number).filter(Boolean)))
    return ["all", ...units] as string[]
  }, [contacts])

  const currentPerson = filteredContacts[selectedPersonIndex] || null
  const CHAT_REQUEST_PREFIX = "__CHAT_REQUEST__:"
  const requestMessages = useMemo(() => messages.filter((m) => m.message.startsWith(CHAT_REQUEST_PREFIX)), [messages])
  const latestRequest = requestMessages.length > 0 ? requestMessages[requestMessages.length - 1] : null
  const requestAction = latestRequest?.message.replace(CHAT_REQUEST_PREFIX, "") || "NONE"
  const requestPendingFromOther = requestAction === "REQUEST" && latestRequest?.senderId !== currentUserId
  const requestPendingFromMe = requestAction === "REQUEST" && latestRequest?.senderId === currentUserId
  const requestAccepted = requestAction === "ACCEPT"
  const requestRejected = requestAction === "REJECT"
  const isLegacyConversation = messages.length > 0 && requestMessages.length === 0
  const canSendChat = isLegacyConversation || requestAccepted

  useEffect(() => {
    if (selectedPersonIndex > Math.max(0, filteredContacts.length - 1)) {
      setSelectedPersonIndex(0)
    }
  }, [filteredContacts, selectedPersonIndex])

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/auth/signin")
          return
        }

        const [userResponse, contactsRes, convsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/conversations/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const userData = await userResponse.json()
        if (userData.success) setCurrentUserId(String(userData.data.user.user_id))

        const contactsData = await contactsRes.json()
        if (contactsData.success) setContacts(contactsData.data.contacts || [])

        const convsData = await convsResponse.json()
        if (convsData.success) setConversations(convsData.data.conversations || [])
      } catch (error) {
        console.error("Error loading chat data:", error)
      }
    }

    loadData()
  }, [router])

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
          attachments: normalizeAttachments(m.attachments),
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
          setConversations(convsData.data.conversations || [])
        }

        await loadMessagesForConversation(newConvId, token)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    }
  }

  const postConversationMessage = async (
    conversationId: number,
    token: string,
    content: string,
    attachment: { file: File; name: string; url: string } | null
  ) => {
    if (attachment) {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("attachments", attachment.file)

      const multipartRes = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (multipartRes.ok) {
        return await multipartRes.json()
      }
    }

    const jsonRes = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        attachments: attachment ? [`${attachment.url}#name=${encodeURIComponent(attachment.name)}`] : undefined,
      }),
    })
    return await jsonRes.json()
  }

  const handlePersonClick = async (index: number) => {
    setSelectedPersonIndex(index)
    const contact = filteredContacts[index]
    if (!contact) return
    await startConversationWithContact(contact)
    setShowHeaderMenu(false)
  }

  const sendChatRequestAction = async (action: "REQUEST" | "ACCEPT" | "REJECT") => {
    if (!activeConversationId) return
    const token = getAuthToken()
    if (!token) return
    try {
      const data = await postConversationMessage(activeConversationId, token, `${CHAT_REQUEST_PREFIX}${action}`, null)
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(data.data.message.message_id),
            senderId: currentUserId || "",
            message: `${CHAT_REQUEST_PREFIX}${action}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: true,
            attachments: [],
          },
        ])
      }
    } catch (error) {
      console.error("Error sending chat request action:", error)
    }
  }

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !pendingAttachment) || !activeConversationId) return
    const token = getAuthToken()
    if (!token) return
    if (!canSendChat) {
      if (messages.length === 0 && !requestPendingFromMe && !requestPendingFromOther) {
        const confirmed = window.confirm("This is your first chat. Send a chat request first?")
        if (confirmed) {
          await sendChatRequestAction("REQUEST")
        }
      }
      return
    }

    const content = newMessage.trim()
    const outgoingAttachments = pendingAttachment ? [{ ...pendingAttachment }] : []
    setNewMessage("")
    setPendingAttachment(null)

    try {
      const data = await postConversationMessage(activeConversationId, token, content, pendingAttachment)
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(data.data.message.message_id),
            senderId: currentUserId || "",
            message: content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: true,
            attachments: outgoingAttachments.map((item) => ({ url: item.url, name: item.name })),
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
        setPendingAttachment({ file, name: file.name, url: result })
      }
      reader.readAsDataURL(file)
    }
    if (e.target) e.target.value = ""
  }

  const handleEmailAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : ""
        if (!result) return
        setEmailAttachment({ file, name: file.name, url: result })
      }
      reader.readAsDataURL(file)
    }
    if (e.target) e.target.value = ""
  }

  const handleEmailSend = () => {
    if (!activeConversationId) return
    if (!emailSubject.trim() && !emailBody.trim() && !emailAttachment) return

    const token = getAuthToken()
    if (!token) return

    const content = `[Email]\nSubject: ${emailSubject.trim() || "(No Subject)"}\n\n${emailBody.trim()}`

    void (async () => {
      try {
        const data = await postConversationMessage(activeConversationId, token, content, emailAttachment)
        if (data.success) {
          setEmailSubject("")
          setEmailBody("")
          setEmailAttachment(null)
        }
      } catch (error) {
        console.error("Error sending email mode message:", error)
      }
    })()
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
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
          title={t("chatPage.header.title")}
          subtitle={messagingMode === "chat" ? "Chat" : "Email"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
          searchPlaceholder={t("header.searchPlaceholder")}
        />

        <div className="flex-1 min-h-0 p-4 bg-[#F4F5F8]">
          <div className="h-full min-h-0 flex border border-[#D6DCE6] rounded-md overflow-hidden bg-white">
            <div className="w-[86px] border-r border-[#E3E8F0] bg-[#F7F9FC] flex flex-col items-stretch py-2">
              <button
                type="button"
                onClick={() => setMessagingMode("email")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] ${messagingMode === "email" ? "bg-[#DCEBFF] text-[#0F4C81] shadow-sm" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"}`}
              >
                <Mail className="h-6 w-6" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMessagingMode("chat")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] ${messagingMode === "chat" ? "bg-[#DCEBFF] text-[#0F4C81] shadow-sm" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"}`}
              >
                <MessagesSquare className="h-6 w-6" />
                <span>Chat</span>
              </button>
            </div>

            <div className="w-[340px] border-r border-[#E3E8F0] flex flex-col min-h-0 bg-white">
              <div className="border-b border-[#E8EDF4]">
                <div className="h-10 px-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#203247]">Recent conversations</div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-[#5F6F82] hover:text-[#0F4C81]">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="px-3 pb-3 flex items-center gap-2">
                  <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="h-9 min-w-[110px] rounded-md border border-[#D2DCE8] bg-white px-2 text-sm">
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt === "all" ? "All units" : opt}</option>
                    ))}
                  </select>
                  <select value={conversationScope} onChange={(e) => setConversationScope(e.target.value)} className="h-9 min-w-[105px] rounded-md border border-[#D2DCE8] bg-white px-2 text-sm">
                    <option value="following">Following</option>
                    <option value="all">All</option>
                  </select>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8EA5]" />
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full h-9 rounded-md border border-[#D2DCE8] bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-sm text-[#738599]">{t("chatPage.noContacts")}</div>
                ) : (
                  filteredContacts.map((contact, idx) => {
                    const isActive = selectedPersonIndex === idx
                    return (
                      <button key={contact.user_id} type="button" onClick={() => void handlePersonClick(idx)} className={`w-full border-b border-[#EEF2F8] px-2.5 py-2 text-left ${isActive ? "bg-[#EEF4FB]" : "hover:bg-[#F8FBFF]"}`}>
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            {contact.profile_picture && <AvatarImage src={contact.profile_picture} />}
                            <AvatarFallback>{contact.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[12px] font-medium text-[#203247]">{contact.full_name}</p>
                              <span className="text-[10px] text-[#8392a4] capitalize">{contact.role}</span>
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-[#6C7D90]">
                              {contact.building_name}
                              {contact.floor !== null ? ` - ${t("chatPage.filters.floorLabel", { floor: contact.floor })}` : ""}
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
                    {currentPerson?.profile_picture && <AvatarImage src={currentPerson.profile_picture} />}
                    <AvatarFallback>{currentPerson?.full_name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#203247]">{currentPerson?.full_name || t("chatPage.selectContact")}</p>
                    {currentPerson?.building_name ? <p className="truncate text-xs text-[#6C7D90]">{currentPerson.building_name}</p> : null}
                  </div>
                </div>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5F6F82] hover:text-[#0F4C81]" onClick={() => setShowHeaderMenu((x) => !x)}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  {showHeaderMenu && (
                    <div className="absolute right-0 top-10 z-30 w-44 rounded-md border border-[#D2DCE8] bg-white p-1 shadow-lg">
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-[#30465f] hover:bg-[#F3F7FC]" onClick={() => alert("Profile preview coming soon")}>View Profile</button>
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-[#30465f] hover:bg-[#F3F7FC]" onClick={() => setMessages([])}>Clear Messages</button>
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-[#30465f] hover:bg-[#F3F7FC]" onClick={() => setActiveConversationId(null)}>Close Conversation</button>
                    </div>
                  )}
                </div>
              </div>

              {messagingMode === "chat" ? (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-3 bg-[#F5F7FA]">
                    {!activeConversationId ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">{t("chatPage.selectToStart")}</div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 text-sm text-[#738599]">
                        <div>No messages yet.</div>
                        <Button size="sm" onClick={() => void sendChatRequestAction("REQUEST")} className="bg-[#2F80ED] text-white hover:bg-[#1F6FD8]">Send chat request</Button>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[72%]">
                            <div className={`rounded-md px-3 py-2 text-sm ${msg.isOwn ? "bg-[#2F80ED] text-white rounded-br-none" : "bg-white text-[#1F2E40] border border-[#E4EBF3] rounded-bl-none"}`}>
                              {msg.message.startsWith(CHAT_REQUEST_PREFIX)
                                ? msg.message.endsWith("REQUEST")
                                  ? "Chat request sent"
                                  : msg.message.endsWith("ACCEPT")
                                    ? "Chat request accepted"
                                    : "Chat request rejected"
                                : msg.message}
                            </div>
                            {msg.attachments.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {msg.attachments.map((attachment, index) => (
                                  <a key={`${msg.id}-att-${index}`} href={attachment.url} download={attachment.name} target="_blank" rel="noreferrer" className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] ${msg.isOwn ? "border-white/40 bg-white/10 text-white" : "border-[#d3dce7] bg-[#f4f8fc] text-[#1f4c7e]"}`}>
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                            <p className={`mt-1 text-[11px] text-[#7B8DA1] ${msg.isOwn ? "text-right" : "text-left"}`}>{msg.timestamp}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {requestPendingFromOther && (
                    <div className="border-t border-[#E3E8F0] bg-[#FFF8E8] px-5 py-2 text-sm text-[#6A4B00] flex items-center justify-between">
                      <span>New chat request. Accept to start chatting.</span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-8 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => void sendChatRequestAction("ACCEPT")}>Accept</Button>
                        <Button size="sm" variant="outline" className="h-8" onClick={() => void sendChatRequestAction("REJECT")}>Reject</Button>
                      </div>
                    </div>
                  )}
                  {requestPendingFromMe && (
                    <div className="border-t border-[#E3E8F0] bg-[#EEF4FB] px-5 py-2 text-sm text-[#31506f]">Request sent. Waiting for acceptance.</div>
                  )}
                  {requestRejected && (
                    <div className="border-t border-[#E3E8F0] bg-[#FFF1F2] px-5 py-2 text-sm text-[#8A2F40]">Your chat request was rejected.</div>
                  )}

                  <div className="border-t border-[#E3E8F0] bg-white px-5 py-3">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]" onClick={() => setShowEmojiPicker((prev) => !prev)} disabled={!activeConversationId || !canSendChat}>
                          <Smile className="h-4 w-4" />
                        </Button>
                        {showEmojiPicker ? (
                          <div className="absolute bottom-11 left-0 z-50 w-64 rounded-md border border-[#D2DCE8] bg-white p-2 shadow-lg">
                            <div className="grid grid-cols-5 gap-1">
                              {topEmojis.map((emoji, index) => (
                                <button key={index} type="button" onClick={() => handleEmojiClick(emoji)} className="rounded p-2 text-xl hover:bg-[#F2F6FB]">
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]" onClick={() => fileInputRef.current?.click()} disabled={!activeConversationId || !canSendChat}>
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
                        disabled={!activeConversationId || !canSendChat}
                        placeholder={!activeConversationId ? t("chatPage.selectContactFirst") : canSendChat ? t("chatPage.inputPlaceholder") : "Send/request acceptance required"}
                        className="h-9 flex-1 rounded-md border border-[#D2DCE8] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 disabled:opacity-50"
                      />

                      {pendingAttachment ? <div className="max-w-[200px] truncate rounded border border-[#d2dce8] bg-[#f6f9fd] px-2 py-1 text-[11px] text-[#39506a]">{pendingAttachment.name}</div> : null}

                      <Button onClick={() => { void handleSendMessage() }} variant="ghost" size="icon" disabled={!activeConversationId || !canSendChat} className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col bg-[#F5F7FA]">
                  <div className="flex-1 min-h-0 overflow-y-auto p-5">
                    {!activeConversationId || !currentPerson ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">{t("chatPage.selectToStart")}</div>
                    ) : (
                      <div className="mx-auto max-w-3xl rounded-md border border-[#D9E1EC] bg-white">
                        <div className="border-b border-[#E7EDF5] px-4 py-3">
                          <p className="text-sm font-semibold text-[#1F2E40]">Compose Email</p>
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                            <label className="text-sm text-[#5F6F82]">To</label>
                            <input type="text" readOnly value={currentPerson.full_name} className="h-9 rounded-md border border-[#D2DCE8] bg-[#FAFCFF] px-3 text-sm text-[#1F2E40]" />
                          </div>
                          <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                            <label className="text-sm text-[#5F6F82]">Subject</label>
                            <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Enter subject" className="h-9 rounded-md border border-[#D2DCE8] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20" />
                          </div>
                          <div className="grid grid-cols-[70px_1fr] gap-2">
                            <label className="pt-2 text-sm text-[#5F6F82]">Message</label>
                            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Write your email..." rows={10} className="w-full rounded-md border border-[#D2DCE8] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#E7EDF5] px-4 py-3">
                          <Button variant="ghost" className="text-[#4D6075] hover:bg-[#EEF4FB]" onClick={() => emailFileInputRef.current?.click()}>
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attach
                          </Button>
                          <input ref={emailFileInputRef} type="file" className="hidden" onChange={handleEmailAttachmentUpload} accept="*/*" />
                          {emailAttachment ? <div className="max-w-[240px] truncate rounded border border-[#d2dce8] bg-[#f6f9fd] px-2 py-1 text-[11px] text-[#39506a]">{emailAttachment.name}</div> : null}
                          <Button onClick={handleEmailSend} className="bg-[#2F80ED] text-white hover:bg-[#1F6FD8]" disabled={!activeConversationId}>
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
