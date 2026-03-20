"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  FileDown,
  Fingerprint,
  RefreshCw,
  Settings2,
  ShieldAlert,
  Store,
  Wrench,
} from "lucide-react"
import { pdf, Document, Page, StyleSheet, Text as PdfText, View } from "@react-pdf/renderer"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heading, MutedText } from "@/components/ui/typography"
import { useToast } from "@/hooks/use-toast"
import type {
  AttendanceConfig,
  AttendanceRecord,
  AttendanceStatus,
  DeviceLog,
  ExceptionRecord,
  ManualAdjustment,
  Shop,
  WarningAction,
} from "@/lib/attendance"

const pdfStyles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  heading: { fontSize: 18, marginBottom: 12 },
  row: { flexDirection: "row", borderBottom: "1 solid #D9C2A7", paddingVertical: 6 },
  shop: { width: "30%" },
  cell: { width: "17.5%" },
})

const statusBadgeClasses: Record<AttendanceStatus, string> = {
  "On Time": "border-green-200 bg-green-100 text-green-800",
  "Slight Late": "border-amber-200 bg-amber-100 text-amber-800",
  Late: "border-yellow-200 bg-yellow-100 text-yellow-800",
  Closed: "border-red-200 bg-red-100 text-red-800",
}

type SortKey = "shopName" | "status" | "openingTime" | "actualCheckInTime" | "delayMinutes"

const tabItems = [
  { value: "shop-records", label: "Attendance Records", icon: Store },
  { value: "exception-records", label: "Attendance Issues", icon: ShieldAlert },
  { value: "device-logs", label: "Raw Device Logs", icon: Fingerprint },
  { value: "manual-adjustments", label: "Manual Adjustments", icon: Wrench },
  { value: "configurations", label: "Configurations", icon: Settings2 },
]

const warningTemplates = [
  {
    id: "warning-late-first",
    name: "Late Opening Notice",
    body: "Dear {businessName}, your business in unit {unit} opened {delay} minutes late on {date}. Please ensure timely opening going forward.",
  },
  {
    id: "warning-late-followup",
    name: "Late Opening Follow-up",
    body: "This is a follow-up notice for {businessName}. We recorded repeated late opening activity for unit {unit} on {date}. Please review your staffing and access arrangements.",
  },
  {
    id: "warning-closed",
    name: "Not Opened Notice",
    body: "Dear {businessName}, no opening check-in was recorded for unit {unit} on {date}. Contact management immediately if there was a technical or operational issue.",
  },
] as const

type WarningTemplateId = (typeof warningTemplates)[number]["id"]

export default function AttendancePage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <AttendanceContent />
    </ProtectedRoute>
  )
}

function AttendanceContent() {
  const { toast } = useToast()
  const today = dayjs().format("YYYY-MM-DD")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("shop-records")
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [showActualLogs, setShowActualLogs] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("delayMinutes")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [shops, setShops] = useState<Shop[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([])
  const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>([])
  const [manualAdjustments, setManualAdjustments] = useState<ManualAdjustment[]>([])
  const [warningActions, setWarningActions] = useState<WarningAction[]>([])
  const [summary, setSummary] = useState({ totalShops: 0, onTime: 0, late: 0, closed: 0 })
  const [config, setConfig] = useState<AttendanceConfig | null>(null)
  const [overrideSearch, setOverrideSearch] = useState("")
  const [overrideUnit, setOverrideUnit] = useState("all")
  const [simulationShopId, setSimulationShopId] = useState("")
  const [isWarningDrawerOpen, setIsWarningDrawerOpen] = useState(false)
  const [warningDraft, setWarningDraft] = useState<{
    issueKey: string
    templateId: WarningTemplateId
    channel: "email" | "sms" | "in-app"
    recipient: string
  }>({
    issueKey: "",
    templateId: warningTemplates[0].id,
    channel: "email" as "email" | "sms" | "in-app",
    recipient: "",
  })
  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today,
    shopId: "all",
    unit: "all",
    location: "all",
    status: "all",
    severity: "all",
    deviceId: "all",
    userId: "",
    logDate: today,
  })
  const [manualForm, setManualForm] = useState({
    shopId: "",
    date: today,
    newStatus: "On Time" as AttendanceStatus,
    notes: "",
  })

  useEffect(() => {
    void (async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchAttendance(),
          fetchExceptions(),
          fetchDeviceLogs(),
          fetchManualAdjustments(),
          fetchConfig(),
          fetchWarnings(),
        ])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    void Promise.all([fetchAttendance(), fetchExceptions()])
  }, [filters.startDate, filters.endDate, filters.shopId, filters.unit, filters.location, filters.status])

  useEffect(() => {
    void fetchDeviceLogs()
  }, [filters.logDate, filters.deviceId, filters.userId])

  useEffect(() => {
    if (activeTab !== "device-logs") return
    const interval = window.setInterval(() => {
      void fetchDeviceLogs()
    }, 10000)
    return () => window.clearInterval(interval)
  }, [activeTab, filters.logDate, filters.deviceId, filters.userId])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, filters.startDate, filters.endDate, filters.shopId, filters.unit, filters.location, filters.status])

  const fetchAttendance = async () => {
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      unit: filters.unit,
      location: filters.location,
      status: filters.status,
    })
    if (filters.shopId !== "all") params.set("shopId", filters.shopId)

    const response = await fetch(`/attendance?${params.toString()}`)
    const payload = await response.json()
    setAttendanceRecords(payload.data.records)
    setSummary(payload.data.summary)
    setShops(payload.data.shops)
    setConfig((current) => current ?? payload.data.config)
  }

  const fetchExceptions = async () => {
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      severity: filters.severity,
    })
    const response = await fetch(`/exceptions?${params.toString()}`)
    const payload = await response.json()
    setExceptions(payload.data.exceptions)
  }

  const fetchDeviceLogs = async () => {
    const params = new URLSearchParams({
      date: filters.logDate,
      deviceId: filters.deviceId,
      userId: filters.userId,
    })
    const response = await fetch(`/device/logs?${params.toString()}`)
    const payload = await response.json()
    setDeviceLogs(payload.data.logs)
  }

  const fetchManualAdjustments = async () => {
    const response = await fetch("/attendance/manual")
    const payload = await response.json()
    setManualAdjustments(payload.data.adjustments)
  }

  const fetchConfig = async () => {
    const response = await fetch("/attendance/config")
    const payload = await response.json()
    setConfig(payload.data.config)
  }

  const fetchWarnings = async () => {
    const response = await fetch("/attendance/warnings")
    const payload = await response.json()
    setWarningActions(Array.isArray(payload?.data?.warnings) ? payload.data.warnings : [])
  }

  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filteredRecords = useMemo(() => {
    if (!normalizedSearch) return attendanceRecords
    return attendanceRecords.filter((record) =>
      [record.shopName, record.unit, record.location, record.status, record.actualCheckInTime || ""].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    )
  }, [attendanceRecords, normalizedSearch])

  const filteredExceptions = useMemo(() => {
    if (!normalizedSearch) return exceptions
    return exceptions.filter((exception) =>
      [exception.shopName, exception.issueType, exception.severity].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    )
  }, [exceptions, normalizedSearch])

  const filteredLogs = useMemo(() => {
    if (!normalizedSearch) return deviceLogs
    return deviceLogs.filter((log) =>
      [log.deviceId, log.userId, log.shopId || "", log.status].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    )
  }, [deviceLogs, normalizedSearch])

  const filteredAdjustments = useMemo(() => {
    if (!normalizedSearch) return manualAdjustments
    return manualAdjustments.filter((adjustment) => {
      const shopName = shops.find((shop) => shop.id === adjustment.shopId)?.name || ""
      return [shopName, adjustment.notes, adjustment.updatedBy, adjustment.newStatus].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [manualAdjustments, normalizedSearch, shops])

  const filteredWarnings = useMemo(() => {
    return (warningActions || []).filter((warning) =>
      [warning.shopName, warning.unit, warning.templateName, warning.channel, warning.recipient].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    )
  }, [normalizedSearch, warningActions])

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((left, right) => {
      const direction = sortDirection === "asc" ? 1 : -1
      const leftValue = left[sortKey] ?? ""
      const rightValue = right[sortKey] ?? ""
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction
      }
      return String(leftValue).localeCompare(String(rightValue)) * direction
    })
  }, [filteredRecords, sortDirection, sortKey])

  const pageSize = 8
  const totalPages = Math.max(Math.ceil(sortedRecords.length / pageSize), 1)
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedRecords.slice(startIndex, startIndex + pageSize)
  }, [currentPage, sortedRecords])

  const locationOptions = Array.from(new Set(shops.map((shop) => shop.location)))
  const unitOptions = Array.from(new Set(shops.map((shop) => shop.unit)))
  const deviceOptions = Array.from(new Set(deviceLogs.map((log) => log.deviceId)))
  const activeShops = shops.filter((shop) => shop.active)
  const selectedWarningIssue = exceptions.find(
    (exception) => `${exception.shopId}-${exception.date}` === warningDraft.issueKey
  )
  const selectedWarningTemplate = warningTemplates.find((template) => template.id === warningDraft.templateId) || warningTemplates[0]
  const warningPreview = selectedWarningIssue
    ? selectedWarningTemplate.body
        .replaceAll("{businessName}", selectedWarningIssue.shopName)
        .replaceAll("{unit}", selectedWarningIssue.unit)
        .replaceAll("{date}", dayjs(selectedWarningIssue.date).format("MMM D, YYYY"))
        .replaceAll("{delay}", selectedWarningIssue.delayDuration ? String(selectedWarningIssue.delayDuration) : "0")
    : ""
  const filteredOverrideShops = useMemo(() => {
    const search = overrideSearch.trim().toLowerCase()
    return shops.filter((shop) => {
      if (overrideUnit !== "all" && shop.unit !== overrideUnit) return false
      if (!search) return true
      return [shop.name, shop.unit, shop.location].some((value) => value.toLowerCase().includes(search))
    })
  }, [overrideSearch, overrideUnit, shops])

  const handleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(nextKey)
    setSortDirection("asc")
  }

  const handleProcessAttendance = async () => {
    setIsProcessing(true)
    try {
      await fetch("/attendance/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: filters.startDate,
          endDate: filters.endDate,
          shopId: filters.shopId === "all" ? undefined : filters.shopId,
          unit: filters.unit === "all" ? undefined : filters.unit,
          location: filters.location,
          status: filters.status,
        }),
      })
      await Promise.all([fetchAttendance(), fetchExceptions(), fetchDeviceLogs()])
      toast({
        title: "Attendance processed",
        description: "Processed records were refreshed successfully.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const exportCsv = () => {
    const rows = [
      ["Business Name", "Unit", "Date", "Status", "Opening Time", "Actual Check-in", "Delay"],
      ...sortedRecords.map((record) => [
        record.shopName,
        record.unit,
        record.date,
        record.status,
        record.openingTime,
        record.actualCheckInTime || "No check-in",
        String(record.delayMinutes),
      ]),
    ]
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `attendance-${filters.startDate}-${filters.endDate}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = async () => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <PdfText style={pdfStyles.heading}>Business Attendance Report</PdfText>
          {sortedRecords.slice(0, 40).map((record) => (
            <View key={`${record.shopId}-${record.date}`} style={pdfStyles.row}>
              <PdfText style={pdfStyles.shop}>{record.shopName}</PdfText>
              <PdfText style={pdfStyles.cell}>{record.date}</PdfText>
              <PdfText style={pdfStyles.cell}>{record.status}</PdfText>
              <PdfText style={pdfStyles.cell}>{record.actualCheckInTime || "No check-in"}</PdfText>
              <PdfText style={pdfStyles.cell}>{record.delayMinutes} mins</PdfText>
            </View>
          ))}
        </Page>
      </Document>
    ).toBlob()

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `attendance-${filters.startDate}-${filters.endDate}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const saveManualAdjustment = async () => {
    if (!manualForm.shopId) {
      toast({
        title: "Business required",
        description: "Choose a business before saving the manual adjustment.",
        variant: "destructive",
      })
      return
    }

    await fetch("/attendance/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...manualForm,
        updatedBy: "Landlord Admin",
      }),
    })

    setManualForm((current) => ({ ...current, notes: "" }))
    await Promise.all([fetchManualAdjustments(), fetchAttendance(), fetchExceptions()])
    toast({
      title: "Adjustment saved",
      description: "Manual attendance override recorded.",
    })
  }

  const saveConfig = async () => {
    if (!config) return
    setIsSavingConfig(true)
    try {
      await fetch("/attendance/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      toast({
        title: "Configuration saved",
        description: "Attendance rules were updated.",
      })
    } finally {
      setIsSavingConfig(false)
    }
  }

  const simulateLog = async () => {
    const targetShop = activeShops.find((shop) => shop.id === simulationShopId)
    if (!targetShop) return

    await fetch("/device/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: "DEV-LIVE",
        userId: targetShop.fingerprint_user_ids[0],
        timestamp: new Date().toISOString(),
      }),
    })

    await Promise.all([fetchDeviceLogs(), fetchAttendance(), fetchExceptions()])
    toast({
      title: "Test log received",
      description: `Fingerprint log added for ${targetShop.name}.`,
    })
  }

  const openWarningComposer = (exception: ExceptionRecord) => {
    setWarningDraft({
      issueKey: `${exception.shopId}-${exception.date}`,
      templateId: exception.issueType === "Not Opened" ? "warning-closed" : "warning-late-first",
      channel: "email",
      recipient: `manager@${exception.shopName.toLowerCase().replaceAll(" ", "")}.local`,
    })
    setIsWarningDrawerOpen(true)
  }

  const sendWarning = async () => {
    if (!selectedWarningIssue || !warningDraft.recipient.trim()) {
      toast({
        title: "Warning details incomplete",
        description: "Choose a business issue and recipient before sending the warning.",
        variant: "destructive",
      })
      return
    }

    await fetch("/attendance/warnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: selectedWarningIssue.shopId,
        shopName: selectedWarningIssue.shopName,
        unit: selectedWarningIssue.unit,
        date: selectedWarningIssue.date,
        templateId: selectedWarningTemplate.id,
        templateName: selectedWarningTemplate.name,
        channel: warningDraft.channel,
        recipient: warningDraft.recipient,
        message: warningPreview,
        sentBy: "Landlord Admin",
      }),
    })

    await fetchWarnings()
    setIsWarningDrawerOpen(false)
    toast({
      title: "Warning sent",
      description: `Warning sent to ${selectedWarningIssue.shopName}.`,
    })
  }

  const openManualAdjustment = (exception: ExceptionRecord) => {
    setManualForm({
      shopId: exception.shopId,
      date: exception.date,
      newStatus: exception.issueType === "Not Opened" ? "Closed" : "Late",
      notes: `Follow-up from attendance issue for unit ${exception.unit}.`,
    })
    setActiveTab("manual-adjustments")
  }

  const renderStatus = (status: AttendanceStatus) => (
    <Badge className={statusBadgeClasses[status]}>{status}</Badge>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
        onLogout={() => window.location.assign("/auth/signin")}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title="Attendance"
          subtitle="Track shop opening compliance"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-[1400px] space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total Businesses", value: summary.totalShops, icon: Store, tone: "bg-slate-100 text-slate-700" },
                { label: "On Time", value: summary.onTime, icon: CheckCircle2, tone: "bg-green-100 text-green-700" },
                { label: "Late", value: summary.late, icon: Clock3, tone: "bg-amber-100 text-amber-700" },
                { label: "Closed", value: summary.closed, icon: BellRing, tone: "bg-red-100 text-red-700" },
              ].map((card, index) => (
                <div key={`${card.label}-${index}`} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <MutedText className="text-[11px] uppercase tracking-[0.16em]">{card.label}</MutedText>
                  </div>
                  <div className="text-3xl font-semibold text-foreground">{card.value}</div>
                </div>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
              <div className="overflow-x-auto">
                <TabsList className="h-auto gap-2 rounded-2xl border border-border/60 bg-card p-2">
                  {tabItems.map((tab, index) => (
                    <TabsTrigger
                      key={`${tab.value}-${index}`}
                      value={tab.value}
                      className="gap-2 rounded-xl border border-transparent px-4 py-2.5 text-muted-foreground data-[state=active]:border-[#7D8B6F] data-[state=active]:bg-[#7D8B6F] data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="shop-records" className="space-y-5">
                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading level={3} className="text-lg text-foreground">
                      Attendance Records
                    </Heading>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="gap-2" onClick={exportCsv}>
                        <Download className="h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={exportPdf}>
                        <FileDown className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button
                        className="gap-2"
                        style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                        onClick={handleProcessAttendance}
                        disabled={isProcessing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                        Recalculate Attendance
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <FilterField label="Start Date">
                      <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                      />
                    </FilterField>
                    <FilterField label="End Date">
                      <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                      />
                    </FilterField>
                    <FilterField label="Business Name">
                      <Select value={filters.shopId} onValueChange={(value) => setFilters((current) => ({ ...current, shopId: value }))}>
                        <SelectTrigger className="bg-white text-foreground border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border shadow-md z-[100]">
                          <SelectItem value="all">All Businesses</SelectItem>
                          {shops.map((shop, index) => (
                            <SelectItem key={`${shop.id}-${index}`} value={shop.id}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterField>
                    <FilterField label="Unit">
                      <Select value={filters.unit} onValueChange={(value) => setFilters((current) => ({ ...current, unit: value }))}>
                        <SelectTrigger className="bg-white text-foreground border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border shadow-md z-[100]">
                          <SelectItem value="all">All Units</SelectItem>
                          {unitOptions.map((unit, index) => (
                            <SelectItem key={`${unit}-${index}`} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterField>
                    <FilterField label="Location">
                      <Select value={filters.location} onValueChange={(value) => setFilters((current) => ({ ...current, location: value }))}>
                        <SelectTrigger className="bg-white text-foreground border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border shadow-md z-[100]">
                          <SelectItem value="all">All Locations</SelectItem>
                          {locationOptions.map((location, index) => (
                            <SelectItem key={`${location}-${index}`} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterField>
                    <FilterField label="Status">
                      <Select value={filters.status} onValueChange={(value) => setFilters((current) => ({ ...current, status: value }))}>
                        <SelectTrigger className="bg-white text-foreground border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border shadow-md z-[100]">
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="On Time">On Time</SelectItem>
                          <SelectItem value="Slight Late">Slight Late</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FilterField>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                      onClick={() => setShowActualLogs((current) => !current)}
                    >
                      <span className={`relative h-5 w-10 rounded-full ${showActualLogs ? "bg-primary" : "bg-muted"}`}>
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                            showActualLogs ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      Show Actual Logs
                    </button>
                    <MutedText className="text-[11px] uppercase tracking-[0.16em]">
                      {sortedRecords.length} records
                    </MutedText>
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHead
                          label="Business Name"
                          active={sortKey === "shopName"}
                          direction={sortDirection}
                          onClick={() => handleSort("shopName")}
                        />
                        <TableHead>Unit</TableHead>
                        <SortableHead
                          label="Status"
                          active={sortKey === "status"}
                          direction={sortDirection}
                          onClick={() => handleSort("status")}
                        />
                        <SortableHead
                          label="Opening Time"
                          active={sortKey === "openingTime"}
                          direction={sortDirection}
                          onClick={() => handleSort("openingTime")}
                        />
                        <SortableHead
                          label="Actual Check-in"
                          active={sortKey === "actualCheckInTime"}
                          direction={sortDirection}
                          onClick={() => handleSort("actualCheckInTime")}
                        />
                        <SortableHead
                          label="Delay (mins)"
                          active={sortKey === "delayMinutes"}
                          direction={sortDirection}
                          onClick={() => handleSort("delayMinutes")}
                        />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRecords.map((record, index) => (
                        <Fragment key={`${record.shopId}-${record.date}-${index}`}>
                          <TableRow>
                            <TableCell>
                              <div className="font-medium text-foreground">{record.shopName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.date} | {record.location}
                              </div>
                            </TableCell>
                            <TableCell>{record.unit}</TableCell>
                            <TableCell>{renderStatus(record.status)}</TableCell>
                            <TableCell>{record.openingTime}</TableCell>
                            <TableCell>{record.actualCheckInTime || "No check-in"}</TableCell>
                            <TableCell>{record.status === "Closed" ? "N/A" : record.delayMinutes}</TableCell>
                          </TableRow>
                          {showActualLogs && record.actualLogs.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-background/40">
                                <div className="flex flex-wrap gap-2">
                                  {record.actualLogs.map((log, index) => (
                                    <span
                                      key={`${log.id}-${index}`}
                                      className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
                                    >
                                      {log.deviceId} | {log.userId} | {dayjs(log.timestamp).format("HH:mm:ss")}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))}
                      {!paginatedRecords.length && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                            No attendance records match the current filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <div className="mt-5 flex items-center justify-between">
                    <MutedText className="text-sm">
                      Page {currentPage} of {totalPages}
                    </MutedText>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((page) => page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="exception-records" className="space-y-5">
                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading level={3} className="text-lg text-foreground">
                      Attendance Issues
                    </Heading>
                    <div className="grid w-full gap-3 lg:max-w-xl lg:grid-cols-[1fr,1fr]">
                      <FilterField label="Start Date">
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </FilterField>
                      <FilterField label="End Date">
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </FilterField>
                    </div>
                    <div className="w-full max-w-xs">
                      <FilterField label="Severity">
                        <Select value={filters.severity} onValueChange={(value) => setFilters((current) => ({ ...current, severity: value }))}>
                          <SelectTrigger className="bg-card text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="all">All Severity</SelectItem>
                            <SelectItem value="slight">Slight</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </FilterField>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                      <div className="mb-3">
                        <Heading level={4} className="text-base text-foreground">
                          Warning Log
                        </Heading>
                      </div>
                      <div className="space-y-3">
                        {filteredWarnings.slice(0, 6).map((warning, index) => (
                          <div key={`${warning.id}-${index}`} className="rounded-xl border border-border/60 bg-card p-3">
                            <div className="font-medium text-foreground">{warning.shopName}</div>
                            <div className="text-xs text-muted-foreground">
                              {warning.unit} | {warning.templateName} | {warning.channel}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {warning.recipient} | {dayjs(warning.sentAt).format("MMM D, YYYY HH:mm")}
                            </div>
                          </div>
                        ))}
                        {!filteredWarnings.length && (
                          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                            No warnings have been sent yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredExceptions.map((exception, index) => (
                      <div
                        key={`${exception.shopId}-${exception.date}-${exception.unit}-${index}`}
                        className="rounded-2xl border border-border/60 bg-background/50 p-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="font-semibold text-foreground">{exception.shopName}</div>
                            <div className="text-sm text-muted-foreground">
                              {exception.date} | {exception.unit} | {exception.issueType}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge
                              className={
                                exception.issueType === "Not Opened"
                                  ? "border-red-200 bg-red-100 text-red-800"
                                  : "border-amber-200 bg-amber-100 text-amber-800"
                              }
                            >
                              {exception.issueType === "Not Opened" ? "Closed" : `${exception.delayDuration} mins late`}
                            </Badge>
                            <Badge variant="outline" className="uppercase">
                              {exception.severity}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openWarningComposer(exception)}
                            >
                              Send Warning
                            </Button>
                            <Button
                              size="sm"
                              style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                              onClick={() => openManualAdjustment(exception)}
                            >
                              Adjust Record
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!filteredExceptions.length && (
                      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                        No attendance issues for the selected date range.
                      </div>
                    )}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="device-logs" className="space-y-5">
                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <Heading level={3} className="text-lg text-foreground">
                      Raw Device Logs
                    </Heading>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="gap-2" onClick={() => void fetchDeviceLogs()}>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </Button>
                      <Button
                        className="gap-2"
                        style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                        onClick={simulateLog}
                        disabled={!simulationShopId}
                      >
                        <Fingerprint className="h-4 w-4" />
                        Test Device Log
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <FilterField label="Date">
                      <Input
                        type="date"
                        value={filters.logDate}
                        onChange={(event) => setFilters((current) => ({ ...current, logDate: event.target.value }))}
                      />
                    </FilterField>
                    <FilterField label="Device">
                      <Select value={filters.deviceId} onValueChange={(value) => setFilters((current) => ({ ...current, deviceId: value }))}>
                        <SelectTrigger className="bg-card text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="all">All Devices</SelectItem>
                          {deviceOptions.map((deviceId, index) => (
                            <SelectItem key={`${deviceId}-${index}`} value={deviceId}>
                              {deviceId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterField>
                    <FilterField label="Search User ID">
                      <Input
                        value={filters.userId}
                        onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}
                        placeholder="fp-1001"
                      />
                    </FilterField>
                    <FilterField label="Test Business">
                      <Select value={simulationShopId} onValueChange={setSimulationShopId}>
                        <SelectTrigger className="bg-card text-foreground">
                          <SelectValue placeholder="Select unit/business" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {activeShops.map((shop, index) => (
                            <SelectItem key={`${shop.id}-${index}`} value={shop.id}>
                              {shop.unit} | {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterField>
                    <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Real-Time Status
                      </div>
                      <div className="mt-2 text-sm text-foreground">
                        Polling is {activeTab === "device-logs" ? "active" : "idle"} for incoming fingerprint events.
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Shop ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log, index) => (
                        <TableRow key={`${log.id}-${index}`}>
                          <TableCell>{log.deviceId}</TableCell>
                          <TableCell>{log.userId}</TableCell>
                          <TableCell>{log.shopId || "Unmapped"}</TableCell>
                          <TableCell>{dayjs(log.timestamp).format("MMM D, YYYY HH:mm:ss")}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                log.status === "valid"
                                  ? "border-green-200 bg-green-100 text-green-800"
                                  : "border-red-200 bg-red-100 text-red-800"
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!filteredLogs.length && (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                            No device logs found for the selected filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </section>
              </TabsContent>

              <TabsContent value="manual-adjustments" className="space-y-5">
                <div className="grid gap-5 xl:grid-cols-[1.05fr,1.35fr]">
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <Heading level={3} className="text-lg text-foreground">
                      Add Manual Adjustment
                    </Heading>

                    <div className="mt-5 space-y-4">
                      <FilterField label="Shop">
                        <Select
                          value={manualForm.shopId || undefined}
                          onValueChange={(value) => setManualForm((current) => ({ ...current, shopId: value }))}
                        >
                          <SelectTrigger className="bg-card text-foreground">
                            <SelectValue placeholder="Select a business" />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            {shops.map((shop, index) => (
                              <SelectItem key={`${shop.id}-${index}`} value={shop.id}>
                                {shop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FilterField>
                      <FilterField label="Date">
                        <Input
                          type="date"
                          value={manualForm.date}
                          onChange={(event) => setManualForm((current) => ({ ...current, date: event.target.value }))}
                        />
                      </FilterField>
                      <FilterField label="New Status">
                        <Select
                          value={manualForm.newStatus}
                          onValueChange={(value: AttendanceStatus) =>
                            setManualForm((current) => ({ ...current, newStatus: value }))
                          }
                        >
                          <SelectTrigger className="bg-card text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="On Time">On Time</SelectItem>
                            <SelectItem value="Slight Late">Slight Late</SelectItem>
                            <SelectItem value="Late">Late</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FilterField>
                      <FilterField label="Reason / Notes">
                        <textarea
                          value={manualForm.notes}
                          onChange={(event) => setManualForm((current) => ({ ...current, notes: event.target.value }))}
                          className="min-h-[110px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Technical issue, approved closure, or verified opening outside the scanner window."
                        />
                      </FilterField>
                      <Button className="w-full" style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }} onClick={saveManualAdjustment}>
                        Save Adjustment
                      </Button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <Heading level={3} className="text-lg text-foreground">
                        Audit Log
                      </Heading>
                      <MutedText className="text-[11px] uppercase tracking-[0.16em]">
                        {filteredAdjustments.length} entries
                      </MutedText>
                    </div>
                    <div className="space-y-3">
                      {filteredAdjustments.map((adjustment, index) => {
                        const shopName = shops.find((shop) => shop.id === adjustment.shopId)?.name || adjustment.shopId
                        return (
                          <div
                            key={`${adjustment.id}-${index}`}
                            className="rounded-2xl border border-border/60 bg-background/50 p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="font-semibold text-foreground">{shopName}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {adjustment.date} | {adjustment.notes || "No notes"}
                                </div>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div>{adjustment.updatedBy}</div>
                                <div>{dayjs(adjustment.updatedAt).format("MMM D, YYYY HH:mm")}</div>
                              </div>
                            </div>
                            <div className="mt-3">{renderStatus(adjustment.newStatus)}</div>
                          </div>
                        )
                      })}
                      {!filteredAdjustments.length && (
                        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                          No manual adjustments recorded yet.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="configurations" className="space-y-5">
                <div className="grid gap-5 xl:grid-cols-[1fr,1.4fr]">
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <Heading level={3} className="text-lg text-foreground">
                      System Rules
                    </Heading>

                    {config && (
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <FilterField label="Default Opening Time">
                          <Input
                            type="time"
                            value={config.defaultOpeningTime}
                            onChange={(event) =>
                              setConfig((current) => (current ? { ...current, defaultOpeningTime: event.target.value } : current))
                            }
                          />
                        </FilterField>
                        <FilterField label="Grace Period (minutes)">
                          <Input
                            type="number"
                            min={0}
                            value={config.gracePeriodMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current ? { ...current, gracePeriodMinutes: Number(event.target.value) || 0 } : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="Late Threshold">
                          <Input
                            type="number"
                            min={0}
                            value={config.lateThresholdMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current ? { ...current, lateThresholdMinutes: Number(event.target.value) || 0 } : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="Slight Severity Max">
                          <Input
                            type="number"
                            min={0}
                            value={config.severityRules.slightLateMaxMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      severityRules: {
                                        ...current.severityRules,
                                        slightLateMaxMinutes: Number(event.target.value) || 0,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="Medium Severity Max">
                          <Input
                            type="number"
                            min={0}
                            value={config.severityRules.mediumLateMaxMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      severityRules: {
                                        ...current.severityRules,
                                        mediumLateMaxMinutes: Number(event.target.value) || 0,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="High Severity Max">
                          <Input
                            type="number"
                            min={0}
                            value={config.severityRules.highLateMaxMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      severityRules: {
                                        ...current.severityRules,
                                        highLateMaxMinutes: Number(event.target.value) || 0,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="Notify Closed At">
                          <Input
                            type="time"
                            value={config.notificationRules.notifyClosedAt}
                            onChange={(event) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      notificationRules: {
                                        ...current.notificationRules,
                                        notifyClosedAt: event.target.value,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </FilterField>
                        <FilterField label="Notify Late After">
                          <Input
                            type="number"
                            min={0}
                            value={config.notificationRules.notifyLateAfterMinutes}
                            onChange={(event) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      notificationRules: {
                                        ...current.notificationRules,
                                        notifyLateAfterMinutes: Number(event.target.value) || 0,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </FilterField>
                        <div className="space-y-3 rounded-2xl border border-border/50 bg-background/50 p-4">
                          <ToggleRow
                            label="Late penalty"
                            checked={Boolean(config.penaltyRules.latePenaltyEnabled)}
                            onChange={(checked) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      penaltyRules: {
                                        ...current.penaltyRules,
                                        latePenaltyEnabled: checked,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                          <ToggleRow
                            label="Closed penalty"
                            checked={Boolean(config.penaltyRules.closedPenaltyEnabled)}
                            onChange={(checked) =>
                              setConfig((current) =>
                                current
                                  ? {
                                      ...current,
                                      penaltyRules: {
                                        ...current.penaltyRules,
                                        closedPenaltyEnabled: checked,
                                      },
                                    }
                                  : current
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Button
                            className="w-full md:w-auto"
                            style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                            onClick={saveConfig}
                            disabled={isSavingConfig}
                          >
                            {isSavingConfig ? "Saving..." : "Save Configuration"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                    <Heading level={3} className="text-lg text-foreground">
                      Business-Specific Overrides
                    </Heading>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <FilterField label="Business Search">
                        <Input
                          value={overrideSearch}
                          onChange={(event) => setOverrideSearch(event.target.value)}
                          placeholder="Search by business or unit"
                        />
                      </FilterField>
                      <FilterField label="Unit">
                        <Select value={overrideUnit} onValueChange={setOverrideUnit}>
                          <SelectTrigger className="bg-card text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem value="all">All Units</SelectItem>
                            {unitOptions.map((unit, index) => (
                              <SelectItem key={`${unit}-${index}`} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FilterField>
                    </div>

                    <div className="mt-5 space-y-3">
                      {filteredOverrideShops.map((shop, index) => {
                        const override = config?.shopOverrides[shop.id]
                        const openingTime = override?.openingTime || shop.opening_time
                        const gracePeriod = override?.gracePeriod ?? shop.grace_period

                        return (
                          <div
                            key={`${shop.id}-${index}`}
                            className="grid gap-4 rounded-2xl border border-border/60 bg-background/50 p-4 md:grid-cols-[1.2fr,180px,180px]"
                          >
                            <div>
                              <div className="font-semibold text-foreground">{shop.name}</div>
                              <div className="text-sm text-muted-foreground">{shop.unit} | {shop.location}</div>
                            </div>
                            <FilterField label="Opening Time" compact>
                              <Input
                                type="time"
                                value={openingTime}
                                onChange={(event) =>
                                  setConfig((current) =>
                                    current
                                      ? {
                                          ...current,
                                          shopOverrides: {
                                            ...current.shopOverrides,
                                            [shop.id]: {
                                              openingTime: event.target.value,
                                              gracePeriod,
                                            },
                                          },
                                        }
                                      : current
                                  )
                                }
                              />
                            </FilterField>
                            <FilterField label="Grace Period" compact>
                              <Input
                                type="number"
                                min={0}
                                value={gracePeriod}
                                onChange={(event) =>
                                  setConfig((current) =>
                                    current
                                      ? {
                                          ...current,
                                          shopOverrides: {
                                            ...current.shopOverrides,
                                            [shop.id]: {
                                              openingTime,
                                              gracePeriod: Number(event.target.value) || 0,
                                            },
                                          },
                                        }
                                      : current
                                  )
                                }
                              />
                            </FilterField>
                          </div>
                        )
                      })}
                      {!filteredOverrideShops.length && (
                        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                          No businesses match the override filters.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </TabsContent>
            </Tabs>

            {isLoading && (
              <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
                Loading attendance data...
              </div>
            )}
          </div>
        </main>
      </div>
      <Dialog open={isWarningDrawerOpen} onOpenChange={setIsWarningDrawerOpen}>
        <DialogContent
          className="left-auto right-0 top-0 h-screen w-full max-w-[440px] translate-x-0 translate-y-0 rounded-none border-l border-border p-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:rounded-none"
          style={{
            backgroundColor: "var(--background)",
            boxShadow: "-18px 0 40px rgba(0, 0, 0, 0.18)",
          }}
        >
          <div className="flex h-full flex-col">
            <DialogHeader
              className="border-b border-border/60 px-6 py-5"
              style={{ backgroundColor: "var(--background)" }}
            >
              <DialogTitle>Send Warning</DialogTitle>
            </DialogHeader>
            <div
              className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
              style={{ backgroundColor: "var(--background)" }}
            >
              <FilterField label="Business Issue">
                <Select
                  value={warningDraft.issueKey || undefined}
                  onValueChange={(value) => setWarningDraft((current) => ({ ...current, issueKey: value }))}
                >
                  <SelectTrigger className="bg-card text-foreground">
                    <SelectValue placeholder="Select attendance issue" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {filteredExceptions.map((exception, index) => (
                      <SelectItem
                        key={`${exception.shopId}-${exception.date}-${exception.unit}-${index}`}
                        value={`${exception.shopId}-${exception.date}`}
                      >
                        {exception.unit} | {exception.shopName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Template">
                <Select
                  value={warningDraft.templateId}
                  onValueChange={(value) =>
                    setWarningDraft((current) => ({ ...current, templateId: value as WarningTemplateId }))
                  }
                >
                  <SelectTrigger className="bg-card text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {warningTemplates.map((template, index) => (
                      <SelectItem key={`${template.id}-${index}`} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Channel">
                <Select
                  value={warningDraft.channel}
                  onValueChange={(value: "email" | "sms" | "in-app") =>
                    setWarningDraft((current) => ({ ...current, channel: value }))
                  }
                >
                  <SelectTrigger className="bg-card text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Recipient">
                <Input
                  value={warningDraft.recipient}
                  onChange={(event) => setWarningDraft((current) => ({ ...current, recipient: event.target.value }))}
                  placeholder="manager@business.com"
                />
              </FilterField>
              <div
                className="rounded-2xl border border-border/60 p-4"
                style={{ backgroundColor: "var(--card)" }}
              >
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Message Preview
                </div>
                <p className="text-sm leading-6 text-foreground">
                  {warningPreview || "Select an attendance issue to preview the warning message."}
                </p>
              </div>
            </div>
            <div
              className="border-t border-border/60 px-6 py-4"
              style={{ backgroundColor: "var(--background)" }}
            >
              <Button
                className="w-full"
                style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                onClick={sendWarning}
              >
                Send Warning
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

function FilterField({
  label,
  children,
  compact = false,
}: {
  label: string
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <label className={`block ${compact ? "space-y-1.5" : "space-y-2"}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function SortableHead({
  label,
  active,
  direction,
  onClick,
}: {
  label: string
  active: boolean
  direction: "asc" | "desc"
  onClick: () => void
}) {
  return (
    <TableHead>
      <button type="button" className="inline-flex items-center gap-1 font-medium" onClick={onClick}>
        <span>{label}</span>
        {active ? direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" /> : null}
      </button>
    </TableHead>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => onChange(!checked)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className={`relative h-5 w-10 rounded-full ${checked ? "bg-primary" : "bg-muted"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  )
}
