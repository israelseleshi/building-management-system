"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Text, Heading } from "@/components/ui/typography"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LandlordDocumentReview } from "@/components/documents"
import { supabase } from "@/lib/supabaseBrowser"
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  PlusCircle,
} from "lucide-react"

interface Document {
  id: string
  file_name: string
  file_path: string
  file_size: number
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  created_at: string
  tenant_id: string
  document_type?: {
    id: string
    name: string
  }
  tenant_name?: string
}

function LandlordDocumentsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending")

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
      path: "/dashboard/create-listing",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Rents",
      path: "/dashboard/leases",
      active: false,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Documents",
      path: "/dashboard/documents",
      active: true,
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
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/signin")
          return
        }

        // Fetch all documents for this landlord's tenants.
        // NOTE: Avoid joining profiles here because profiles RLS can block the join and make the
        // whole query fail/return empty even when tenant_documents are present.
        const { data: docsData, error: docsError } = await supabase
          .from("tenant_documents")
          .select("*, document_type:document_types(*)")
          .eq("landlord_id", user.id)
          .order("created_at", { ascending: false })

        if (docsError) {
          console.error("Error fetching landlord documents:", docsError)
        }

        // tenant_name is optional; we can add it later if profiles RLS permits.
        setDocuments((docsData as any) || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleApproveDocument = async (documentId: string) => {
    try {
      await supabase
        .from("tenant_documents")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", documentId)

      // Update local state
      setDocuments(
        documents.map((doc) =>
          doc.id === documentId ? { ...doc, status: "approved" } : doc
        )
      )
    } catch (error) {
      console.error("Error approving document:", error)
      throw error
    }
  }

  const handleRejectDocument = async (documentId: string, reason: string) => {
    try {
      await supabase
        .from("tenant_documents")
        .update({
          status: "rejected",
          rejection_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)

      // Update local state
      setDocuments(
        documents.map((doc) =>
          doc.id === documentId
            ? { ...doc, status: "rejected", rejection_reason: reason }
            : doc
        )
      )
    } catch (error) {
      console.error("Error rejecting document:", error)
      throw error
    }
  }

  const handleDownloadDocument = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from("tenant-documents")
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank")
      }
    } catch (error) {
      console.error("Error downloading document:", error)
      throw error
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const stats = [
    {
      title: "Total Documents",
      value: documents.length,
      color: "text-blue-600",
    },
    {
      title: "Pending Review",
      value: documents.filter((d) => d.status === "pending").length,
      color: "text-yellow-600",
    },
    {
      title: "Approved",
      value: documents.filter((d) => d.status === "approved").length,
      color: "text-emerald-600",
    },
    {
      title: "Rejected",
      value: documents.filter((d) => d.status === "rejected").length,
      color: "text-red-600",
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
            title="Tenant Documents"
            subtitle="Loading documents..."
          />

          <main className="p-6 flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Text className="text-muted-foreground">Loading documents...</Text>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Tenant Documents"
          subtitle="Review and manage tenant documents"
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-5 md:p-6 border-0"
                  style={{
                    backgroundColor: "var(--card)",
                    boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                  }}
                >
                  <Text className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </Text>
                  <Heading level={3} className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </Heading>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
              {(["pending", "approved", "rejected", "all"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-[#7D8B6F] text-white"
                      : "bg-card text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Documents List */}
            <div>
              <Heading level={2} className="mb-6">
                Documents
              </Heading>
              <LandlordDocumentReview
                documents={documents}
                filterStatus={filterStatus}
                onApprove={handleApproveDocument}
                onReject={handleRejectDocument}
                onDownload={handleDownloadDocument}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default function LandlordDocumentsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <LandlordDocumentsContent />
    </ProtectedRoute>
  )
}
