"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DataTable } from "@/components/ui/data-table"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ColumnDef } from "@tanstack/react-table"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  salary: number
  joinDate: string
  status: "Active" | "Inactive" | "On Leave"
  attendanceRate: number
  lastAttendance: string
  image?: string
}

export default function EmployeesPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <EmployeesContent />
    </ProtectedRoute>
  )
}

function EmployeesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "attendance" | "payroll">("all")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "Maintenance",
    salary: 0,
    joinDate: "",
  })

  // Mock employee data - in production, this would come from Supabase
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: "1",
        name: "Ahmed Hassan",
        email: "ahmed@bms.com",
        phone: "+251911234567",
        position: "Head Janitor",
        department: "Maintenance",
        salary: 8500,
        joinDate: "2022-01-15",
        status: "Active",
        attendanceRate: 98,
        lastAttendance: "2024-12-04",
        image: "/avatars/employee1.png",
      },
      {
        id: "2",
        name: "Fatima Mohamed",
        email: "fatima@bms.com",
        phone: "+251922345678",
        position: "Security Officer",
        department: "Security",
        salary: 9500,
        joinDate: "2021-06-20",
        status: "Active",
        attendanceRate: 96,
        lastAttendance: "2024-12-04",
        image: "/avatars/employee2.png",
      },
      {
        id: "3",
        name: "Abebe Tekle",
        email: "abebe@bms.com",
        phone: "+251933456789",
        position: "Maintenance Technician",
        department: "Maintenance",
        salary: 7800,
        joinDate: "2023-03-10",
        status: "Active",
        attendanceRate: 94,
        lastAttendance: "2024-12-04",
        image: "/avatars/employee3.png",
      },
      {
        id: "4",
        name: "Marta Desta",
        email: "marta@bms.com",
        phone: "+251944567890",
        position: "Network Administrator",
        department: "IT",
        salary: 12000,
        joinDate: "2020-09-05",
        status: "Active",
        attendanceRate: 99,
        lastAttendance: "2024-12-04",
        image: "/avatars/employee4.png",
      },
      {
        id: "5",
        name: "Yohannes Assefa",
        email: "yohannes@bms.com",
        phone: "+251955678901",
        position: "Cleaner",
        department: "Maintenance",
        salary: 6500,
        joinDate: "2023-11-01",
        status: "On Leave",
        attendanceRate: 85,
        lastAttendance: "2024-12-02",
        image: "/avatars/employee5.png",
      },
      {
        id: "6",
        name: "Selam Girma",
        email: "selam@bms.com",
        phone: "+251966789012",
        position: "Security Officer",
        department: "Security",
        salary: 9000,
        joinDate: "2022-05-12",
        status: "Active",
        attendanceRate: 97,
        lastAttendance: "2024-12-04",
        image: "/avatars/employee6.png",
      },
    ]

    setEmployees(mockEmployees)
    setLoading(false)
  }, [])

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
      active: true,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
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

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    // TODO: Implement edit modal in future
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployeeToDelete(employeeId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((e) => e.id !== employeeToDelete))
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = ["all", ...new Set(employees.map((e) => e.department))]
  const statuses = ["all", "Active", "Inactive", "On Leave"]

  // Calculate statistics
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.status === "Active").length
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0)
  const avgAttendance =
    Math.round(
      employees.reduce((sum, e) => sum + e.attendanceRate, 0) / employees.length
    ) || 0

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-semibold">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => <span className="text-sm">{row.original.position}</span>,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-50">
          {row.original.department}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const statusColor =
          status === "Active"
            ? "bg-green-50 text-green-700"
            : status === "On Leave"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
        return <Badge className={statusColor}>{status}</Badge>
      },
    },
    {
      accessorKey: "attendanceRate",
      header: "Attendance",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${row.original.attendanceRate}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{row.original.attendanceRate}%</span>
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          ETB {row.original.salary.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewEmployee(row.original)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditEmployee(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEmployee(row.original.id)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar
          navItems={navItems}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          onNavigate={handleSidebarNavigation}
        />

        <div className="flex-1 transition-all duration-300 ease-in-out">
          <DashboardHeader
            title="Employees"
            subtitle="Loading employee data..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="p-6 flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Text className="text-muted-foreground">Loading employees...</Text>
            </div>
          </main>
        </div>
      </div>
    )
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

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Employees"
          subtitle="Manage building staff and track attendance"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-6 border-0" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Employees</p>
                <div className="text-3xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground mt-2">{activeEmployees} active</p>
              </div>

              <div className="rounded-2xl p-6 border-0" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <p className="text-sm font-medium text-muted-foreground mb-2">Active Employees</p>
                <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
                <p className="text-xs text-muted-foreground mt-2">{Math.round((activeEmployees / totalEmployees) * 100)}% of total</p>
              </div>

              <div className="rounded-2xl p-6 border-0" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Payroll</p>
                <div className="text-3xl font-bold">ETB {(totalPayroll / 1000).toFixed(1)}K</div>
                <p className="text-xs text-muted-foreground mt-2">Total salary expense</p>
              </div>

              <div className="rounded-2xl p-6 border-0" style={{ backgroundColor: "var(--card)", boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <p className="text-sm font-medium text-muted-foreground mb-2">Avg Attendance</p>
                <div className="text-3xl font-bold text-blue-600">{avgAttendance}%</div>
                <p className="text-xs text-muted-foreground mt-2">Overall attendance rate</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "all"
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
              >
                All Employees
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "attendance"
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
              >
                <Clock className="w-4 h-4" />
                Attendance
              </button>
              <button
                onClick={() => setActiveTab("payroll")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "payroll"
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Payroll
              </button>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Status" : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={() => setAddModalOpen(true)}
                style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </div>

            {/* Employee Table */}
            {activeTab === "all" && (
              <DataTable columns={columns} data={filteredEmployees} pageSize={8} />
            )}

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <Card className="border-0" style={{ boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>
                    Track employee attendance and punctuality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.position}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {employee.attendanceRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last: {employee.lastAttendance}
                            </p>
                          </div>
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                employee.attendanceRate >= 95
                                  ? "bg-green-500"
                                  : employee.attendanceRate >= 85
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${employee.attendanceRate}%` }}
                            ></div>
                          </div>
                          {employee.attendanceRate >= 95 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : employee.attendanceRate < 85 ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payroll Tab */}
            {activeTab === "payroll" && (
              <Card className="border-0" style={{ boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)" }}>
                <CardHeader>
                  <CardTitle>Payroll Information</CardTitle>
                  <CardDescription>
                    Monthly salary and compensation details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.position} • {employee.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              ETB {employee.salary.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Monthly salary
                            </p>
                          </div>
                          <Badge variant="outline">
                            {employee.status === "Active" ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total Monthly Payroll:</span>
                        <span className="text-2xl font-bold text-primary">
                          ETB {filteredEmployees
                            .reduce((sum, e) => sum + e.salary, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* View Employee Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col" style={{ backgroundColor: "var(--background)" }}>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View complete employee information
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {selectedEmployee && (
              <div className="space-y-4 pr-4">
                <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--card)", boxShadow: "0 2px 8px rgba(107, 90, 70, 0.15)" }}>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-semibold">
                      {selectedEmployee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{selectedEmployee.name}</p>
                    <Badge className="mt-1" style={{ backgroundColor: selectedEmployee.status === "Active" ? "#10b981" : selectedEmployee.status === "On Leave" ? "#f59e0b" : "#ef4444", color: "white" }}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: "var(--card)", boxShadow: "0 2px 8px rgba(107, 90, 70, 0.15)" }}>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Email</p>
                    <p className="font-medium text-sm">{selectedEmployee.email}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Phone</p>
                    <p className="font-medium text-sm">{selectedEmployee.phone}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Position</p>
                    <p className="font-medium text-sm">{selectedEmployee.position}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
                    <p className="font-medium text-sm">{selectedEmployee.department}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Salary</p>
                    <p className="font-bold text-lg text-primary">
                      ETB {selectedEmployee.salary.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Join Date</p>
                    <p className="font-medium text-sm">{selectedEmployee.joinDate}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Attendance Rate</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedEmployee.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-sm">{selectedEmployee.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col" style={{ backgroundColor: "var(--background)" }}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the employee details below
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                <Input
                  id="position"
                  placeholder="Enter position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                <select
                  id="department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="IT">IT</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">Monthly Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter monthly salary"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseInt(e.target.value) || 0 })}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-sm font-medium">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                  className="border border-border rounded-lg"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#7D8B6F", color: "#FFFFFF" }}
              onClick={() => {
                if (newEmployee.name && newEmployee.email && newEmployee.position) {
                  const employee: Employee = {
                    id: Date.now().toString(),
                    ...newEmployee,
                    status: "Active",
                    attendanceRate: 100,
                    lastAttendance: new Date().toISOString().split('T')[0],
                  }
                  setEmployees([...employees, employee])
                  setNewEmployee({
                    name: "",
                    email: "",
                    phone: "",
                    position: "",
                    department: "Maintenance",
                    salary: 0,
                    joinDate: "",
                  })
                  setAddModalOpen(false)
                }
              }}
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
