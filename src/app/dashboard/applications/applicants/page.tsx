"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronDown,
  Filter,
  Send,
  CircleHelp,
  Link2,
  Copy,
  Check,
  X,
  Bell,
  Menu,
  Mail,
  Smartphone,
  Info,
} from "lucide-react"

type ApplicationStatus =
  | "Lease/Term Created"
  | "Approved"
  | "For Review"
  | "Pending"
  | "Rejected"

type GroupBy = "Not Grouped" | "Group by Property" | "Group by Status"
type ShareMethod = "email" | "url"
type ContactChannel = "sms" | "email"
type PhoneProvider = "+2519" | "+2517"
type SendCardPhase = "closed" | "start" | "rising" | "splash" | "sliding" | "open"

interface ApplicationRecord {
  id: string
  status: ApplicationStatus
  applicantName: string
  unit: string
  idVerification: "Verified" | "Pending" | "Not Submitted"
  monthlyIncome: string
  employment: "Employed" | "Self-employed" | "Business Owner" | "Unemployed"
}

const theme: Record<string, string> = {
  primary: "#3498DB",
  success: "#4DB6A1",
  warning: "#F5A24E",
  danger: "#E15949",
  neutral: "#B7C6D1",
  background: "#E9EDF3",
  card: "#FFFFFF",
  ink: "#1F3549",
  muted: "#7B8C9D",
  line: "#D9E1E8",
  tableHead: "#F5F8FB",
  tabActive: "#3096DA",
}

const applicationData: ApplicationRecord[] = [
  {
    id: "app_001",
    status: "For Review",
    applicantName: "Mehret Getachew",
    unit: "A-101",
    idVerification: "Verified",
    monthlyIncome: "15,000 - 25,000",
    employment: "Employed",
  },
]

const groupOptions: GroupBy[] = ["Not Grouped", "Group by Property", "Group by Status"]

export default function ApplicantsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ApplicantsContent />
    </ProtectedRoute>
  )
}

function ApplicantsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | "All">("All")
  const [groupBy, setGroupBy] = useState<GroupBy>("Not Grouped")
  const [selectedFilter, setSelectedFilter] = useState("Filter...")
  const [isSendApplicationOpen, setIsSendApplicationOpen] = useState(false)
  const [sendCardPhase, setSendCardPhase] = useState<SendCardPhase>("closed")
  const [shareMethod, setShareMethod] = useState<ShareMethod>("email")
  const [selectedTemplate, setSelectedTemplate] = useState("Standard Addis Rental Form")
  const [defaultTemplate, setDefaultTemplate] = useState("Standard Addis Rental Form")
  const [defaultTemplateSlug, setDefaultTemplateSlug] = useState("standard-addis-rental-form")
  const [contactModes, setContactModes] = useState<Record<ContactChannel, boolean>>({
    sms: true,
    email: false,
  })
  const [phoneProvider, setPhoneProvider] = useState<PhoneProvider>("+2519")
  const [phoneRecipients, setPhoneRecipients] = useState<string[]>([])
  const [emailRecipients, setEmailRecipients] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("+2519")
  const [emailInput, setEmailInput] = useState("")
  const [customMessage, setCustomMessage] = useState("Please complete your rental application at your earliest convenience.")
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState("")

  const filteredApplications = useMemo(() => {
    return applicationData.filter((application) => {
      if (activeStatus !== "All" && application.status !== activeStatus) {
        return false
      }
      return true
    })
  }, [activeStatus])

  const statusCards = useMemo(
    (): { label: ApplicationStatus; count: number; tone: string }[] => [
      { label: "Lease/Term Created", count: 0, tone: theme.neutral as string },
      { label: "Approved", count: 1, tone: theme.success as string },
      { label: "For Review", count: 1, tone: theme.primary as string },
      { label: "Pending", count: 0, tone: theme.warning as string },
      { label: "Rejected", count: 3, tone: "#B6BCC5" },
    ],
    []
  )

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isValidPhone = (value: string) => /^\+?251(9|7)\d{8}$/.test(value.replace(/\s+/g, ""))

  const addRecipientsFromInput = (
    input: string,
    existing: string[],
    validate: (value: string) => boolean
  ) => {
    const tokens = input
      .split(/[,\s;]+/)
      .map((token) => token.trim())
      .filter(Boolean)

    if (tokens.length === 0) return { next: existing, reachedLimit: false }

    const next = [...existing]
    for (const token of tokens) {
      if (next.length >= 4) return { next, reachedLimit: true }
      if (validate(token) && !next.includes(token)) next.push(token)
    }
    return { next, reachedLimit: false }
  }

  const addEmailsFromInput = () => {
    const { next, reachedLimit } = addRecipientsFromInput(emailInput, emailRecipients, isValidEmail)
    setEmailRecipients(next)
    setEmailInput("")
    if (reachedLimit || next.length >= 4) setShareError("Email recipient limit reached (4). Share to these 4 first, then come back to send more.")
  }

  const addPhonesFromInput = () => {
    const { next, reachedLimit } = addRecipientsFromInput(phoneInput, phoneRecipients, isValidPhone)
    setPhoneRecipients(next)
    setPhoneInput(phoneProvider)
    if (reachedLimit || next.length >= 4) {
      setShareError("Phone recipient limit reached (4). Share to these 4 first, then come back to send more.")
    }
  }

  useEffect(() => {
    if (!isSendApplicationOpen) {
      setSendCardPhase("closed")
      return
    }
    setShareError("")

    setSendCardPhase("start")
    const raf = requestAnimationFrame(() => setSendCardPhase("rising"))
    const toSplash = setTimeout(() => setSendCardPhase("splash"), 520)
    const toSliding = setTimeout(() => setSendCardPhase("sliding"), 1300)
    const toOpen = setTimeout(() => setSendCardPhase("open"), 1360)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(toSplash)
      clearTimeout(toSliding)
      clearTimeout(toOpen)
    }
  }, [isSendApplicationOpen])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
      const savedName = window.localStorage.getItem("bms_default_form_name")
      const savedSlug = window.localStorage.getItem("bms_default_form_slug")
      if (savedName) {
        setDefaultTemplate(savedName)
      }
      if (savedSlug) {
        setDefaultTemplateSlug(savedSlug)
      }
    }
  }, [])

  const ownerSlug = "rayuma-building"
  const formSlugByTemplate: Record<string, string> = {
    "Standard Addis Rental Form": "standard-addis-rental-form",
    "Commercial Tenant Form": "commercial-tenant-form",
    "Shared Housing Form": "shared-housing-form",
  }
  const selectedFormSlug = formSlugByTemplate[selectedTemplate] || "standard-addis-rental-form"
  const generatedFormSlug = shareMethod === "url" ? defaultTemplateSlug : selectedFormSlug
  const generatedUrl = `${origin || "http://localhost:3000"}/apply/${ownerSlug}/${generatedFormSlug}`
  const canSendViaChannel =
    (contactModes.sms && phoneRecipients.length > 0) ||
    (contactModes.email && emailRecipients.length > 0)

  const handleSendApplication = () => {
    if (!canSendViaChannel) {
      setShareError("Add at least one phone number or email before sending.")
      return
    }
    setShareError("")
    setIsSendApplicationOpen(false)
  }

  const sendCardMotionClass =
    sendCardPhase === "start" ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
  const sendSplashVisible = sendCardPhase === "rising" || sendCardPhase === "splash"
  const sendContentMotionClass =
    sendCardPhase === "sliding"
      ? "translate-x-20 opacity-0"
      : sendCardPhase === "open"
      ? "translate-x-0 opacity-100"
      : "translate-x-0 opacity-0"

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{
        backgroundColor: theme.background,
        ["--card" as string]: theme.card,
        ["--background" as string]: theme.background,
        ["--border" as string]: theme.line,
      } as React.CSSProperties}
    >
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
        onToggleSidebar={toggleSidebar}
        appBrandName="BMS"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[#D5DDE7] bg-white">
          <div className="flex h-14 items-center justify-between px-5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4A5D73] hover:bg-[#EFF4FA]"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="text-[1.05rem] font-semibold uppercase tracking-[0.08em] text-[#1F3549]">Applicant&apos;s</div>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4A5D73] hover:bg-[#EFF4FA]"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-6"
          style={{
            background:
              "linear-gradient(180deg, #E9EDF3 0%, #E6EBF2 42%, #E3E8EF 100%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1420px]">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
              <section className="min-w-0">
                <div
                  className="rounded-xl border px-5 py-4 shadow-[0_6px_18px_rgba(94,118,145,0.05)] md:px-6"
                  style={{ backgroundColor: theme.card, borderColor: theme.line }}
                >
                  <FilterBar
                    theme={theme}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    resultCount={filteredApplications.length}
                    totalCount={applicationData.length}
                    onSendApplication={() => setIsSendApplicationOpen(true)}
                  />

                  <ApplicationsTable
                    applications={filteredApplications}
                    theme={theme}
                    onRowClick={(id) => router.push(`/dashboard/applications/applicants/${id}`)}
                  />
                </div>
              </section>

              <aside className="hidden xl:block">
                <div className="mb-4">
                  <Button
                    className="h-11 w-full rounded-md px-5 text-[0.85rem] font-medium shadow-sm"
                    style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    onClick={() => setIsSendApplicationOpen(true)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Application
                  </Button>
                </div>
                <StatusSidebar
                  cards={statusCards}
                  activeStatus={activeStatus}
                  onSelectStatus={setActiveStatus}
                />
              </aside>
            </div>
          </div>
        </main>

        {isSendApplicationOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/45">
            <div className={`absolute right-6 top-8 flex h-[min(690px,calc(100vh-64px))] w-[min(980px,calc(100vw-260px))] overflow-hidden rounded-2xl border bg-white shadow-[0_24px_80px_rgba(18,30,53,0.35)] transition-all duration-700 ${sendCardMotionClass}`}>
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 ${sendSplashVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                style={{ backgroundColor: "#0A2A43" }}
              >
                <div className="text-center text-white transition-all duration-500" style={{ transform: sendCardPhase === "rising" ? "translateY(40px)" : "translateY(0)" }}>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/70">Launching</div>
                  <div className="mt-2 text-4xl font-bold tracking-tight">SMART BMS</div>
                </div>
              </div>

              <div className={`flex min-w-0 flex-1 flex-col transition-all duration-500 ${sendContentMotionClass}`}>
                <div className="grid min-h-0 flex-1 grid-cols-[200px_minmax(0,1fr)_250px]">
                  <aside className="border-r p-3" style={{ borderColor: theme.line, backgroundColor: "#0A2A43" }}>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Share Method</div>
                    <button
                      type="button"
                      onClick={() => setShareMethod("email")}
                      className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${shareMethod === "email" ? "text-white" : "text-white/75 hover:text-white"}`}
                      style={{ backgroundColor: shareMethod === "email" ? "#113B5E" : "transparent" }}
                    >
                      Via Email / SMS
                      <ChevronDown className={`h-3.5 w-3.5 ${shareMethod === "email" ? "rotate-[-90deg]" : "rotate-[-90deg] opacity-0"}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareMethod("url")}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${shareMethod === "url" ? "text-white" : "text-white/75 hover:text-white"}`}
                      style={{ backgroundColor: shareMethod === "url" ? "#113B5E" : "transparent" }}
                    >
                      Via URL
                      <ChevronDown className={`h-3.5 w-3.5 ${shareMethod === "url" ? "rotate-[-90deg]" : "rotate-[-90deg] opacity-0"}`} />
                    </button>
                  </aside>

                  <div className="min-h-0 overflow-y-auto p-5">
                    <div className="mb-4 flex items-center justify-between rounded-md border bg-white px-4 py-3" style={{ borderColor: theme.line }}>
                      <h3 className="text-sm font-semibold" style={{ color: theme.ink }}>How would you like to share your application?</h3>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => setIsSendApplicationOpen(false)}
                        aria-label="Close send application modal"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {shareMethod === "email" && (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>Select Template</label>
                          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger 
                              className="h-10 w-full border rounded-md bg-white px-3 pr-10 text-sm"
                              style={{ borderColor: theme.line, color: theme.ink }}
                            >
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent style={{ borderColor: theme.line }}>
                              <SelectItem value="Standard Addis Rental Form">Standard Addis Rental Form</SelectItem>
                              <SelectItem value="Commercial Tenant Form">Commercial Tenant Form</SelectItem>
                              <SelectItem value="Shared Housing Form">Shared Housing Form</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                            Email/SMS lets you choose the exact template applicants should complete.
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>
                            Delivery Channels
                          </p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[#E9EDF3]" style={{ borderColor: theme.line, color: theme.ink }}>
                              <input
                                type="checkbox"
                                checked={contactModes.sms}
                                onChange={(event) => setContactModes((prev) => ({ ...prev, sms: event.target.checked }))}
                              />
                              <Smartphone className="h-4 w-4" />
                              SMS
                            </label>
                            <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-[#E9EDF3]" style={{ borderColor: theme.line, color: theme.ink }}>
                              <input
                                type="checkbox"
                                checked={contactModes.email}
                                onChange={(event) => setContactModes((prev) => ({ ...prev, email: event.target.checked }))}
                              />
                              <Mail className="h-4 w-4" />
                              Email
                            </label>
                          </div>
                          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                            At least one channel with one recipient is required before sending.
                          </p>
                        </div>

                        {contactModes.sms && (
                          <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>
                              Share Via SMS (Up to 4)
                            </label>
                            <div className="rounded-md border bg-white p-2" style={{ borderColor: theme.line }}>
                              {phoneRecipients.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                  {phoneRecipients.map((phone) => (
                                    <span
                                      key={phone}
                                      className="inline-flex items-center gap-1 rounded-full bg-[#E8F2FF] px-2 py-1 text-xs font-medium"
                                      style={{ color: theme.primary }}
                                    >
                                      {phone}
                                      <button
                                        type="button"
                                        onClick={() => setPhoneRecipients((current) => current.filter((item) => item !== phone))}
                                        className="rounded-full p-0.5 hover:bg-white"
                                        aria-label={`Remove ${phone}`}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mb-2">
                                <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-wide" style={{ color: theme.muted }}>
                                  Provider
                                </label>
                                <Select value={phoneProvider} onValueChange={(value) => {
                                  const provider = value as PhoneProvider
                                  setPhoneProvider(provider)
                                  if (phoneInput === "+2519" || phoneInput === "+2517" || phoneRecipients.length >= 4) {
                                    setPhoneInput(provider)
                                  }
                                }}>
                                  <SelectTrigger 
                                    className="h-9 w-full border rounded-md bg-white px-3 pr-10 text-xs"
                                    style={{ borderColor: theme.line, color: theme.ink }}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="+2519">Ethio Telecom (+2519)</SelectItem>
                                    <SelectItem value="+2517">Safaricom (+2517)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <input
                                type="text"
                                placeholder={`Type ${phoneProvider}... then Enter or comma`}
                                value={phoneInput}
                                onChange={(event) => {
                                  const raw = event.target.value.replace(/\s+/g, "")
                                  if (!raw) {
                                    setPhoneInput(phoneProvider)
                                    return
                                  }
                                  if (!raw.startsWith(phoneProvider)) {
                                    const digits = raw.replace(/[^\d]/g, "")
                                    const stripped = digits.replace(/^251[97]/, "").replace(/^[97]/, "")
                                    setPhoneInput(`${phoneProvider}${stripped}`)
                                    return
                                  }
                                  setPhoneInput(raw)
                                }}
                                onBlur={addPhonesFromInput}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === ",") {
                                    event.preventDefault()
                                    addPhonesFromInput()
                                  }
                                }}
                                className="h-9 w-full border-0 bg-transparent px-1 text-sm outline-none"
                                style={{ color: theme.ink }}
                                disabled={phoneRecipients.length >= 4}
                              />
                            </div>
                            <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                              Use comma/space to add multiple numbers (max 4).
                            </p>
                          </div>
                        )}

                        {contactModes.email && (
                          <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>
                              Share Via Email (Up to 4)
                            </label>
                            <div className="rounded-md border bg-white p-2" style={{ borderColor: theme.line }}>
                              {emailRecipients.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                  {emailRecipients.map((email) => (
                                    <span
                                      key={email}
                                      className="inline-flex items-center gap-1 rounded-full bg-[#E8F2FF] px-2 py-1 text-xs font-medium"
                                      style={{ color: theme.primary }}
                                    >
                                      {email}
                                      <button
                                        type="button"
                                        onClick={() => setEmailRecipients((current) => current.filter((item) => item !== email))}
                                        className="rounded-full p-0.5 hover:bg-white"
                                        aria-label={`Remove ${email}`}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <input
                                type="text"
                                placeholder="Type email then press Enter or comma"
                                value={emailInput}
                                onChange={(event) => setEmailInput(event.target.value)}
                                onBlur={addEmailsFromInput}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === ",") {
                                    event.preventDefault()
                                    addEmailsFromInput()
                                  }
                                }}
                                className="h-9 w-full border-0 bg-transparent px-1 text-sm outline-none"
                                style={{ color: theme.ink }}
                                disabled={emailRecipients.length >= 4}
                              />
                            </div>
                            <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                              Use comma/space to add multiple emails (max 4).
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>Message</label>
                          <textarea
                            value={customMessage}
                            onChange={(event) => setCustomMessage(event.target.value)}
                            maxLength={500}
                            className="min-h-[92px] w-full rounded-md border bg-white px-3 py-2 text-sm outline-none"
                            style={{ borderColor: theme.line, color: theme.ink, resize: "none" }}
                          />
                          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                            This description is specific to Email/SMS sharing ({customMessage.length}/500).
                          </p>
                        </div>

                        {shareError ? (
                          <div className="rounded-md border px-3 py-2 text-xs" style={{ borderColor: "#F5C1C1", color: "#B93838", backgroundColor: "#FFF6F6" }}>
                            {shareError}
                          </div>
                        ) : null}

                        <div className="flex justify-end">
                          <Button
                            className="h-9 px-5"
                            style={{ backgroundColor: theme.primary, color: "#fff" }}
                            disabled={!canSendViaChannel}
                            onClick={handleSendApplication}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Application
                          </Button>
                        </div>
                      </div>
                    )}

                    {shareMethod === "url" && (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.muted }}>Default Settings</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="text-sm font-semibold" style={{ color: theme.ink }}>{defaultTemplate}</div>
                            <button
                              type="button"
                              className="text-xs font-semibold underline"
                              style={{ color: theme.primary }}
                              onClick={() => router.push("/dashboard/applications/forms?focusDefault=1")}
                            >
                              Change Default
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>Share Via URL</label>
                          <div className="flex rounded-md border" style={{ borderColor: theme.line }}>
                            <input
                              type="text"
                              value={generatedUrl}
                              readOnly
                              className="h-10 flex-1 bg-white px-3 text-sm outline-none"
                              style={{ color: theme.ink }}
                            />
                            <button
                              type="button"
                              onClick={handleCopyUrl}
                              className="inline-flex h-10 items-center gap-1 border-l px-3 text-sm font-medium"
                              style={{ borderColor: theme.line, color: theme.primary }}
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              {copied ? "Copied" : "Copy"}
                            </button>
                            <a
                              href={generatedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 items-center gap-1 border-l px-3 text-sm font-medium"
                              style={{ borderColor: theme.line, color: theme.primary }}
                            >
                              <Link2 className="h-4 w-4" />
                              Open
                            </a>
                          </div>
                          <div className="mt-2 rounded-md border bg-[#F8FBFF] px-3 py-2 text-xs leading-5" style={{ borderColor: "#D5E7F7", color: theme.muted }}>
                            <div className="mb-1 inline-flex items-center gap-1 font-semibold" style={{ color: theme.ink }}>
                              <Info className="h-3.5 w-3.5" />
                              URL Usage
                            </div>
                            <p>
                              The above URL always directs the applicant to your Default Application Template. To send a specific template, use Email/SMS and select it there.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="border-l p-4" style={{ borderColor: theme.line, backgroundColor: "#F7FAFD" }}>
                    <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: theme.line }}>
                      <div className="px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>SMART BMS</p>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
                        alt="Property preview"
                        className="h-28 w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 text-xs leading-5" style={{ color: theme.muted }}>
                      <p className="mb-2 font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>How It Works</p>
                      {shareMethod === "url" ? (
                        <>
                          <p>1. Copy the URL and share it on your listing or website.</p>
                          <p>2. Applicants open the link and fill your default template.</p>
                          <p>3. You receive and review submissions in the Applicants dashboard.</p>
                        </>
                      ) : (
                        <>
                          <p>1. Select a template and choose SMS and/or Email channels.</p>
                          <p>2. Add recipients (up to 4 per channel).</p>
                          <p>3. Applicants receive the link with your message and apply.</p>
                        </>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterBar({
  theme,
  selectedFilter,
  onFilterChange,
  groupBy,
  onGroupByChange,
  resultCount,
  totalCount,
  onSendApplication,
}: {
  theme: Record<string, string>
  selectedFilter: string
  onFilterChange: (value: string) => void
  groupBy: GroupBy
  onGroupByChange: (value: GroupBy) => void
  resultCount: number
  totalCount: number
  onSendApplication: () => void
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => onFilterChange(selectedFilter === "Filter..." ? "All Filters" : "Filter...")}
          className="inline-flex h-10 min-w-[180px] items-center justify-between rounded-md border bg-white px-4 text-[0.82rem] font-medium transition-colors hover:bg-slate-50"
          style={{ borderColor: theme.line, color: theme.muted }}
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selectedFilter}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <div className="relative">
          <select
            value={groupBy}
            onChange={(event) => onGroupByChange(event.target.value as GroupBy)}
            className="h-10 min-w-[200px] appearance-none rounded-md border bg-white px-4 pr-10 text-[0.82rem] font-medium outline-none"
            style={{ borderColor: theme.line, color: theme.ink }}
          >
            {groupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="text-[0.82rem] font-medium" style={{ color: theme.muted }}>
          Showing {resultCount} of {totalCount}
        </div>
      </div>

      <Button
        className="h-10 rounded-md px-5 text-[0.82rem] font-medium shadow-sm xl:hidden"
        style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
        onClick={onSendApplication}
      >
        <Send className="mr-2 h-4 w-4" />
        Send Application
      </Button>
    </div>
  )
}

function ApplicationsTable({
  applications,
  theme,
  onRowClick,
}: {
  applications: ApplicationRecord[]
  theme: Record<string, string>
  onRowClick: (id: string) => void
}) {
  const badgeStyles: Record<ApplicationStatus, { backgroundColor: string; color: string }> = {
    "For Review": { backgroundColor: "#E8F2FF", color: theme.primary },
    Approved: { backgroundColor: "#EAF7F1", color: theme.success },
    Pending: { backgroundColor: "#FFF2E3", color: theme.warning },
    Rejected: { backgroundColor: "#F1F3F5", color: "#6C7A89" },
    "Lease/Term Created": { backgroundColor: "#EEF2F6", color: "#7D8A99" },
  }

  return (
    <div className="overflow-hidden rounded-xl border shadow-[0_8px_18px_rgba(94,118,145,0.06)]" style={{ borderColor: theme.line }}>
      <div className="overflow-x-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead style={{ backgroundColor: theme.tableHead }}>
            <tr className="border-b" style={{ borderColor: theme.line }}>
              <TableHeaderCell label="Status" theme={theme} />
              <TableHeaderCell label="Applicant Name" theme={theme} />
              <TableHeaderCell label="Unit" theme={theme} />
              <TableHeaderCell label="ID Verification" align="center" help theme={theme} />
              <TableHeaderCell label="Monthly Income (ETB)" align="center" help theme={theme} />
              <TableHeaderCell label="Employment" align="center" theme={theme} />
            </tr>
          </thead>
          <tbody style={{ backgroundColor: theme.card }}>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-[0.82rem]" style={{ color: theme.muted }}>
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr
                  key={application.id}
                  onClick={() => onRowClick(application.id)}
                  className="cursor-pointer border-b transition-colors hover:bg-slate-50"
                  style={{ borderColor: theme.line }}
                >
                  <td className="w-[13%] px-4 py-3 text-left">
                    <span
                      className="inline-flex rounded-full px-4 py-1 text-[0.72rem] font-semibold"
                      style={badgeStyles[application.status]}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="w-[18%] px-4 py-3 text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.applicantName}
                  </td>
                  <td className="w-[15%] px-4 py-3 text-[0.82rem]" style={{ color: theme.ink }}>
                    {application.unit}
                  </td>
                  <td className="w-[14%] px-4 py-3 text-center">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-[0.72rem] font-medium"
                      style={{
                        backgroundColor: application.idVerification === "Verified" ? "#EAF7F1" : application.idVerification === "Pending" ? "#FFF2E3" : "#F1F3F5",
                        color: application.idVerification === "Verified" ? theme.success : application.idVerification === "Pending" ? theme.warning : theme.muted,
                      }}
                    >
                      {application.idVerification}
                    </span>
                  </td>
                  <td className="w-[18%] px-4 py-3 text-center text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.monthlyIncome}
                  </td>
                  <td className="w-[16%] px-4 py-3 text-center text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.employment}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableHeaderCell({
  label,
  align = "left",
  help = false,
  theme,
}: {
  label: string
  align?: "left" | "center"
  help?: boolean
  theme: Record<string, string>
}) {
  return (
    <th
      className={`px-4 py-3 text-[0.72rem] font-semibold ${align === "center" ? "text-center" : "text-left"}`}
      style={{ color: theme.muted }}
    >
      <span className={`inline-flex items-center gap-1 ${align === "center" ? "justify-center" : ""}`}>
        {label}
        {help && <CircleHelp className="h-3.5 w-3.5" />}
      </span>
    </th>
  )
}

function StatusSidebar({
  cards,
  activeStatus,
  onSelectStatus,
}: {
  cards: { label: ApplicationStatus; count: number; tone: string }[]
  activeStatus: ApplicationStatus | "All"
  onSelectStatus: (status: ApplicationStatus | "All") => void
}) {
  return (
    <div className="w-full space-y-2">
      {cards.map((card) => {
        const isActive = activeStatus === card.label
        return (
          <button
            key={card.label}
            type="button"
            onClick={() => onSelectStatus(isActive ? "All" : card.label)}
            className="flex h-[58px] w-full flex-col items-start justify-center overflow-hidden rounded-md px-3.5 text-left transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: card.tone,
              boxShadow: isActive
                ? "0 10px 22px rgba(15, 23, 42, 0.14)"
                : "0 8px 18px rgba(15, 23, 42, 0.08)",
              color: "#FFFFFF",
            }}
          >
            <div className="text-[1.2rem] font-bold leading-none">{card.count}</div>
            <div className="mt-0.5 truncate text-[0.56rem] font-medium uppercase tracking-[0.03em]">
              {card.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}
