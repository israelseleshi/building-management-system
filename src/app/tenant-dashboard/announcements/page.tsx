"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

const mockAnnouncements = [
  {
    id: "ann-1",
    title: "Water Maintenance Notice",
    body: "Water service will be temporarily unavailable on Saturday from 9:00 AM to 12:00 PM.",
    createdAt: "2026-03-30",
  },
  {
    id: "ann-2",
    title: "Elevator Inspection",
    body: "Routine elevator safety inspection is scheduled for next Tuesday.",
    createdAt: "2026-03-27",
  },
]

export default function TenantAnnouncementsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <AnnouncementsContent />
    </ProtectedRoute>
  )
}

function AnnouncementsContent() {
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
    <div className="min-h-screen flex bg-[#F4F5F8]">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Announcements"
          subtitle="Property updates and notices"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        />
        <main className="p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-3">
            {mockAnnouncements.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#DCE3EE] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold text-[#223042]">{item.title}</h2>
                  <span className="text-xs text-[#6C7D90]">{item.createdAt}</span>
                </div>
                <p className="mt-2 text-sm text-[#46576A]">{item.body}</p>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
