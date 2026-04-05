"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import NoticeBoard from "@/components/dashboard/NoticeBoard"
import NoticeManager from "@/components/dashboard/NoticeManager"

export default function TenantAnnouncementsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantAnnouncementsContent />
    </ProtectedRoute>
  )
}

function TenantAnnouncementsContent() {
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

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex min-h-screen flex-col">
        <DashboardHeader
          title="Announcements"
          subtitle="Latest notices from management"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        />

        <main className="flex-1 bg-[#F4F7FB] p-6">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
            <div>
              <NoticeManager allowSubmit={false} />
            </div>
            <div className="rounded-xl border border-[#D8E2EF] bg-white p-5 shadow-[0_8px_24px_rgba(31,53,73,0.08)]">
              <h3 className="mb-4 text-lg font-semibold text-[#1F3549]">Announcements</h3>
              <NoticeBoard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
