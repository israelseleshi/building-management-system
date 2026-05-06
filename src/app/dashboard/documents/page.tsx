"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { FileText, Calendar, MoreHorizontal } from "lucide-react"

type UploadedFile = {
  id: string
  title: string
  category: string
  unit: string
  lastModifiedBy: string
  lastModifiedAt: string
}

function FilesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [uploadedRange, setUploadedRange] = useState("Last 90 days")
  const [dateFrom, setDateFrom] = useState("2026-02-05")
  const [dateTo, setDateTo] = useState("2026-05-06")
  const [openActionFor, setOpenActionFor] = useState<string | null>(null)

  const [categories] = useState<string[]>([
    "Applicant File",
    "Bill Files",
    "eSignature Documents",
    "Mobile Uploads",
    "Shared Reports",
    "Uncategorized",
    "Leases",
  ])

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      title: "Lease document",
      category: "Leases",
      unit: "3 Industrial Road - A",
      lastModifiedBy: "sfsdfa asfasdfa",
      lastModifiedAt: "5/6/2026 1:42 AM",
    },
    {
      id: "2",
      title: "Lease document",
      category: "Leases",
      unit: "160 East End Avenue - 1",
      lastModifiedBy: "sfsdfa asfasdfa",
      lastModifiedAt: "5/6/2026 1:41 AM",
    },
  ])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const byCategory = categoryFilter === "All Categories" || f.category === categoryFilter
      const q = searchQuery.trim().toLowerCase()
      const bySearch = !q || f.title.toLowerCase().includes(q) || f.unit.toLowerCase().includes(q)
      return byCategory && bySearch
    })
  }, [files, categoryFilter, searchQuery])

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

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files
    if (!selected || selected.length === 0) return

    const appended: UploadedFile[] = Array.from(selected).map((f, idx) => ({
      id: `${Date.now()}-${idx}`,
      title: f.name,
      category: "Uncategorized",
      unit: "-",
      lastModifiedBy: "You",
      lastModifiedAt: new Date().toLocaleString(),
    }))

    setFiles((prev) => [...appended, ...prev])
    event.target.value = ""
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
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-[2rem] font-medium text-[#1F3549]">Files</h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="h-11 rounded-md bg-[#7BB286] px-6 text-[1rem] font-semibold text-white hover:bg-[#6fa47a]"
                >
                  Upload account file
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/documents/categories")}
                  className="h-11 rounded-md border border-[#9CB7D8] bg-[#F7FAFE] px-6 text-[1rem] font-semibold text-[#4E88C8] hover:bg-[#EAF3FF]"
                >
                  Manage categories
                </button>
              </div>
            </div>

            <div className="rounded-md border border-[#DDE5EF] bg-white p-4">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_1.1fr_1fr_180px_180px]">
                <div>
                  <label className="mb-1 block text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#677A8F]">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-10 w-full rounded border border-[#D8DFE9] px-3 text-[0.9rem] text-[#30485F]"
                  >
                    <option>All Categories</option>
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#677A8F]">Uploaded</label>
                  <select
                    value={uploadedRange}
                    onChange={(e) => setUploadedRange(e.target.value)}
                    className="h-10 w-full rounded border border-[#D8DFE9] px-3 text-[0.9rem] text-[#30485F]"
                  >
                    <option>Last 90 days</option>
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <DateInput label="From" value={dateFrom} onChange={setDateFrom} />
                <DateInput label="To" value={dateTo} onChange={setDateTo} />
              </div>

              <div className="mt-4 border-t border-[#E7EDF5] pt-3 text-[1.4rem] text-[#7B8DA2]">{filteredFiles.length} matches</div>

              <div className="mt-2 overflow-x-auto rounded border border-[#E0E7F0]">
                <table className="min-w-full">
                  <thead className="bg-[#F2F5FA]">
                    <tr className="text-left text-[0.9rem] font-semibold text-[#31485F]">
                      <th className="px-4 py-2.5">TITLE</th>
                      <th className="px-4 py-2.5">CATEGORY</th>
                      <th className="px-4 py-2.5">UNIT</th>
                      <th className="px-4 py-2.5">LAST MODIFIED BY</th>
                      <th className="px-4 py-3 w-[70px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((row) => (
                      <tr key={row.id} className="border-t border-[#E7EDF5] text-[#273F56]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#A0A9B3]" />
                            <span className="text-[0.95rem] font-semibold">{row.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[0.95rem]">{row.category}</td>
                        <td className="px-4 py-3 text-[0.95rem]">{row.unit}</td>
                        <td className="px-4 py-3">
                          <div className="text-[0.95rem]">{row.lastModifiedAt}</div>
                          <div className="text-[0.86rem] italic text-[#5F7288]">by {row.lastModifiedBy}</div>
                        </td>
                        <td className="px-4 py-3 text-right relative">
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#C9D3DF] text-[#7C8EA2]"
                            onClick={() => setOpenActionFor((prev) => (prev === row.id ? null : row.id))}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openActionFor === row.id && (
                            <div className="absolute right-3 top-12 z-20 w-44 rounded-md border border-[#D6DFEA] bg-white py-1 shadow-lg">
                              {["Delete", "Email", "Download", "View"].map((action) => (
                                <button
                                  key={action}
                                  type="button"
                                  className="block w-full px-4 py-2 text-left text-[0.95rem] text-[#3F556B] hover:bg-[#F2F7FF]"
                                  onClick={() => setOpenActionFor(null)}
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFilesSelected}
      />
    </div>
  )
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#677A8F]">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded border border-[#D8DFE9] px-3 pr-9 text-[0.9rem] text-[#30485F]"
        />
        <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
      </div>
    </div>
  )
}

export default function LandlordDocumentsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <FilesContent />
    </ProtectedRoute>
  )
}
