"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Eye,
  Settings,
  FileText,
} from "lucide-react"

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
  accent: "#3096DA",
}

interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  options?: string[]
}

interface FormDetail {
  id: string
  name: string
  description: string
  status: "Active" | "Draft"
  fields: FormField[]
  createdAt: string
  updatedAt: string
  responseCount: number
}

const mockForm: FormDetail = {
  id: "frm_001",
  name: "Standard Addis Rental Form",
  description: "Basic rental application form for residential properties in Addis Ababa",
  status: "Active",
  createdAt: "Jan 15, 2024",
  updatedAt: "Mar 10, 2024",
  responseCount: 24,
  fields: [
    { id: "1", label: "Full Name", type: "text", required: true },
    { id: "2", label: "Phone Number", type: "tel", required: true },
    { id: "3", label: "Email Address", type: "email", required: true },
    { id: "4", label: "Unit Preference", type: "select", required: true, options: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom"] },
    { id: "5", label: "Monthly Income", type: "select", required: true, options: ["< 10,000", "10,000 - 25,000", "25,000 - 50,000", "> 50,000"] },
    { id: "6", label: "Employment Status", type: "radio", required: true, options: ["Employed", "Self-employed", "Business Owner"] },
    { id: "7", label: "Kebele ID Number", type: "text", required: true },
    { id: "8", label: "Emergency Contact", type: "tel", required: true },
    { id: "9", label: "Previous Landlord Reference", type: "text", required: false },
    { id: "10", label: "Additional Notes", type: "textarea", required: false },
  ],
}

export default function FormDetailPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <FormDetailContent />
    </ProtectedRoute>
  )
}

function FormDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const formId = params.formId as string
  const form = mockForm

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
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
    <div className="min-h-screen flex">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
        onToggleSidebar={toggleSidebar}
        appBrandName="BMS"
      />

      <div className="flex-1 flex flex-col">
        <header className="border-b px-6 py-4" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/applications/forms")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold" style={{ color: theme.ink }}>
                  {form.name}
                </h1>
                <p className="text-sm" style={{ color: theme.muted }}>
                  Form ID: {formId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                size="sm"
                className="gap-2"
                style={{ backgroundColor: theme.primary, color: "#fff" }}
              >
                <Edit className="h-4 w-4" />
                Edit Form
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6" style={{ background: "linear-gradient(180deg, #E9EDF3 0%, #E6EBF2 42%, #E3E8EF 100%)" }}>
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                        Form Fields
                      </CardTitle>
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: form.status === "Active" ? "#EAF7F1" : "#F1F3F5",
                          color: form.status === "Active" ? theme.success : theme.muted,
                        }}
                      >
                        {form.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {form.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                          style={{ borderColor: theme.line }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium" style={{ backgroundColor: "#E8F2FF", color: theme.primary }}>
                              {index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: theme.ink }}>{field.label}</span>
                                {field.required && (
                                  <span className="text-xs" style={{ color: theme.danger }}>*</span>
                                )}
                              </div>
                              <span className="text-xs" style={{ color: theme.muted }}>{field.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {field.options && (
                              <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: "#F1F3F5", color: theme.muted }}>
                                {field.options.length} options
                              </span>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Form Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: theme.muted }}>Description</p>
                      <p className="text-sm" style={{ color: theme.ink }}>{form.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-1" style={{ color: theme.muted }}>Created</p>
                        <p className="text-sm font-medium" style={{ color: theme.ink }}>{form.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: theme.muted }}>Last Updated</p>
                        <p className="text-sm font-medium" style={{ color: theme.ink }}>{form.updatedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                      <FileText className="h-5 w-5" style={{ color: theme.primary }} />
                      <div>
                        <p className="text-xs" style={{ color: theme.muted }}>Total Responses</p>
                        <p className="text-lg font-semibold" style={{ color: theme.ink }}>{form.responseCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full gap-2" style={{ backgroundColor: theme.primary, color: "#fff" }}>
                      <Copy className="h-4 w-4" />
                      Duplicate Form
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      View Responses
                    </Button>
                    <Button variant="outline" className="w-full gap-2" style={{ borderColor: theme.danger, color: theme.danger }}>
                      <Trash2 className="h-4 w-4" />
                      Delete Form
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
