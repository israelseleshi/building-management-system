"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

type ApplicationStatus =
  | "Lease/Term Created"
  | "Approved"
  | "For Review"
  | "Pending"
  | "Rejected"
  | "Declined"

type GroupBy = "Not Grouped" | "Group by Property" | "Group by Status"
type ShareMethod = "email" | "url"
type SendCardPhase = "closed" | "start" | "rising" | "splash" | "sliding" | "open"

interface ApplicationRecord {
  id: string
  status: ApplicationStatus
  applicantName: string
  property: string
  residentialScore: string
  annualIncome: string
  backgroundCheck: string
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
    property: "Rayuma Building",
    residentialScore: "-",
    annualIncome: "-",
    backgroundCheck: "-",
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
  const [recipientEmails, setRecipientEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [customMessage, setCustomMessage] = useState("Please complete your rental application at your earliest convenience.")
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)

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
      { label: "Declined", count: 0, tone: theme.danger as string },
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

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const addEmailsFromInput = () => {
    const tokens = emailInput
      .split(/[,\s;]+/)
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean)

    if (tokens.length === 0) return

    setRecipientEmails((current) => {
      const next = [...current]
      for (const token of tokens) {
        if (isValidEmail(token) && !next.includes(token)) {
          next.push(token)
        }
      }
      return next
    })
    setEmailInput("")
  }

  useEffect(() => {
    if (!isSendApplicationOpen) {
      setSendCardPhase("closed")
      return
    }

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
    }
  }, [])

  const ownerSlug = "rayuma-building"
  const formSlugByTemplate: Record<string, string> = {
    "Standard Addis Rental Form": "standard-addis-rental-form",
    "Commercial Tenant Form": "commercial-tenant-form",
    "Shared Housing Form": "shared-housing-form",
  }
  const selectedFormSlug = formSlugByTemplate[selectedTemplate] || "standard-addis-rental-form"
  const generatedUrl = `${origin || "http://localhost:3000"}/apply/${ownerSlug}/${selectedFormSlug}`

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
                    onRowClick={(id) => console.log("Open application:", id)}
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
                      Via Email
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
                          <select
                            value={selectedTemplate}
                            onChange={(event) => setSelectedTemplate(event.target.value)}
                            className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none"
                            style={{ borderColor: theme.line, color: theme.ink }}
                          >
                            <option>Standard Addis Rental Form</option>
                            <option>Commercial Tenant Form</option>
                            <option>Shared Housing Form</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>
                            Share Via Email (Multiple)
                          </label>
                          <div className="rounded-md border bg-white p-2" style={{ borderColor: theme.line }}>
                            {recipientEmails.length > 0 && (
                              <div className="mb-2 flex flex-wrap gap-1.5">
                                {recipientEmails.map((email) => (
                                  <span
                                    key={email}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#E8F2FF] px-2 py-1 text-xs font-medium"
                                    style={{ color: theme.primary }}
                                  >
                                    {email}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRecipientEmails((current) =>
                                          current.filter((item) => item !== email)
                                        )
                                      }
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
                            />
                          </div>
                          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                            You can paste multiple emails separated by comma or space.
                          </p>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>Ethio Telecom Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="+2519..."
                            value={recipientPhone}
                            onChange={(event) => setRecipientPhone(event.target.value)}
                            className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none"
                            style={{ borderColor: theme.line, color: theme.ink }}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>Message</label>
                          <textarea
                            value={customMessage}
                            onChange={(event) => setCustomMessage(event.target.value)}
                            className="min-h-[92px] w-full rounded-md border bg-white px-3 py-2 text-sm outline-none"
                            style={{ borderColor: theme.line, color: theme.ink }}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            className="h-9 px-5"
                            style={{ backgroundColor: theme.primary, color: "#fff" }}
                            disabled={recipientEmails.length === 0}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Application ({recipientEmails.length})
                          </Button>
                        </div>
                      </div>
                    )}

                    {shareMethod === "url" && (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.muted }}>Default Settings</p>
                          <div className="mt-1 text-sm font-semibold" style={{ color: theme.ink }}>Application Only</div>
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
                          <p className="mt-2 text-xs" style={{ color: theme.muted }}>
                            Share this URL publicly on your building page so applicants can apply directly.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="border-l p-4" style={{ borderColor: theme.line, backgroundColor: "#F7FAFD" }}>
                    <div className="rounded-md border p-3" style={{ borderColor: theme.line, backgroundColor: "#fff" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>SMART BMS</p>
                      <div className="mt-2 h-24 rounded-md border bg-[#EAF3FB]" style={{ borderColor: theme.line }} />
                    </div>
                    <div className="mt-4 text-xs leading-5" style={{ color: theme.muted }}>
                      <p className="mb-2 font-semibold uppercase tracking-wide" style={{ color: theme.ink }}>How It Works</p>
                      <p>1. Share by email or URL.</p>
                      <p>2. Applicant submits the form online.</p>
                      <p>3. You review applications in this dashboard.</p>
                      <p>4. Optional Ethiopian contact channels can be added for reach.</p>
                    </div>
                    {shareMethod === "url" && (
                      <div className="mt-4 rounded-md border p-3 text-xs" style={{ borderColor: theme.line, backgroundColor: "#fff", color: theme.muted }}>
                        <div className="mb-1 flex items-center gap-1 font-semibold" style={{ color: theme.ink }}>
                          <Link2 className="h-3.5 w-3.5" />
                          Public Link Tip
                        </div>
                        Add this URL to your property page button: "Apply Now".
                      </div>
                    )}
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
    Declined: { backgroundColor: "#FDECEA", color: theme.danger },
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
              <TableHeaderCell label="Property" theme={theme} />
              <TableHeaderCell label="Residential Score" align="center" help theme={theme} />
              <TableHeaderCell label="Annual Income" align="center" help theme={theme} />
              <TableHeaderCell label="Background Check" align="center" theme={theme} />
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
                  <td className="w-[25%] truncate px-4 py-3 text-[0.82rem]" style={{ color: theme.ink }}>
                    {application.property}
                  </td>
                  <td className="w-[14%] px-4 py-3 text-center text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.residentialScore}
                  </td>
                  <td className="w-[14%] px-4 py-3 text-center text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.annualIncome}
                  </td>
                  <td className="w-[16%] px-4 py-3 text-center text-[0.82rem] font-medium" style={{ color: theme.ink }}>
                    {application.backgroundCheck}
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
