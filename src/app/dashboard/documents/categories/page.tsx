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
  const [newCategoryName, setNewCategoryName] = useState("")

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
    <div className="flex min-h-screen flex-col bg-[#F4F6FA]">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
          onLogout={handleLogout}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Files"
            subtitle=""
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-5">
            <div className="mx-auto max-w-[1320px]">
              <h1 className="text-[1.25rem] font-medium text-[#1F3549]">Manage file categories</h1>

              <div className="mt-4 overflow-hidden rounded border border-[#D9E1EB] bg-white">
                <table className="min-w-full">
                  <thead className="bg-[#F2F5FA] text-left text-[0.85rem] font-semibold text-[#4A5562]">
                    <tr>
                      <th className="px-4 py-2.5">CATEGORY NAME</th>
                      <th className="px-4 py-2.5">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {categories.map((c) => {
                      const count = fileCounts[c] ?? 0
                      return (
                        <tr key={c} className="border-t border-[#E7EDF5] text-[0.9rem] text-[#3B4D63]">
                          <td className="px-4 py-2.5">{c}</td>
                          <td className="px-4 py-2.5">
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

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setNewCategoryName("New Category")}
                  className="inline-flex items-center gap-1 text-[0.95rem] text-[#2F79B7] hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add a new category
                </button>
                {newCategoryName !== "" && (
                  <div className="mt-2 flex max-w-md items-center gap-2">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="h-8 w-full rounded border border-[#D8DFE9] px-3 text-[0.85rem]"
                    />
                    <button
                      type="button"
                      className="h-8 rounded-md bg-[#4E88C8] px-4 text-[0.8rem] font-semibold text-white"
                      onClick={() => {
                        const trimmed = newCategoryName.trim()
                        if (!trimmed) return
                        setCategories((prev) => [...prev, trimmed])
                        setNewCategoryName("")
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  className="h-9 rounded-md bg-[#4E88C8] px-8 text-[0.9rem] font-semibold text-white hover:bg-[#4379B4]"
                  onClick={() => router.push("/dashboard/documents")}
                >
                  Save
                </button>
                <button
                  className="h-9 px-6 text-[0.9rem] font-semibold text-[#4E88C8] hover:underline"
                  onClick={() => router.push("/dashboard/documents")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <footer className="mt-8 border-t border-[#D9E1EB] py-4 text-center">
        <div className="flex flex-col items-center gap-2 text-[0.8rem] text-[#677A8F]">
          <span>
            &copy; {new Date().getFullYear()} Powered by Smart BMS. All rights reserved.
          </span>
          <div className="flex items-center gap-4 font-medium text-[#2F79B7]">
            <button type="button" className="hover:underline">Privacy Policy</button>
            <button type="button" className="hover:underline">Security</button>
            <button type="button" className="hover:underline">Terms of Use</button>
          </div>
        </div>
      </footer>
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
