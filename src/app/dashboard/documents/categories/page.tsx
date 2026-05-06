"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { Plus } from "lucide-react"

function CategoriesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [categories, setCategories] = useState<string[]>([
    "Applicant File",
    "Bill Files",
    "eSignature Documents",
    "Mobile Uploads",
    "Shared Reports",
    "Uncategorized",
    "Leases",
  ])

  const [fileCounts] = useState<Record<string, number>>({
    Leases: 21,
  })

  const handleLogout = async () => {
    const token = getAuthToken()
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Files"
          subtitle=""
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        />

        <main className="p-4 md:p-5">
          <div className="mx-auto max-w-[1320px]">
            <h1 className="text-[2rem] font-medium text-[#1F3549]">Manage file categories</h1>

            <div className="mt-4 overflow-hidden rounded border border-[#D9E1EB] bg-white">
              <table className="min-w-full">
                <thead className="bg-[#F2F5FA] text-left text-[1rem] font-semibold text-[#4A5562]">
                  <tr>
                    <th className="px-4 py-3">CATEGORY NAME</th>
                    <th className="px-4 py-3">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const count = fileCounts[c] ?? 0
                    return (
                      <tr key={c} className="border-t border-[#E7EDF5] text-[1rem] text-[#3B4D63]">
                        <td className="px-4 py-3">{c}</td>
                        <td className="px-4 py-3">
                          {count === 0
                            ? "No files are assigned to this category"
                            : `${count} files are assigned to this category`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setCategories((prev) => [...prev, `New Category ${prev.length - 5}`])}
              className="mt-3 inline-flex items-center gap-1 text-[1.2rem] text-[#2F79B7]"
            >
              <Plus className="h-5 w-5" /> Add a new category
            </button>

            <div className="mt-6 flex items-center gap-3">
              <button
                className="h-11 rounded-md bg-[#4E88C8] px-8 text-[1rem] font-semibold text-white hover:bg-[#3f79ba]"
                onClick={() => router.push("/dashboard/documents")}
              >
                Save
              </button>
              <button
                className="h-11 rounded-md border border-[#9CB7D8] bg-[#F7FAFE] px-6 text-[1rem] font-semibold text-[#4E88C8] hover:bg-[#EAF3FF]"
                onClick={() => router.push("/dashboard/documents")}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ManageCategoriesPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <CategoriesContent />
    </ProtectedRoute>
  )
}

