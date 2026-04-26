"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  MessagesSquare,
  RefreshCw,
  Users,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Subscript,
  Superscript,
  Link2,
  Eraser,
  Undo2,
  Redo2,
} from "lucide-react"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"

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
  sentAt: string
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
  unitNumber: string | null
  floor: number | null
  unreadCount: number
  lastPreview: string
  lastSentAt: string | null
}

const getInitials = (fullName: string) => {
  const cleaned = fullName.trim()
  if (!cleaned) return "?"
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase()
}

function InitialCircle({
  fullName,
  size = "md",
}: {
  fullName: string
  size?: "md" | "lg"
}) {
  const styleBySize = size === "lg"
    ? "h-12 w-12 text-[1.05rem]"
    : "h-10 w-10 text-[0.9rem]"
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[#F97316] bg-white font-semibold text-[#F97316] ${styleBySize}`}
      aria-label={fullName}
    >
      {getInitials(fullName)}
    </div>
  )
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
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [, setBlockedContacts] = useState<Set<number>>(new Set())
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [userToBlock, setUserToBlock] = useState<{id: number, name: string} | null>(null)
  const headerMenuRef = useRef<HTMLDivElement>(null)
  const [messagingMode, setMessagingMode] = useState<"chat" | "email">("chat")
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [unitFilter, setUnitFilter] = useState("all")

  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailFontFamily, setEmailFontFamily] = useState("sans-serif")
  const [emailFontSize, setEmailFontSize] = useState("3")
  const [pendingAttachment, setPendingAttachment] = useState<{ file: File; name: string; url: string } | null>(null)
  const [emailAttachment, setEmailAttachment] = useState<{ file: File; name: string; url: string } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const emailFileInputRef = useRef<HTMLInputElement>(null)
  const emailEditorRef = useRef<HTMLDivElement>(null)

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
        const latestMessage = Array.isArray((conv as any).messages) && (conv as any).messages.length > 0
          ? (conv as any).messages[0]
          : null

        return {
          conversationId: conv.conversation_id,
          userId: participant.user_id,
          fullName: participant.full_name || contact?.full_name || "Unknown User",
          username: contact?.username || "",
          profilePicture: participant.profile_picture || contact?.profile_picture || null,
          role: participant.role || contact?.role || "tenant",
          buildingName: contact?.building_name || "",
          unitNumber: contact?.unit_number || null,
          floor: contact?.floor ?? null,
          unreadCount: conv.unreadCount || 0,
          lastPreview: String(latestMessage?.content || ""),
          lastSentAt: latestMessage?.sent_at ? String(latestMessage.sent_at) : null,
        }
      })
      .filter((item): item is HistoryItem => Boolean(item))
  }, [conversations, contactsByUserId, currentUserId])

  const formatHistoryTime = (iso: string | null) => {
    if (!iso) return ""
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatConversationDay = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const that = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const diffDays = Math.round((start.getTime() - that.getTime()) / 86400000)
    if (diffDays === 0) return "TODAY"
    if (diffDays === 1) return "YESTERDAY"
    return d.toLocaleDateString()
  }

  const unitOptions = useMemo(() => {
    const units = Array.from(new Set(historyItems.map((h) => h.unitNumber).filter(Boolean)))
    return ["all", ...units] as string[]
  }, [historyItems])

  const filteredHistory = useMemo(() => {
    const query = chatSearch.trim().toLowerCase()
    return historyItems.filter((item) => {
      const matchesUnit = unitFilter === "all" || item.unitNumber === unitFilter
      const matchesSearch = !query || item.fullName.toLowerCase().includes(query) || item.username.toLowerCase().includes(query) || item.buildingName.toLowerCase().includes(query)
      return matchesUnit && matchesSearch
    })
  }, [chatSearch, historyItems, unitFilter])

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
            sentAt: String(m.sent_at),
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setShowHeaderMenu(false)
      }
    }
    if (showHeaderMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showHeaderMenu])

  const handleBlockUser = (userId: number, userName: string) => {
    setUserToBlock({ id: userId, name: userName })
    setShowBlockDialog(true)
    setShowHeaderMenu(false)
  }

  const confirmBlockUser = () => {
    if (userToBlock) {
      setBlockedContacts((prev) => new Set([...prev, userToBlock.id]))
      setActiveConversationId(null)
      setMessages([])
      setUserToBlock(null)
    }
    setShowBlockDialog(false)
  }

  const handleHistoryClick = (conversationId: number) => {
    setActiveConversationId(conversationId)
    setShowHeaderMenu(false)
  }

  const refreshChatData = async () => {
    const token = getAuthToken()
    if (!token) return

    setIsRefreshing(true)
    try {
      const [convsResponse, contactsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/conversations/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const convsData = await convsResponse.json()
      if (convsData.success) {
        setConversations(convsData.data.conversations || [])
      }

      const contactsData = await contactsResponse.json()
      if (contactsData.success) {
        setContacts(contactsData.data.contacts || [])
      }

      if (activeConversationId) {
        const msgsResponse = await fetch(`${API_BASE_URL}/conversations/${activeConversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const msgsData = await msgsResponse.json()
        if (msgsData.success) {
          const builtMessages: MessageItem[] = msgsData.data.messages.map((m: any) => ({
            id: String(m.message_id),
            senderId: String(m.sender_id),
            message: m.content,
            sentAt: String(m.sent_at),
            timestamp: new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: String(m.sender_id) === currentUserId,
            attachments: normalizeAttachments(m.attachments),
          }))
          setMessages(builtMessages)
        }
      }
    } catch (error) {
      console.error("Error refreshing chat data:", error)
    } finally {
      setIsRefreshing(false)
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
            sentAt: new Date().toISOString(),
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
    if (messagingMode !== "chat" || (!newMessage.trim() && !pendingAttachment) || !activeConversationId) return

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
            sentAt: new Date().toISOString(),
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
    if (e.target) {
      e.target.value = ""
    }
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
    if (e.target) {
      e.target.value = ""
    }
  }

  const handleEmailSend = () => {
    if (!activeHistoryItem || !activeConversationId) return
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
          if (emailEditorRef.current) {
            emailEditorRef.current.innerHTML = ""
          }
          setEmailAttachment(null)
        }
      } catch (error) {
        console.error("Error sending email mode message:", error)
      }
    })()
  }

  const execEmail = (command: string, value?: string) => {
    emailEditorRef.current?.focus()
    document.execCommand(command, false, value)
    if (emailEditorRef.current) {
      setEmailBody(emailEditorRef.current.innerHTML)
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
          title="Chat"
          subtitle={messagingMode === "chat" ? "Chat" : "Email"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
        />

        <div className="flex-1 min-h-0 p-4 bg-[#F4F5F8]">
          <div className="h-full min-h-0 flex border border-[#D6DCE6] rounded-md overflow-hidden bg-white">
            <div className="w-[86px] border-r border-[#E3E8F0] bg-[#F7F9FC] flex flex-col items-stretch py-2">
              <button
                type="button"
                onClick={() => setMessagingMode("email")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] ${
                  messagingMode === "email" ? "bg-[#DCEBFF] text-[#0F4C81] shadow-sm" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"
                }`}
              >
                <Mail className="h-6 w-6" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMessagingMode("chat")}
                className={`mx-2 my-1 flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] ${
                  messagingMode === "chat" ? "bg-[#DCEBFF] text-[#0F4C81] shadow-sm" : "text-[#5B6A7D] hover:bg-[#EEF3F9]"
                }`}
              >
                <MessagesSquare className="h-6 w-6" />
                <span>Chat</span>
              </button>
            </div>

            <div className="w-[340px] border-r border-[#E3E8F0] flex flex-col min-h-0 bg-white">
              <div className="border-b border-[#E8EDF4]">
                <div className="h-10 px-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#203247]">Recent conversations</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void refreshChatData()}
                    disabled={isRefreshing}
                    className="h-8 w-8 rounded-md border border-[#D2DCE8] bg-white text-[#2F6FA9] hover:bg-[#EEF4FB] hover:text-[#0F4C81]"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                <div className="px-3 pb-3 flex items-center gap-2">
                  <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="h-9 min-w-[110px] rounded-md border border-[#D2DCE8] bg-white px-2 text-sm">
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt === "all" ? "All units" : opt}</option>
                    ))}
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
                        className={`w-full border-b border-[#EEF2F8] px-3 py-3 text-left ${
                          isActive ? "bg-[#EEF4FB]" : "hover:bg-[#F8FBFF]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <InitialCircle fullName={item.fullName} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="truncate text-[12px] font-semibold text-[#202938]">{item.fullName}</p>
                              <span className="shrink-0 text-[10px] text-[#8392a4]">{formatHistoryTime(item.lastSentAt)}</span>
                              {item.unreadCount > 0 ? (
                                <span className="shrink-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2F80ED] px-1 text-[9px] text-white">
                                  {item.unreadCount}
                                </span>
                              ) : null}
                            </div>
                            <p className="truncate text-[11px] leading-snug text-[#6C7D90] mt-1">
                              {item.lastPreview || `${item.unitNumber || item.buildingName}`}
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
              <div className="relative h-[74px] border-b border-[#E3E8F0] bg-white px-5 flex items-center justify-between py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <InitialCircle fullName={activeHistoryItem?.fullName || "Unknown"} size="lg" />
                  <p className="truncate text-sm font-medium text-[#4E647C]">
                    {activeHistoryItem?.unitNumber ? `Unit ${activeHistoryItem.unitNumber}` : activeHistoryItem?.buildingName || ""}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-x-20 top-1/2 -translate-y-1/2 text-center">
                  <p className="truncate text-base font-semibold text-[#203247] md:text-lg">
                    {activeHistoryItem?.fullName || "Select a conversation"}
                  </p>
                </div>
                <div className="relative" ref={headerMenuRef}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5F6F82] hover:text-[#0F4C81]" onClick={() => setShowHeaderMenu((x) => !x)}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  {showHeaderMenu && (
                    <div className="absolute right-0 top-10 z-30 w-44 rounded-md border border-[#D2DCE8] bg-white p-1 shadow-lg">
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-[#30465f] hover:bg-[#F3F7FC]" onClick={() => alert("Profile preview coming soon")}>View Profile</button>
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-[#30465f] hover:bg-[#F3F7FC]" onClick={() => setMessages([])}>Clear Messages</button>
                      <button type="button" className="w-full rounded px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50" onClick={() => activeHistoryItem && handleBlockUser(activeHistoryItem.conversationId, activeHistoryItem.fullName)}>Block User</button>
                    </div>
                  )}
                </div>
              </div>

              <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Block User</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to block <span className="font-semibold text-foreground">{userToBlock?.name}</span>? This will end the conversation and prevent further contact.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setShowBlockDialog(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmBlockUser}>Block User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {messagingMode === "chat" ? (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-3 bg-[#F5F7FA]">
                    {!activeConversationId ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#738599]">
                        Select a conversation from history.
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 text-sm text-[#738599]">
                        <div>No messages yet.</div>
                        <Button size="sm" onClick={() => void sendChatRequestAction("REQUEST")} className="bg-[#2F80ED] text-white hover:bg-[#1F6FD8]">Send chat request</Button>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const dayLabel = formatConversationDay(msg.sentAt)
                        const prevLabel = index > 0 ? formatConversationDay(messages[index - 1].sentAt) : ""
                        const showDay = dayLabel !== prevLabel
                        return (
                        <div key={msg.id}>
                          {showDay && (
                            <div className="my-3 flex items-center gap-3 text-[11px] font-semibold uppercase text-[#9AA9BA]">
                              <div className="h-px flex-1 bg-[#D9E2EC]" />
                              <span>{dayLabel}</span>
                              <div className="h-px flex-1 bg-[#D9E2EC]" />
                            </div>
                          )}
                        <div className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                          <div className="max-w-[74%]">
                            <div
                              className={`rounded-md px-3 py-2 text-sm ${
                                msg.isOwn
                                  ? "bg-[#2F80ED] text-white rounded-br-none"
                                  : "bg-white text-[#1F2E40] border border-[#E4EBF3] rounded-bl-none"
                              }`}
                            >
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
                        </div>
                      )})
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5F6F82] hover:bg-[#EEF4FB] hover:text-[#0F4C81]"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                          disabled={!activeConversationId || !canSendChat}
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
                        disabled={!activeConversationId || !canSendChat}
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
                        disabled={!activeConversationId || !canSendChat}
                        placeholder={!activeConversationId ? "Select a conversation first" : canSendChat ? "Type a message" : "Send/request acceptance required"}
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
                        disabled={!activeConversationId || !canSendChat}
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
                            <div className="rounded-md border border-[#D2DCE8] bg-white">
                              <div className="flex flex-wrap items-center gap-1 border-b border-[#E7EDF5] p-2">
                                <select value={emailFontFamily} onChange={(e) => { setEmailFontFamily(e.target.value); execEmail("fontName", e.target.value) }} className="h-8 w-[126px] rounded border border-[#D2DCE8] bg-white px-2 text-xs">
                                  <option value="sans-serif">sans-serif</option>
                                  <option value="serif">serif</option>
                                  <option value="monospace">monospace</option>
                                  <option value="Arial">Arial</option>
                                </select>
                                <select value={emailFontSize} onChange={(e) => { setEmailFontSize(e.target.value); execEmail("fontSize", e.target.value) }} className="h-8 w-[76px] rounded border border-[#D2DCE8] bg-white px-2 text-xs">
                                  <option value="1">8pt</option>
                                  <option value="2">10pt</option>
                                  <option value="3">12pt</option>
                                  <option value="4">14pt</option>
                                  <option value="5">18pt</option>
                                </select>
                                <button type="button" onClick={() => execEmail("bold")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Bold className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("italic")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Italic className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("underline")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Underline className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("strikeThrough")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Strikethrough className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("justifyLeft")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><AlignLeft className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("justifyCenter")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><AlignCenter className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("justifyRight")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><AlignRight className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("insertUnorderedList")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><List className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("insertOrderedList")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><ListOrdered className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("subscript")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Subscript className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("superscript")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Superscript className="h-4 w-4" /></button>
                                <button type="button" onClick={() => { const url = window.prompt("Enter URL"); if (url) execEmail("createLink", url) }} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Link2 className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("removeFormat")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Eraser className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("undo")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Undo2 className="h-4 w-4" /></button>
                                <button type="button" onClick={() => execEmail("redo")} className="inline-flex h-8 w-8 items-center justify-center rounded text-[#30465f] hover:bg-[#F3F7FC]"><Redo2 className="h-4 w-4" /></button>
                              </div>
                              <div
                                ref={emailEditorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => setEmailBody(e.currentTarget.innerHTML)}
                                className="min-h-[220px] w-full px-3 py-2 text-sm outline-none"
                                style={{ fontFamily: emailFontFamily }}
                                data-placeholder="Write your email..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#E7EDF5] px-4 py-3">
                          <Button
                            variant="ghost"
                            className="text-[#4D6075] hover:bg-[#EEF4FB]"
                            onClick={() => emailFileInputRef.current?.click()}
                          >
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attach
                          </Button>
                          <input
                            ref={emailFileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleEmailAttachmentUpload}
                            accept="*/*"
                          />
                          {emailAttachment ? (
                            <div className="max-w-[240px] truncate rounded border border-[#d2dce8] bg-[#f6f9fd] px-2 py-1 text-[11px] text-[#39506a]">
                              {emailAttachment.name}
                            </div>
                          ) : null}
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
