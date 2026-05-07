"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import { FileText, Calendar, MoreHorizontal, X } from "lucide-react"

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
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [ownerName, setOwnerName] = useState("Owner")
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStage, setUploadStage] = useState<"drop" | "details">("drop")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingMeta, setUploadingMeta] = useState<{
    file: File
    category: string
    description: string
  } | null>(null)

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

  useEffect(() => {
    const loadOwner = async () => {
      try {
        const token = getAuthToken()
        if (!token) return
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = await res.json().catch(() => ({}))
        const fullName =
          payload?.data?.user?.full_name ||
          payload?.data?.user?.name ||
          payload?.data?.owner?.full_name
        if (fullName) setOwnerName(String(fullName))
      } catch {
        // no-op
      }
    }
    loadOwner()
  }, [])

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
    setUploadModalOpen(true)
    setUploadStage("drop")
    setUploadProgress(0)
    setUploadingMeta(null)
  }

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files
    if (!selected || selected.length === 0) return
    prepareUpload(selected[0])
    event.target.value = ""
  }

  const prepareUpload = (file: File) => {
    setUploadingMeta({
      file,
      category: "Uncategorized",
      description: "",
    })
    setUploadProgress(0)
    setUploadStage("details")

    const interval = window.setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval)
          return 100
        }
        return Math.min(prev + 12, 100)
      })
    }, 120)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const droppedFile = event.dataTransfer.files?.[0]
    if (!droppedFile) return
    prepareUpload(droppedFile)
  }

  const saveUploadedFile = () => {
    if (!uploadingMeta) return
    const row: UploadedFile = {
      id: `${Date.now()}`,
      title: uploadingMeta.file.name,
      category: uploadingMeta.category || "Uncategorized",
      unit: "-",
      lastModifiedBy: ownerName,
      lastModifiedAt: new Date().toLocaleString(),
    }
    setFiles((prev) => [row, ...prev])
    setUploadModalOpen(false)
    setUploadStage("drop")
    setUploadProgress(0)
    setUploadingMeta(null)
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
            <div className="sticky top-0 z-20 -mx-2 mb-4 bg-[#F4F6FA] px-2 pb-3 pt-1">
              <div className="flex items-center justify-between">
              <h1 className="text-[1.25rem] font-medium text-[#1F3549]">Files</h1>
              <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="h-10 rounded-md bg-[#4E88C8] px-6 text-[0.95rem] font-semibold text-white hover:bg-[#4379B4]"
                  >
                    Upload account file
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/documents/categories")}
                    className="h-10 rounded-md border border-[#DDE5EF] bg-white px-6 text-[0.95rem] font-semibold text-[#4E88C8] hover:bg-slate-50"
                  >
                    Manage categories
                  </button>
              </div>
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

              <div className="mt-4 border-t border-[#E7EDF5] pt-3 text-[1.05rem] font-medium text-[#6F839A]">{filteredFiles.length} matches</div>

              {selectedIds.length > 0 && (
                <div className="mt-2 flex items-center justify-between rounded bg-[#2F79B7] px-3 py-2 text-white">
                  <div className="text-[0.92rem]">
                    {selectedIds.length} selected{" "}
                    <button
                      type="button"
                      className="ml-3 font-semibold underline"
                      onClick={() => setSelectedIds([])}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-[0.92rem] font-semibold">
                    <button type="button">Update category</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailTo("")
                        setEmailSubject("Files update")
                        setEmailBody("Please find the selected files update.")
                        setEmailModalOpen(true)
                      }}
                    >
                      Email
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-2 overflow-x-auto rounded border border-[#E0E7F0]">
                <table className="min-w-full">
                  <thead className="bg-[#F2F5FA]">
                    <tr className="text-left text-[0.9rem] font-semibold text-[#31485F]">
                      <th className="px-4 py-2.5 w-[56px]">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border border-[#AEB8C6]"
                          checked={filteredFiles.length > 0 && selectedIds.length === filteredFiles.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(filteredFiles.map((f) => f.id))
                            } else {
                              setSelectedIds([])
                            }
                          }}
                        />
                      </th>
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
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border border-[#AEB8C6]"
                            checked={selectedIds.includes(row.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, row.id])
                              } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== row.id))
                              }
                            }}
                          />
                        </td>
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
                          <div className="text-[0.86rem] italic text-[#5F7288]">by {ownerName}</div>
                        </td>
                        <td className="px-4 py-3 text-right relative">
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#C9D3DF] text-[#7C8EA2]"
                            onClick={() => setOpenActionFor((prev) => (prev === row.id ? null : row.id))}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openActionFor === row.id && (
                            <div className="absolute right-12 top-10 z-30 w-44 rounded-md border border-[#D6DFEA] bg-white py-1 shadow-lg">
                              {["Delete", "Email", "Download", "View"].map((action) => (
                                <button
                                  key={action}
                                  type="button"
                                  className="block w-full px-4 py-2 text-left text-[0.95rem] text-[#3F556B] hover:bg-[#F2F7FF]"
                                  onClick={() => {
                                    if (action === "Email") {
                                      setEmailTo("")
                                      setEmailSubject(`Regarding ${row.title}`)
                                      setEmailBody("")
                                      setEmailModalOpen(true)
                                    }
                                    setOpenActionFor(null)
                                  }}
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
        onChange={handleFilesSelected}
      />

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 pt-20">
          <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-[#D7DEE9] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4EAF2] px-6 py-4">
              <h3 className="text-[1.55rem] font-medium text-[#344B63]">Upload account files</h3>
              <button
                type="button"
                className="text-[#98A6B6]"
                onClick={() => {
                  setUploadModalOpen(false)
                  setUploadStage("drop")
                  setUploadingMeta(null)
                  setUploadProgress(0)
                }}
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {uploadStage === "drop" && (
              <div className="p-6">
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex h-44 items-center justify-center rounded-md border border-dashed text-[1rem] ${
                    isDragOver
                      ? "border-[#4E88C8] bg-[#F1F7FF] text-[#2F79B7]"
                      : "border-[#B8C2D0] text-[#617588]"
                  }`}
                >
                  <span>
                    Drag & Drop files here or{" "}
                    <button
                      type="button"
                      className="font-semibold text-[#2F79B7] underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse
                    </button>
                  </span>
                </div>
              </div>
            )}

            {uploadStage === "details" && uploadingMeta && (
              <div>
                <div className="px-6 pt-6">
                  <div className="h-4 rounded-full bg-[#EDF1F6]">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-[#6FB47E] to-[#6BA3CF]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-hidden rounded border border-[#D9E1EB]">
                    <div className="grid grid-cols-3 bg-[#F2F5FA] px-5 py-3 text-[1rem] font-semibold text-[#3E556C]">
                      <div>TITLE</div>
                      <div>CATEGORY</div>
                      <div>DESCRIPTION</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 px-5 py-4">
                      <input
                        value={uploadingMeta.file.name}
                        readOnly
                        className="h-12 rounded border border-[#D8DFE9] px-4 text-[0.95rem] text-[#2E4358]"
                      />
                      <select
                        value={uploadingMeta.category}
                        onChange={(e) =>
                          setUploadingMeta((prev) =>
                            prev ? { ...prev, category: e.target.value } : prev
                          )
                        }
                        className="h-12 rounded border border-[#D8DFE9] px-4 text-[0.95rem] text-[#2E4358]"
                      >
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        value={uploadingMeta.description}
                        onChange={(e) =>
                          setUploadingMeta((prev) =>
                            prev ? { ...prev, description: e.target.value } : prev
                          )
                        }
                        className="h-12 rounded border border-[#D8DFE9] px-4 text-[0.95rem] text-[#2E4358]"
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-[#E4EAF2] px-6 py-4">
                  <button
                    type="button"
                    className="h-11 rounded-md border border-[#CED7E4] bg-[#F2F5FA] px-7 text-[0.95rem] font-semibold text-[#A4AEB8]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="h-11 rounded-md border border-[#CED7E4] bg-[#F2F5FA] px-7 text-[0.95rem] font-semibold text-[#A4AEB8]"
                  >
                    Save and share
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalOpen(false)
                      setUploadStage("drop")
                      setUploadingMeta(null)
                      setUploadProgress(0)
                    }}
                    className="h-11 px-3 text-[1rem] font-semibold text-[#657A8F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveUploadedFile}
                    className="ml-auto h-11 rounded-md bg-[#4E88C8] px-7 text-[0.95rem] font-semibold text-white hover:bg-[#3f79ba]"
                    disabled={uploadProgress < 100}
                  >
                    Finish Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-5xl rounded-xl border border-[#D6DFEA] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4EAF2] px-5 py-3">
              <h3 className="text-[2rem] font-medium text-[#1F3549]">New email</h3>
              <button type="button" onClick={() => setEmailModalOpen(false)} className="text-[#7B8DA2]">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                <label className="text-[1rem] text-[#5D6F83]">To</label>
                <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="h-10 rounded border border-[#D8DFE9] px-3 text-[0.95rem]" />
              </div>
              <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                <label className="text-[1rem] text-[#5D6F83]">Subject</label>
                <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="h-10 rounded border border-[#D8DFE9] px-3 text-[0.95rem]" />
              </div>
              <div>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[280px] w-full rounded border border-[#D8DFE9] px-3 py-2 text-[0.95rem]"
                />
              </div>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="h-10 rounded-md bg-[#7BB286] px-6 text-[0.95rem] font-semibold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
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
