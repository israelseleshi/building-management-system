"use client"

import { useMemo, useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter } from "next/navigation"
import { Wrench, PlaneTakeoff, ArrowLeft } from "lucide-react"

type RequestType = "maintenance" | "leave"

export default function TenantRequestsPage() {
  return (
    <ProtectedRoute requiredRole="tenant">
      <TenantRequestsContent />
    </ProtectedRoute>
  )
}

function TenantRequestsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [requestType, setRequestType] = useState<RequestType | null>(null)

  const requestTarget = useMemo(
    () =>
      requestType === "leave"
        ? "/tenant-dashboard/leave?embed=1"
        : "/tenant-dashboard/maintenance?embed=1&mode=create",
    [requestType]
  )

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={[]}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
        onNavigate={(isCurrentlyCollapsed) => {
          if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true)
        }}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Create Request"
          subtitle="Choose a request type and continue from this page"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          searchPlaceholder="Search..."
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl rounded-xl border border-[#E6ECF5] bg-white p-4 shadow-[0_8px_24px_rgba(20,54,94,0.05)] sm:p-6">
            {requestType ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EEF6] pb-3">
                  <button
                    onClick={() => setRequestType(null)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#D8E3F2] px-3 py-2 text-sm font-medium text-[#31587F] hover:bg-[#F5F9FF]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Request Types
                  </button>
                  <div className="text-sm font-semibold text-[#31587F]">
                    {requestType === "maintenance" ? "Maintenance Request" : "Leave Request"}
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#E8EEF6]">
                  <iframe
                    src={requestTarget}
                    title={requestType === "maintenance" ? "Maintenance Request UI" : "Leave Request UI"}
                    className="h-[980px] w-full bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-[#1F3549]">How can we help you today?</h2>
                <p className="mt-1 text-sm text-[#6B7F98]">Choose one request type to continue.</p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    onClick={() => setRequestType("maintenance")}
                    className="rounded-lg border border-[#D8E3F2] bg-[#FBFDFF] p-6 text-left transition hover:border-[#A7CBF7] hover:bg-[#F3F8FF]"
                  >
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D3E3FA] bg-[#EAF3FF]">
                      <Wrench className="h-5 w-5 text-[#4C8FE2]" />
                    </div>
                    <div className="text-base font-semibold text-[#1F3549]">Maintenance Request</div>
                    <p className="mt-1 text-sm text-[#6B7F98]">Report issues like plumbing, electrical, or appliance problems.</p>
                  </button>

                  <button
                    onClick={() => setRequestType("leave")}
                    className="rounded-lg border border-[#D8E3F2] bg-[#FBFDFF] p-6 text-left transition hover:border-[#A7CBF7] hover:bg-[#F3F8FF]"
                  >
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D3E3FA] bg-[#EAF3FF]">
                      <PlaneTakeoff className="h-5 w-5 text-[#4C8FE2]" />
                    </div>
                    <div className="text-base font-semibold text-[#1F3549]">Leave Request</div>
                    <p className="mt-1 text-sm text-[#6B7F98]">Submit permanent move-out or temporary leave requests.</p>
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
