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
  Edit,
  Download,
  MessageSquare,
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
      "For Review": { bg: "#E8F2FF", color: theme.primary },
      "Approved": { bg: "#EAF7F1", color: theme.success },
      "Pending": { bg: "#FFF2E3", color: theme.warning },
      "Rejected": { bg: "#FDECEA", color: theme.danger },
      "Lease/Term Created": { bg: "#EEF2F6", color: theme.muted },
    }
    return styles[status]
  }

  const getIdVerificationBadge = (status: ApplicationDetail["idVerification"]) => {
    const styles = {
      "Verified": { bg: "#EAF7F1", color: theme.success },
      "Pending": { bg: "#FFF2E3", color: theme.warning },
      "Not Submitted": { bg: "#F1F3F5", color: theme.muted },
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
                className="gap-2"
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
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button
                size="sm"
                className="gap-2"
                style={{ backgroundColor: theme.success, color: "#fff" }}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
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
                        Applicant Information
                      </CardTitle>
                      <Badge
                        className="px-3 py-1 text-xs font-medium"
                        style={getStatusBadge(application.status)}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-semibold" style={{ backgroundColor: theme.primary }}>
                        {application.applicantName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: theme.ink }}>
                          {application.applicantName}
                        </h3>
                        <p className="text-sm" style={{ color: theme.muted }}>
                          Applied on {application.appliedDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F2FF" }}>
                          <Phone className="h-5 w-5" style={{ color: theme.primary }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: theme.muted }}>Phone</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F2FF" }}>
                          <Mail className="h-5 w-5" style={{ color: theme.primary }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: theme.muted }}>Email</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F2FF" }}>
                          <Building2 className="h-5 w-5" style={{ color: theme.primary }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: theme.muted }}>Unit Applied</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F2FF" }}>
                          <MapPin className="h-5 w-5" style={{ color: theme.primary }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: theme.muted }}>Location</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.kebele}, {application.subCity}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Employment & Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs mb-1" style={{ color: theme.muted }}>Employment Status</p>
                        <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.employment}</p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: theme.muted }}>Monthly Income (ETB)</p>
                        <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.monthlyIncome}</p>
                      </div>
                      {application.employer && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: theme.muted }}>Employer</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.employer}</p>
                        </div>
                      )}
                      {application.tinNumber && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: theme.muted }}>TIN Number</p>
                          <p className="text-sm font-medium" style={{ color: theme.ink }}>{application.tinNumber}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: theme.ink }}>{application.emergencyContact || "Not provided"}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: theme.primary }} />
                        <span className="text-sm" style={{ color: theme.ink }}>ID Verification</span>
                      </div>
                      <Badge
                        className="px-2 py-0.5 text-xs font-medium"
                        style={getIdVerificationBadge(application.idVerification)}
                      >
                        {application.idVerification}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" style={{ color: theme.primary }} />
                        <span className="text-sm" style={{ color: theme.ink }}>Background Check</span>
                      </div>
                      <Badge
                        className="px-2 py-0.5 text-xs font-medium"
                        style={getIdVerificationBadge(application.idVerification)}
                      >
                        Pending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: theme.muted }} />
                        <div>
                          <p className="text-sm" style={{ color: theme.ink }}>ID Document</p>
                          <p className="text-xs" style={{ color: theme.muted }}>kebele_id.pdf</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: theme.line }}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: theme.muted }} />
                        <div>
                          <p className="text-sm" style={{ color: theme.ink }}>Income Proof</p>
                          <p className="text-xs" style={{ color: theme.muted }}>salary_slip.pdf</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: theme.card, borderColor: theme.line }}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold" style={{ color: theme.ink }}>
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full gap-2" style={{ backgroundColor: theme.success, color: "#fff" }}>
                      <CheckCircle className="h-4 w-4" />
                      Approve Application
                    </Button>
                    <Button variant="outline" className="w-full gap-2" style={{ borderColor: theme.danger, color: theme.danger }}>
                      <XCircle className="h-4 w-4" />
                      Reject Application
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
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
