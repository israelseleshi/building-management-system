"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
  Phone,
  Video,
  Smile,
  Paperclip,
  Grid
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { getOrCreateConversation } from "@/lib/chat"

export default function ChatPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <ChatContent />
    </ProtectedRoute>
  )
}

type PersonItem = {
  id: string
  name: string
  avatar: string | null
  isOwner: boolean
  isOnline?: boolean
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
  const messagesChannelRef = useRef<any>(null)

  const subscribeToMessages = (conversationId: string, userId: string) => {
    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current)
    }

    const channel = supabase
      .channel(`messages-conv-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          const row = payload.new as any
          if (!row) return
          // Ignore our own inserts; we already added them optimistically
          if (row.sender_id === userId) return

          setMessages((prev) => [
            ...prev,
            {
              id: row.id as string,
              senderId: row.sender_id as string,
              message: row.content as string,
              timestamp: row.created_at
                ? new Date(row.created_at as string).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              isOwn: row.sender_id === userId,
            },
          ])
        }
      )
      .subscribe()

    messagesChannelRef.current = channel
  }

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: false
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: false
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: true
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: false
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user ?? null

      if (error) {
        const anyErr = error as any
        const hasUsefulDetails =
          typeof anyErr?.message === "string" && anyErr.message.trim().length > 0
        if (hasUsefulDetails) {
          console.error("Error loading current user", error)
        }
      }

      if (!user) {
        try {
          localStorage.removeItem("authToken")
          localStorage.removeItem("isAuthenticated")
          localStorage.removeItem("userRole")
          document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
          document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
          document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        } catch {
          // ignore
        }
        router.push("/auth/signin")
        return
      }

      setCurrentUserId(user.id)

      // Use leases to determine landlord and co-tenants for this tenant
      const { data: myLease, error: leaseError } = await supabase
        .from("leases")
        .select("id, landlord_id, property_id, status")
        .eq("tenant_id", user.id)
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .maybeSingle()

      // PGRST116 = no rows for maybeSingle; treat that as "no lease yet" not as an error
      if (leaseError && (leaseError as any).code !== "PGRST116") {
        console.error("Error loading tenant lease", leaseError)
        return
      }

      if (!myLease) {
        // No lease yet -> no known landlord / co-tenants to chat with
        setPeople([])
        return
      }

      const peopleList: PersonItem[] = []

      // 1) landlord at top based on lease.landlord_id
      const { data: landlord, error: landlordError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", myLease.landlord_id)
        .maybeSingle()

      if (landlordError) {
        console.error("Error loading landlord profile", landlordError)
      } else if (landlord) {
        peopleList.push({
          id: landlord.id as string,
          name: landlord.full_name || "Landlord",
          avatar:
            landlord.avatar_url ||
            (landlord.full_name
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  landlord.full_name
                )}`
              : null),
          isOwner: true,
          isOnline: false,
          unread: 0,
        })
      }

      // 2) other tenants who have leases with the same landlord (optionally same property)
      const { data: siblingLeases, error: siblingsError } = await supabase
        .from("leases")
        .select("tenant_id")
        .eq("landlord_id", myLease.landlord_id)
        .in("status", ["active", "pending"])
        .neq("tenant_id", user.id)

      // If there are simply no sibling leases, that's fine; only log real errors
      if (siblingsError && (siblingsError as any).code !== "PGRST116") {
        console.error("Error loading sibling leases", siblingsError)
      } else if (siblingLeases && siblingLeases.length > 0) {
        const tenantIds = siblingLeases.map((l: { tenant_id: string }) => l.tenant_id)

        const { data: otherTenants, error: tenantsError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", tenantIds)
          .order("full_name")

        if (tenantsError) {
          console.error("Error loading other tenants", tenantsError)
        } else {
          for (const t of otherTenants || []) {
            peopleList.push({
              id: t.id as string,
              name: t.full_name || "Tenant",
              avatar:
                t.avatar_url ||
                (t.full_name
                  ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      t.full_name
                    )}`
                  : null),
              isOwner: false,
              isOnline: false,
              unread: 0,
            })
          }
        }
      }

      setPeople(peopleList)

      if (peopleList.length > 0) {
        setSelectedPersonIndex(0)
        const conv = await getOrCreateConversation(user.id, peopleList[0].id)
        await loadMessagesForConversation(conv.id, user.id)
      }
    }

    const loadMessagesForConversation = async (
      conversationId: string,
      userId: string
    ) => {
      const { data: messageRows, error: msgError } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (msgError) {
        console.error("Error loading messages", msgError)
        return
      }

      const builtMessages: MessageItem[] = (messageRows || []).map((m: any) => ({
        id: m.id as string,
        senderId: m.sender_id as string,
        message: m.content as string,
        timestamp: m.created_at
          ? new Date(m.created_at as string).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        isOwn: m.sender_id === userId,
      }))

      setMessages(builtMessages)
      subscribeToMessages(conversationId, userId)
    }

    loadData()

    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current)
      }
    }
  }, [])

  const handlePersonClick = async (index: number) => {
    setSelectedPersonIndex(index)
    const person = people[index]
    if (!person || !currentUserId) return

    const conv = await getOrCreateConversation(currentUserId, person.id)

    const { data: messageRows, error: msgError } = await supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })

    if (msgError) {
      console.error("Error loading messages", msgError)
      return
    }

    const builtMessages: MessageItem[] = (messageRows || []).map((m: any) => ({
      id: m.id as string,
      senderId: m.sender_id as string,
      message: m.content as string,
      timestamp: m.created_at
        ? new Date(m.created_at as string).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      isOwn: m.sender_id === currentUserId,
    }))

    setMessages(builtMessages)
    subscribeToMessages(conv.id, currentUserId)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return

    const person = people[selectedPersonIndex]
    if (!person) return

    const conv = await getOrCreateConversation(currentUserId, person.id)
    if (!conv) return

    const content = newMessage.trim()
    setNewMessage("")

    const optimistic: MessageItem = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      message: content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    }
    setMessages((prev) => [...prev, optimistic])

    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conv.id,
      sender_id: currentUserId,
      content,
    })

    if (insertError) {
      console.error("Error sending message", insertError)
      // on error, we could rollback optimistic message, but for now just log
      return
    }

    await supabase
      .from("conversations")
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
        last_message_sender_id: currentUserId,
      })
      .eq("id", conv.id)
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

            {/* People List: landlord first, then other tenants */}
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
                      {person.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground text-sm">{person.name}</h3>
                        <span className="text-xs text-muted-foreground">{person.isOwner ? "Owner" : "Tenant"}</span>
                      </div>
                      {/* last message preview could be added by joining conversations */}
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
                    {/* Online status could be wired later */}
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
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 transition-all duration-200 hover:scale-110 hover:bg-white/50 active:scale-95">
                  <Paperclip className="w-4 h-4" />
                </Button>
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
