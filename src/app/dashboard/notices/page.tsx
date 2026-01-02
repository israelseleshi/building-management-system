"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import NoticeBoard from "@/components/dashboard/NoticeBoard"
import NoticeManager from "@/components/dashboard/NoticeManager"

export default function ManageNoticesPage() {
  return (
    <ProtectedRoute requiredRole="owner">
      <NoticesPageContent />
    </ProtectedRoute>
  )
}

function NoticesPageContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Manage Global Notices"
          subtitle="Post and view notices for all tenants"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Post a New Notice</h3>
              <NoticeManager />
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Posted Notices</h3>
              <NoticeBoard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
