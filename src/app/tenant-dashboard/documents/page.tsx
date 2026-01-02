"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Text, Heading } from "@/components/ui/typography"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { TenantDocumentUpload, DocumentList } from "@/components/documents"
import { supabase } from "@/lib/supabaseBrowser"
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  Grid,
} from "lucide-react"

interface DocumentType {
  id: string
  name: string
  description: string
  is_required: boolean
}

interface Document {
  id: string
  file_name: string
  file_path: string
  file_size: number
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  created_at: string
  document_type?: DocumentType
}

function TenantDocumentsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const activeTab: string = "documents"

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/tenant-dashboard",
      active: activeTab === "dashboard",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "Listings",
      path: "/tenant-dashboard/listings",
      active: activeTab === "listings",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "My Rents",
      path: "/tenant-dashboard/leases",
      active: activeTab === "leases",
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: "Documents",
      path: "/tenant-dashboard/documents",
      active: activeTab === "documents",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/tenant-dashboard/chat",
      active: activeTab === "chat",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/tenant-dashboard/settings",
      active: activeTab === "settings",
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

        setCurrentUserId(user.id)

        // Fetch document types
        const { data: typesData, error: typesError } = await supabase
          .from("document_types")
          .select("*")
          .order("name")

        if (typesError) {
          console.error("Error fetching document types:", typesError)
        }

        setDocumentTypes(typesData || [])

        // Fetch tenant's documents
        const { data: docsData } = await supabase
          .from("tenant_documents")
          .select("*, document_type:document_types(*)")
          .eq("tenant_id", user.id)
          .order("created_at", { ascending: false })

        setDocuments(docsData || [])

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleUploadSuccess = async () => {
    // Refresh documents list
    if (!currentUserId) return

    try {
      const { data: docsData } = await supabase
        .from("tenant_documents")
        .select("*, document_type:document_types(*)")
        .eq("tenant_id", currentUserId)
        .order("created_at", { ascending: false })

      setDocuments(docsData || [])
    } catch (error) {
      console.error("Error refreshing documents:", error)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // Get document details
      const document = documents.find((d) => d.id === documentId)
      if (!document) return

      // Delete from storage
      await supabase.storage
        .from("tenant-documents")
        .remove([document.file_path])

      // Delete from database
      await supabase
        .from("tenant_documents")
        .delete()
        .eq("id", documentId)

      // Update local state
      setDocuments(documents.filter((d) => d.id !== documentId))
    } catch (error) {
      console.error("Error deleting document:", error)
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
    
    // Clear local storage and cookies
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
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
            title="Documents"
            subtitle="Loading your documents..."
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
          title="My Documents"
          subtitle="Upload and manage your documents"
        />

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{
                  backgroundColor: "var(--card)",
                  boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                }}
              >
                <Text className="text-sm text-muted-foreground mb-1">
                  Total Documents
                </Text>
                <Heading level={3} className="text-2xl font-bold text-blue-600">
                  {documents.length}
                </Heading>
              </div>

              <div
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{
                  backgroundColor: "var(--card)",
                  boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                }}
              >
                <Text className="text-sm text-muted-foreground mb-1">
                  Approved
                </Text>
                <Heading level={3} className="text-2xl font-bold text-emerald-600">
                  {documents.filter((d) => d.status === "approved").length}
                </Heading>
              </div>

              <div
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{
                  backgroundColor: "var(--card)",
                  boxShadow: "0 4px 12px rgba(107, 90, 70, 0.25)",
                }}
              >
                <Text className="text-sm text-muted-foreground mb-1">
                  Pending Review
                </Text>
                <Heading level={3} className="text-2xl font-bold text-yellow-600">
                  {documents.filter((d) => d.status === "pending").length}
                </Heading>
              </div>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <Heading level={2} className="mb-6">
                Upload New Document
              </Heading>
              {currentUserId && (
                <TenantDocumentUpload
                  documentTypes={documentTypes}
                  onUploadSuccess={handleUploadSuccess}
                  tenantId={currentUserId}
                />
              )}
            </div>

            {/* Documents List */}
            <div>
              <Heading level={2} className="mb-6">
                Your Documents
              </Heading>
              <DocumentList
                documents={documents}
                onDelete={handleDeleteDocument}
                onDownload={handleDownloadDocument}
                userRole="tenant"
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default function TenantDocumentsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantDocumentsContent />
    </ProtectedRoute>
  )
}
