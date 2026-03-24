"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Filter,
  Send,
  CircleHelp,
  AlignLeft,
  Search,
} from "lucide-react"

type ApplicationStatus =
  | "Lease/Term Created"
  | "Approved"
  | "For Review"
  | "Pending"
  | "Rejected"
  | "Declined"

type GroupBy = "Not Grouped" | "Group by Property" | "Group by Status"
type ActiveTab = "Applications" | "Templates" | "Requests Sent"

interface ApplicationRecord {
  id: string
  status: ApplicationStatus
  applicantName: string
  property: string
  residentialScore: string
  annualIncome: string
  backgroundCheck: string
}

const theme = {
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
    applicantName: "Lily Smith",
    property: "Park Place Apartments, Park View Residences",
    residentialScore: "-",
    annualIncome: "-",
    backgroundCheck: "-",
  },
]

const tabs: ActiveTab[] = ["Applications", "Templates", "Requests Sent"]
const groupOptions: GroupBy[] = ["Not Grouped", "Group by Property", "Group by Status"]

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ApplicationsContent />
    </ProtectedRoute>
  )
}

function ApplicationsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>("Applications")
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | "All">("All")
  const [groupBy, setGroupBy] = useState<GroupBy>("Not Grouped")
  const [selectedFilter, setSelectedFilter] = useState("Filter...")

  const filteredApplications = useMemo(() => {
    return applicationData.filter((application) => {
      if (activeStatus !== "All" && application.status !== activeStatus) {
        return false
      }

      if (!searchQuery.trim()) {
        return true
      }

      const query = searchQuery.toLowerCase()
      return (
        application.applicantName.toLowerCase().includes(query) ||
        application.property.toLowerCase().includes(query) ||
        application.status.toLowerCase().includes(query)
      )
    })
  }, [activeStatus, searchQuery])

  const statusCards = useMemo(
    () => [
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

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={
        {
          backgroundColor: theme.background,
          ["--card" as string]: theme.card,
          ["--background" as string]: theme.background,
          ["--border" as string]: theme.line,
        } as React.CSSProperties
      }
    >
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
        onToggleSidebar={toggleSidebar}
        appBrandName="BMS"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
          <div className="flex min-h-[52px] items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Toggle dashboard navigation"
              >
                <AlignLeft className="h-[1.05rem] w-[1.05rem]" />
              </button>
              <div className="truncate text-[0.8rem] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.ink }}>
                Applications
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-72 rounded-xl border bg-white py-2 pl-10 pr-4 text-sm outline-none"
                  style={{ borderColor: "#1F3549", color: theme.ink }}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-[1.05rem] w-[1.05rem]" />
              </button>
            </div>
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
                  <div className="mb-4">
                    <ApplicationsTabs activeTab={activeTab} onChange={setActiveTab} />
                  </div>

                  <FilterBar
                    theme={theme}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    resultCount={filteredApplications.length}
                    totalCount={applicationData.length}
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
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Request Application
                  </Button>
                </div>
                <StatusSidebar
                  theme={theme}
                  cards={statusCards}
                  activeStatus={activeStatus}
                  onSelectStatus={setActiveStatus}
                />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function ApplicationsTabs({
  activeTab,
  onChange,
}: {
  activeTab: ActiveTab
  onChange: (tab: ActiveTab) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-8 border-b pb-1" style={{ borderColor: theme.line }}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative pb-3 text-[0.8rem] uppercase tracking-[0.045em] transition-colors ${isActive ? "font-semibold" : "font-medium"}`}
            style={{ color: isActive ? theme.tabActive : theme.muted }}
          >
            {tab}
            <span
              className={`absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundColor: theme.tabActive }}
            />
          </button>
        )
      })}
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
}: {
  theme: typeof theme
  selectedFilter: string
  onFilterChange: (value: string) => void
  groupBy: GroupBy
  onGroupByChange: (value: GroupBy) => void
  resultCount: number
  totalCount: number
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
      >
        <Send className="mr-2 h-4 w-4" />
        Request Application
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
  theme: typeof theme
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
              <TableHeaderCell label="Status" />
              <TableHeaderCell label="Applicant Name" />
              <TableHeaderCell label="Property" />
              <TableHeaderCell label="Residential Score" align="center" help />
              <TableHeaderCell label="Annual Income" align="center" help />
              <TableHeaderCell label="Background Check" align="center" />
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
}: {
  label: string
  align?: "left" | "center"
  help?: boolean
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
  theme,
  cards,
  activeStatus,
  onSelectStatus,
}: {
  theme: typeof theme
  cards: { label: ApplicationStatus; count: number; tone: string }[]
  activeStatus: ApplicationStatus | "All"
  onSelectStatus: (status: ApplicationStatus | "All") => void
}) {
  return (
    <div className="w-full space-y-3">
      {cards.map((card) => {
        const isActive = activeStatus === card.label
        return (
          <button
            key={card.label}
            type="button"
            onClick={() => onSelectStatus(isActive ? "All" : card.label)}
            className="flex h-[82px] w-full flex-col items-start justify-center rounded-md px-5 text-left transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: card.tone,
              boxShadow: isActive
                ? "0 10px 22px rgba(15, 23, 42, 0.14)"
                : "0 8px 18px rgba(15, 23, 42, 0.08)",
              color: "#FFFFFF",
            }}
          >
            <div className="text-[2rem] font-bold leading-none">{card.count}</div>
            <div className="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.03em]">
              {card.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}
