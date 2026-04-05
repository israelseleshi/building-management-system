"use client"

import { useState, useMemo } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Home,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface PaymentRecord {
  id: string
  date: string
  amount: number
  type: "rent" | "deposit" | "utility" | "fee" | "other"
  status: "paid" | "pending" | "overdue"
  description: string
  reference: string
}

const mockPaymentHistory: PaymentRecord[] = [
  { id: "1", date: "2026-04-01", amount: 15000, type: "rent", status: "pending", description: "April 2026 Rent", reference: "RNT-2026-004" },
  { id: "2", date: "2026-03-01", amount: 15000, type: "rent", status: "paid", description: "March 2026 Rent", reference: "RNT-2026-003" },
  { id: "3", date: "2026-02-01", amount: 15000, type: "rent", status: "paid", description: "February 2026 Rent", reference: "RNT-2026-002" },
  { id: "4", date: "2026-01-01", amount: 15000, type: "rent", status: "paid", description: "January 2026 Rent", reference: "RNT-2026-001" },
  { id: "5", date: "2025-12-01", amount: 15000, type: "rent", status: "paid", description: "December 2025 Rent", reference: "RNT-2025-012" },
  { id: "6", date: "2025-12-15", amount: 4500, type: "utility", status: "paid", description: "Electricity - December", reference: "UTL-2025-012" },
  { id: "7", date: "2025-11-01", amount: 15000, type: "rent", status: "paid", description: "November 2025 Rent", reference: "RNT-2025-011" },
  { id: "8", date: "2025-10-01", amount: 15000, type: "rent", status: "paid", description: "October 2025 Rent", reference: "RNT-2025-010" },
  { id: "9", date: "2025-09-01", amount: 15000, type: "rent", status: "paid", description: "September 2025 Rent", reference: "RNT-2025-009" },
  { id: "10", date: "2025-08-15", amount: 45000, type: "deposit", status: "paid", description: "Security Deposit", reference: "DEP-2025-001" },
  { id: "11", date: "2025-08-01", amount: 15000, type: "rent", status: "paid", description: "August 2025 Rent", reference: "RNT-2025-008" },
  { id: "12", date: "2025-07-01", amount: 15000, type: "rent", status: "paid", description: "July 2025 Rent", reference: "RNT-2025-007" },
]

const COLORS = ["#1F3549", "#3b82f6", "#94a3b8"]

const statusConfig = {
  paid: { label: "Paid", color: "text-green-700", bg: "bg-green-100" },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
  overdue: { label: "Overdue", color: "text-red-700", bg: "bg-red-100" }
}

type DateRange = "3months" | "6months" | "12months"

export default function TenantReportsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantReportsContent />
    </ProtectedRoute>
  )
}

function TenantReportsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>("12months")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const router = useRouter()
  const t = useTranslations("Tenant")

  const navItems = [
    { icon: <Home className="w-5 h-5" />, name: t("nav.dashboard"), path: "/tenant-dashboard", active: false },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.listings"), path: "/tenant-dashboard/listings", active: false },
    { icon: <DollarSign className="w-5 h-5" />, name: t("nav.myRents"), path: "/tenant-dashboard/leases", active: false },
    { icon: <CreditCard className="w-5 h-5" />, name: "Payments", path: "/tenant-dashboard/reports", active: true },
    { icon: <FileText className="w-5 h-5" />, name: t("nav.documents"), path: "/tenant-dashboard/documents", active: false },
    { icon: <MessageSquare className="w-5 h-5" />, name: t("nav.chat"), path: "/tenant-dashboard/chat", active: false },
  ]

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
  }

  const getMonthsToInclude = (range: DateRange): number => {
    switch (range) {
      case "3months": return 3
      case "6months": return 6
      case "12months": return 12
    }
  }

  const filteredPayments = mockPaymentHistory.filter((payment) => {
    const matchesType = filterType === "all" || payment.type === filterType
    const matchesSearch = searchQuery === "" || 
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const chartData = useMemo(() => {
    const months = getMonthsToInclude(dateRange)
    const today = new Date()
    const data: { month: string; rent: number; utilities: number; other: number }[] = []

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthStr = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      
      const monthPayments = mockPaymentHistory.filter(p => {
        const paymentDate = new Date(p.date)
        return paymentDate.getFullYear() === date.getFullYear() && 
               paymentDate.getMonth() === date.getMonth() &&
               p.status === "paid"
      })

      const rentTotal = monthPayments.filter(p => p.type === "rent").reduce((sum, p) => sum + p.amount, 0)
      const utilityTotal = monthPayments.filter(p => p.type === "utility").reduce((sum, p) => sum + p.amount, 0)
      const otherTotal = monthPayments.filter(p => p.type !== "rent" && p.type !== "utility").reduce((sum, p) => sum + p.amount, 0)

      data.push({
        month: monthStr,
        rent: rentTotal,
        utilities: utilityTotal,
        other: otherTotal
      })
    }

    return data
  }, [dateRange])

  const paymentBreakdown = useMemo(() => {
    const months = getMonthsToInclude(dateRange)
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1)

    const periodPayments = mockPaymentHistory.filter(p => {
      const paymentDate = new Date(p.date)
      return paymentDate >= startDate && p.status === "paid"
    })

    const rentTotal = periodPayments.filter(p => p.type === "rent").reduce((sum, p) => sum + p.amount, 0)
    const utilityTotal = periodPayments.filter(p => p.type === "utility").reduce((sum, p) => sum + p.amount, 0)
    const otherTotal = periodPayments.filter(p => p.type !== "rent" && p.type !== "utility").reduce((sum, p) => sum + p.amount, 0)

    return [
      { name: "Rent", value: rentTotal, color: "#1F3549" },
      { name: "Utilities", value: utilityTotal, color: "#3b82f6" },
      { name: "Other", value: otherTotal, color: "#94a3b8" },
    ]
  }, [dateRange])

  const stats = useMemo(() => {
    const months = getMonthsToInclude(dateRange)
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1)

    const periodPayments = mockPaymentHistory.filter(p => {
      const paymentDate = new Date(p.date)
      return paymentDate >= startDate
    })

    const totalPaid = periodPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
    const totalPending = periodPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
    const average = months > 0 ? Math.round(totalPaid / months) : 0

    return { totalPaid, totalPending, average }
  }, [dateRange])

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDateRangeLabel = (range: DateRange) => {
    switch (range) {
      case "3months": return "3-Month Average"
      case "6months": return "6-Month Average"
      case "12months": return "12-Month Average"
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Payment Reports"
          subtitle="Track your payment history and upcoming payments"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={toggleSidebar}
          searchPlaceholder="Search payments..."
        />

        <div className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPaid)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>All payments on time</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPending)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
                <AlertCircle className="w-4 h-4" />
                <span>Due April 1, 2026</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{getDateRangeLabel(dateRange)}</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.average)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                <TrendingUp className="w-4 h-4" />
                <span>Per month rent</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
                <div className="flex gap-2">
                  <select
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value as DateRange)
                      setCurrentPage(1)
                    }}
                    className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="3months">Last 3 months</option>
                    <option value="6months">Last 6 months</option>
                    <option value="12months">Last 12 months</option>
                  </select>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #e5e5e5", 
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      formatter={(value: number) => [`ETB ${value.toLocaleString()}`, ""]}
                    />
                    <Bar dataKey="rent" fill="#1F3549" radius={[4, 4, 0, 0]} name="Rent" />
                    <Bar dataKey="utilities" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Utilities" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Payment Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `ETB ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {paymentBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Last {dateRange === "3months" ? "3" : dateRange === "6months" ? "6" : "12"} months
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Transactions
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredPayments.length} total)
                </span>
              </h3>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="rent">Rent</option>
                  <option value="utility">Utilities</option>
                  <option value="deposit">Deposits</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Reference</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => {
                    const status = statusConfig[payment.status]
                    return (
                      <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{formatDate(payment.date)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {payment.type === "rent" && <Home className="w-4 h-4 text-primary" />}
                            {payment.type === "utility" && <DollarSign className="w-4 h-4 text-blue-500" />}
                            {payment.type === "deposit" && <CreditCard className="w-4 h-4 text-purple-500" />}
                            <span className="text-sm font-medium text-foreground">{payment.description}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground font-mono">{payment.reference}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {payment.status === "paid" && <CheckCircle2 className="w-3 h-3" />}
                            {payment.status === "pending" && <Clock className="w-3 h-3" />}
                            {payment.status === "overdue" && <AlertCircle className="w-3 h-3" />}
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} transactions
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
