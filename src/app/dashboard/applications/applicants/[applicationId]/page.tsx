"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MessageSquare,
} from "lucide-react"

const theme = {
  primary: "#2563EB",
  success: "#10B981",
  warning: "#D97706",
  danger: "#DC2626",
  neutral: "#9CA3AF",
  background: "#F5F7FA",
  card: "#FFFFFF",
  ink: "#111827",
  muted: "#6B7280",
  line: "#E5E7EB",
  tableHead: "#F9FAFB",
  accent: "#4F46E5",
}

interface ApplicationDetail {
  id: string
  status: "For Review" | "Approved" | "Pending" | "Rejected" | "Lease/Term Created"
  applicantName: string
  unit: string
  idVerification: "Verified" | "Pending" | "Not Submitted"
  monthlyIncome: string
  employment: "Employed" | "Self-employed" | "Business Owner" | "Unemployed"
  phone: string
  email: string
  appliedDate: string
  property: string
  kebele: string
  subCity: string
  tinNumber?: string
  employer?: string
  emergencyContact?: string
  notes?: string
}

const mockApplication: ApplicationDetail = {
  id: "app_001",
  status: "For Review",
  applicantName: "Mehret Getachew",
  unit: "A-101",
  idVerification: "Verified",
  monthlyIncome: "15,000 - 25,000",
  employment: "Employed",
  phone: "+251 91 234 5678",
  email: "mehret.getachew@email.com",
  appliedDate: "March 15, 2026",
  property: "Rayuma Building",
  kebele: "Kebele 03",
  subCity: "Bole",
  tinNumber: "0123456789",
  employer: "Ethio Telecom",
  emergencyContact: "+251 92 345 6789",
}

export default function ApplicationDetailPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <ApplicationDetailContent />
    </ProtectedRoute>
  )
}

function ApplicationDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const applicationId = params.applicationId as string
  const application = mockApplication

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

  const getStatusBadge = (status: ApplicationDetail["status"]) => {
    const styles = {
      "For Review": { bg: "#EFF6FF", color: "#1D4ED8" },
      "Approved": { bg: "#ECFDF5", color: "#059669" },
      "Pending": { bg: "#FFFBEB", color: "#D97706" },
      "Rejected": { bg: "#FEF2F2", color: "#DC2626" },
      "Lease/Term Created": { bg: "#F3F4F6", color: "#6B7280" },
    }
    return styles[status]
  }

  const getIdVerificationBadge = (status: ApplicationDetail["idVerification"]) => {
    const styles = {
      "Verified": { bg: "#ECFDF5", color: "#059669" },
      "Pending": { bg: "#FFFBEB", color: "#D97706" },
      "Not Submitted": { bg: "#F3F4F6", color: "#6B7280" },
    }
    return styles[status]
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
                onClick={() => router.push("/dashboard/applications/applicants")}
                className="gap-2 rounded-lg border border-transparent px-3 py-2 text-sm hover:border-[#E5E7EB] hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold" style={{ color: theme.ink }}>
                  Application Details
                </h1>
                <p className="text-sm" style={{ color: theme.muted }}>
                  ID: {applicationId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border px-4 py-2 font-medium shadow-none"
                style={{ borderColor: "#D1D5DB", backgroundColor: "#fff", color: theme.ink }}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border px-4 py-2 font-medium shadow-none"
                style={{ borderColor: "#D1D5DB", backgroundColor: "#fff", color: theme.ink }}
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button
                size="sm"
                className="gap-2 rounded-lg px-4 py-2 font-medium shadow-none hover:opacity-95"
                style={{ backgroundColor: "#10B981", color: "#fff" }}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6" style={{ backgroundColor: theme.background }}>
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                        Applicant Information
                      </CardTitle>
                      <Badge
                        className="rounded-full px-2.5 py-1 text-[12px] font-medium"
                        style={getStatusBadge(application.status)}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-semibold" style={{ backgroundColor: theme.primary }}>
                        {application.applicantName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                          {application.applicantName}
                        </h3>
                        <p className="text-[13px]" style={{ color: theme.muted }}>
                          Applied on {application.appliedDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t pt-5 md:grid-cols-2" style={{ borderColor: theme.line }}>
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                          <Phone className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        </div>
                        <div>
                          <p className="text-[13px]" style={{ color: theme.muted }}>Phone</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                          <Mail className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        </div>
                        <div>
                          <p className="text-[13px]" style={{ color: theme.muted }}>Email</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                          <Building2 className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        </div>
                        <div>
                          <p className="text-[13px]" style={{ color: theme.muted }}>Unit Applied</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                          <MapPin className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        </div>
                        <div>
                          <p className="text-[13px]" style={{ color: theme.muted }}>Location</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.kebele}, {application.subCity}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                      Employment & Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[13px]" style={{ color: theme.muted }}>Employment Status</p>
                        <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.employment}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[13px]" style={{ color: theme.muted }}>Monthly Income (ETB)</p>
                        <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.monthlyIncome}</p>
                      </div>
                      {application.employer && (
                        <div>
                          <p className="mb-1 text-[13px]" style={{ color: theme.muted }}>Employer</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.employer}</p>
                        </div>
                      )}
                      {application.tinNumber && (
                        <div>
                          <p className="mb-1 text-[13px]" style={{ color: theme.muted }}>TIN Number</p>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.tinNumber}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-[15px] font-medium" style={{ color: theme.ink }}>{application.emergencyContact || "Not provided"}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-5">
                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between rounded-lg border p-3" style={{ backgroundColor: "#F9FAFB", borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        <span className="text-[15px] font-medium" style={{ color: theme.ink }}>ID Verification</span>
                      </div>
                      <Badge
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                        style={getIdVerificationBadge(application.idVerification)}
                      >
                        {application.idVerification}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3" style={{ backgroundColor: "#F9FAFB", borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" style={{ color: "#4F46E5" }} />
                        <span className="text-[15px] font-medium" style={{ color: theme.ink }}>Background Check</span>
                      </div>
                      <Badge
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                        style={getIdVerificationBadge(application.idVerification)}
                      >
                        Pending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0 pt-4">
                    <div className="flex items-center justify-between border-b py-3" style={{ borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                        <div>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>ID Document</p>
                          <p className="text-[13px]" style={{ color: theme.muted }}>kebele_id.pdf</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-lg border border-transparent hover:border-[#E5E7EB] hover:bg-[#F9FAFB]">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                        <div>
                          <p className="text-[15px] font-medium" style={{ color: theme.ink }}>Income Proof</p>
                          <p className="text-[13px]" style={{ color: theme.muted }}>salary_slip.pdf</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-lg border border-transparent hover:border-[#E5E7EB] hover:bg-[#F9FAFB]">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-none" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[18px] font-semibold" style={{ color: theme.ink }}>
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <Button className="w-full gap-2 rounded-lg border border-transparent py-2.5 font-medium shadow-none hover:opacity-95" style={{ backgroundColor: "#10B981", color: "#fff" }}>
                      <CheckCircle className="h-4 w-4" />
                      Approve Application
                    </Button>
                    <Button variant="outline" className="w-full gap-2 rounded-lg py-2.5 font-medium shadow-none" style={{ borderColor: "#D1D5DB", color: theme.ink }}>
                      <XCircle className="h-4 w-4" />
                      Reject Application
                    </Button>
                    <Button variant="outline" className="w-full gap-2 rounded-lg py-2.5 font-medium shadow-none" style={{ borderColor: "#D1D5DB", color: theme.ink }}>
                      <Clock className="h-4 w-4" />
                      Request More Info
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
