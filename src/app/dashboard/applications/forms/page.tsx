"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, AlignLeft, Plus, Edit, Trash2, FileText, X, ChevronRight, Settings2, ListChecks, SlidersHorizontal, Eye, GripVertical, Upload, ImagePlus, CheckCircle, Star } from "lucide-react"

const theme: Record<string, string> = {
  primary: "#3498DB",
  success: "#4DB6A1",
  danger: "#E15949",
  background: "#E9EDF3",
  card: "#FFFFFF",
  ink: "#1F3549",
  muted: "#7B8C9D",
  line: "#D9E1E8",
  tableHead: "#F5F8FB",
  appNav: "#0A2A43",
  appNavActive: "#113B5E",
  accent: "#3096DA",
}

type BuilderTab = "settings" | "fields" | "custom" | "preview"
type BuilderPhase = "closed" | "start" | "rising" | "splash" | "sliding" | "open"

interface FormTemplate { id: string; name: string; description: string; fields: number; createdAt: string; status: "Active" | "Draft"; isDefault?: boolean }
interface SectionConfig { id: string; name: string; fields: string[]; enabled: boolean; allowAdditionalEntries: boolean }

const forms: FormTemplate[] = [
  { id: "frm_001", name: "Standard Addis Rental Form", description: "Main residential intake form for Addis Ababa properties", fields: 17, createdAt: "Jan 15, 2026", status: "Active", isDefault: true },
  { id: "frm_002", name: "Commercial Tenant Form", description: "Business tenant form with legal and TIN verification fields", fields: 19, createdAt: "Feb 20, 2026", status: "Active" },
  { id: "frm_003", name: "Shared Housing Form", description: "Form optimized for shared compounds and family occupancy", fields: 13, createdAt: "Mar 10, 2026", status: "Draft" },
]

const initialSections: SectionConfig[] = [
  { id: "sec_personal", name: "Personal Information", fields: ["First Name", "Father Name", "Grandfather Name", "Mobile Number", "Email", "Date of Birth"], enabled: true, allowAdditionalEntries: false },
  { id: "sec_address", name: "Address Information", fields: ["Region", "City", "Sub-City", "Woreda", "House Number"], enabled: true, allowAdditionalEntries: false },
  { id: "sec_household", name: "Household Information", fields: ["Number of Occupants", "Children Count", "Dependents", "Relationship to Applicant"], enabled: true, allowAdditionalEntries: true },
  { id: "sec_income", name: "Income & Business Information", fields: ["Monthly Income (ETB)", "Income Source", "Employer or Business Name", "TIN (if available)"], enabled: true, allowAdditionalEntries: false },
  { id: "sec_reference", name: "References & Emergency Contact", fields: ["Reference Full Name", "Reference Phone", "Emergency Contact", "Emergency Contact Phone"], enabled: true, allowAdditionalEntries: true },
]

const DEFAULT_LOGO_URL = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=220&q=80"
const DEFAULT_HEADER_URL = "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80"

export default function FormsPage() {
  return <ProtectedRoute requiredRole="landlord"><FormsContent /></ProtectedRoute>
}

function FormsContent() {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [builderPhase, setBuilderPhase] = useState<BuilderPhase>("closed")
  const [activeTab, setActiveTab] = useState<BuilderTab>("settings")
  const [formsData, setFormsData] = useState<FormTemplate[]>(forms)
  const [editingFormId, setEditingFormId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FormTemplate | null>(null)
  const [formActionMessage, setFormActionMessage] = useState("")

  const [settings, setSettings] = useState({
    templateName: "Addis Ababa Residential Form",
    templateDescription: "Main residential intake form for Addis Ababa properties",
    instructions: "Please complete all required information in English or Amharic. Attach clear ID and income-related evidence where required.",
    showHeaderLogo: true,
    showHeaderImage: true,
    enableAmharicLabels: true,
    requireEthiopianId: true,
    requireGuarantorForHighRiskApplicants: false,
    allowTelebirrOrCbeProof: true,
    showRegionSubCityWoreda: true,
    allowCoApplicants: true,
    useApplicantBackgroundTheme: true,
  })

  const [sections, setSections] = useState<SectionConfig[]>(initialSections)
  const [newSectionName, setNewSectionName] = useState("")
  const [logoFileName, setLogoFileName] = useState("Default logo")
  const [headerImageFileName, setHeaderImageFileName] = useState("Default header")
  const [logoPreview, setLogoPreview] = useState<string | null>(DEFAULT_LOGO_URL)
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(DEFAULT_HEADER_URL)
  const [customDraft, setCustomDraft] = useState({ controlType: "text" as "text" | "file", label: "", placeholder: "", required: false })
  const [customFields, setCustomFields] = useState([{ id: "cf_001", label: "Preferred Move-in Date", placeholder: "DD/MM/YYYY", required: true, controlType: "text" as "text" | "file" }])

  useEffect(() => {
    if (!builderOpen) { setBuilderPhase("closed"); return }
    setBuilderPhase("start")
    const raf = requestAnimationFrame(() => setBuilderPhase("rising"))
    const toSplash = setTimeout(() => setBuilderPhase("splash"), 520)
    const toSliding = setTimeout(() => setBuilderPhase("sliding"), 1300)
    const toOpen = setTimeout(() => setBuilderPhase("open"), 1360)
    return () => { cancelAnimationFrame(raf); clearTimeout(toSplash); clearTimeout(toSliding); clearTimeout(toOpen) }
  }, [builderOpen])

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      if (headerImagePreview?.startsWith("blob:")) URL.revokeObjectURL(headerImagePreview)
    }
  }, [logoPreview, headerImagePreview])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); localStorage.removeItem("userRole"); localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const settingsCharCount = settings.instructions.length
  const totalFieldCount = useMemo(() => sections.filter((s) => s.enabled).reduce((sum, s) => sum + s.fields.length, 0) + customFields.length, [sections, customFields])
  const updateSection = (id: string, updates: Partial<SectionConfig>) => setSections((c) => c.map((s) => (s.id === id ? { ...s, ...updates } : s)))

  const addNewSection = () => {
    const trimmed = newSectionName.trim(); if (!trimmed) return
    setSections((c) => [...c, { id: `sec_${Date.now()}`, name: trimmed, fields: ["Custom Field 1", "Custom Field 2"], enabled: true, allowAdditionalEntries: false }])
    setNewSectionName("")
  }

  const createCustomField = () => {
    const trimmedLabel = customDraft.label.trim(); if (!trimmedLabel) return
    setCustomFields((c) => [...c, { id: `cf_${Date.now()}`, label: trimmedLabel, placeholder: customDraft.placeholder.trim(), required: customDraft.required, controlType: customDraft.controlType }])
    setCustomDraft({ controlType: "text", label: "", placeholder: "", required: false })
    setActiveTab("fields")
  }

  const handleEdit = (id: string) => {
    const form = formsData.find((item) => item.id === id)
    if (!form) return
    setSettings((current) => ({
      ...current,
      templateName: form.name,
      templateDescription: form.description,
    }))
    setEditingFormId(id)
    setBuilderOpen(true)
    setActiveTab("preview")
  }

  const requestDelete = (id: string) => {
    const form = formsData.find((item) => item.id === id)
    if (!form) return
    setDeleteTarget(form)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setFormsData((current) => {
      const remaining = current.filter((item) => item.id !== deleteTarget.id)
      if (remaining.length > 0 && !remaining.some((item) => item.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true }
      }
      return remaining
    })
    setDeleteTarget(null)
  }

  const setDefaultForm = (id: string) => {
    const form = formsData.find((item) => item.id === id)
    if (!form) return
    if (form.status === "Draft") {
      setFormActionMessage(`"${form.name}" is still a draft. Finish and activate it before setting as default.`)
      return
    }
    setFormActionMessage("")
    setFormsData((current) => current.map((form) => ({ ...form, isDefault: form.id === id })))
  }

  const saveFormChanges = () => {
    const name = settings.templateName.trim()
    const description = settings.templateDescription.trim()
    if (!name) return

    if (editingFormId) {
      setFormsData((current) =>
        current.map((form) =>
          form.id === editingFormId
            ? { ...form, name, description, fields: totalFieldCount }
            : form
        )
      )
    } else {
      const newForm: FormTemplate = {
        id: `frm_${Date.now()}`,
        name,
        description,
        fields: totalFieldCount,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Draft",
        isDefault: formsData.length === 0,
      }
      setFormsData((current) => [newForm, ...current])
    }

    setEditingFormId(null)
    setBuilderOpen(false)
  }

  const cardMotionClass = builderPhase === "start" ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
  const splashVisible = builderPhase === "rising" || builderPhase === "splash"
  const contentMotionClass = builderPhase === "sliding" ? "translate-x-20 opacity-0" : builderPhase === "open" ? "translate-x-0 opacity-100" : "translate-x-0 opacity-0"

  const renderPreview = () => (
    <div
      className="rounded-lg border p-4 shadow-sm"
      style={{ borderColor: theme.line, backgroundColor: settings.useApplicantBackgroundTheme ? "#EAF3FB" : "#FFFFFF" }}
    >
      <div className="mb-3 border-b pb-2" style={{ borderColor: theme.line }}>
        <h3 className="text-sm font-medium" style={{ color: theme.ink }}>Preview</h3>
        <p className="text-xs" style={{ color: theme.muted }}>{settings.templateName} | {settings.templateDescription}</p>
      </div>
      {(settings.showHeaderLogo || settings.showHeaderImage) && (
        <div className="mb-4 rounded-md border" style={{ borderColor: theme.line, backgroundColor: "#EAF3FB" }}>
          <div className="flex items-center gap-3 px-3 py-2">
            {settings.showHeaderLogo && (
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-white text-xs font-medium" style={{ borderColor: theme.line, color: theme.accent }}>
                {logoPreview ? <img src={logoPreview} alt="Header logo preview" className="h-full w-full object-cover" /> : "SB"}
              </div>
            )}
            <div><div className="text-sm font-medium" style={{ color: theme.ink }}>SMART BMS</div><div className="text-[0.7rem]" style={{ color: theme.muted }}>Rental Application</div></div>
          </div>
          {settings.showHeaderImage && (
            <div className="px-3 pb-3">
              <div className="h-24 overflow-hidden rounded-md border bg-white" style={{ borderColor: theme.line }}>
                {headerImagePreview ? <img src={headerImagePreview} alt="Header image preview" className="h-full w-full object-cover" /> : null}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="max-h-[500px] space-y-4 overflow-y-auto pr-1">
        {sections.filter((s) => s.enabled).map((section) => (
          <div key={section.id} className="rounded-md border" style={{ borderColor: theme.line }}>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide" style={{ backgroundColor: "#EAF3FB", color: theme.accent }}>{section.name}</div>
            <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2">
              {section.fields.map((field) => <div key={`${section.id}-${field}`} className="space-y-1"><label className="text-[0.7rem] font-medium" style={{ color: theme.muted }}>{field}</label><div className="h-8 rounded-md border bg-white" style={{ borderColor: theme.line }} /></div>)}
            </div>
            {section.allowAdditionalEntries && <div className="px-3 pb-3 text-[0.72rem]" style={{ color: theme.muted }}>Applicants can add additional entries for this section.</div>}
          </div>
        ))}
        {customFields.length > 0 && (
          <div className="rounded-md border" style={{ borderColor: theme.line }}>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide" style={{ backgroundColor: "#EAF3FB", color: theme.accent }}>Custom Fields</div>
            <div className="space-y-2 p-3">{customFields.map((f) => <div key={f.id} className="space-y-1"><label className="text-[0.72rem] font-medium" style={{ color: theme.ink }}>{f.label}{f.required ? " *" : ""}</label><div className="h-8 rounded-md border bg-white" style={{ borderColor: theme.line }} /></div>)}</div>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: theme.line }}><span className="text-xs" style={{ color: theme.muted }}>Total fields: {totalFieldCount}</span><div className="flex gap-2"><Button variant="outline" className="h-8 text-xs" onClick={() => { setBuilderOpen(false); setEditingFormId(null) }}>Cancel</Button><Button className="h-8 text-xs" style={{ backgroundColor: theme.primary, color: "#fff" }} onClick={saveFormChanges}>Save</Button></div></div>
    </div>
  )

  return (
    <div className="min-h-screen flex overflow-x-hidden" style={{ backgroundColor: theme.background, ["--card" as string]: theme.card, ["--background" as string]: theme.background, ["--border" as string]: theme.line } as React.CSSProperties}>
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={(isCurrentlyCollapsed) => { if (!isCurrentlyCollapsed) setIsSidebarCollapsed(true) }}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        appBrandName="BMS"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
          <div className="flex min-h-[52px] items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-4">
              <button type="button" onClick={() => setIsSidebarCollapsed((prev) => !prev)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100" aria-label="Toggle dashboard navigation">
                <AlignLeft className="h-[1.05rem] w-[1.05rem]" />
              </button>
              <div className="truncate text-[0.8rem] font-medium uppercase tracking-[0.08em]" style={{ color: theme.ink }}>Forms</div>
            </div>
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100" aria-label="Notifications"><Bell className="h-[1.05rem] w-[1.05rem]" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-6" style={{ background: "linear-gradient(180deg, #E9EDF3 0%, #E6EBF2 42%, #E3E8EF 100%)" }}>
          <div className="mx-auto w-full max-w-[1420px]">
            <div className="rounded-xl border px-5 py-4 shadow-[0_6px_18px_rgba(94,118,145,0.05)] md:px-6" style={{ backgroundColor: theme.card, borderColor: theme.line }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium" style={{ color: theme.ink }}>Application Forms</h2>
                <Button className="h-9 rounded-md px-3 text-[0.78rem] font-medium shadow-sm gap-2" style={{ backgroundColor: theme.primary, color: "#FFFFFF" }} onClick={() => { setEditingFormId(null); setBuilderOpen(true); setActiveTab("settings") }}>
                  <Plus className="h-3.5 w-3.5" />Create Form
                </Button>
              </div>
              {formActionMessage ? (
                <div className="mb-3 rounded-md border px-3 py-2 text-xs" style={{ borderColor: "#F2D1A7", color: "#8A5A1F", backgroundColor: "#FFF8EE" }}>
                  {formActionMessage}
                </div>
              ) : null}

              <div className="overflow-hidden rounded-lg border shadow-[0_6px_14px_rgba(94,118,145,0.05)]" style={{ borderColor: theme.line }}>
                <table className="w-full border-collapse">
                  <thead style={{ backgroundColor: theme.tableHead }}>
                    <tr className="border-b" style={{ borderColor: theme.line }}>
                      <th className="px-3 py-2 text-left text-[0.68rem] font-medium" style={{ color: theme.muted }}>Form Name</th>
                      <th className="px-3 py-2 text-left text-[0.68rem] font-medium" style={{ color: theme.muted }}>Description</th>
                      <th className="px-3 py-2 text-center text-[0.68rem] font-medium" style={{ color: theme.muted }}>Fields</th>
                      <th className="px-3 py-2 text-left text-[0.68rem] font-medium" style={{ color: theme.muted }}>Created</th>
                      <th className="px-3 py-2 text-center text-[0.68rem] font-medium" style={{ color: theme.muted }}>Status</th>
                      <th className="px-3 py-2 text-center text-[0.68rem] font-medium" style={{ color: theme.muted }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: theme.card }}>
                    {formsData.map((form) => (
                      <tr key={form.id} className="border-b transition-colors hover:bg-slate-50" style={{ borderColor: theme.line }}>
                        <td className="px-3 py-2.5"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: "#E8F2FF" }}><FileText className="h-4 w-4" style={{ color: theme.primary }} /></div><span className="text-[0.78rem] font-medium" style={{ color: theme.ink }}>{form.name}</span></div></td>
                        <td className="px-3 py-2.5 text-[0.76rem]" style={{ color: theme.muted }}>{form.description}</td>
                        <td className="px-3 py-2.5 text-center text-[0.76rem] font-medium" style={{ color: theme.ink }}>{form.fields}</td>
                        <td className="px-3 py-2.5 text-[0.76rem]" style={{ color: theme.muted }}>{form.createdAt}</td>
                        <td className="px-3 py-2.5 text-center"><span className="inline-flex rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium" style={{ backgroundColor: form.status === "Active" ? "#EAF7F1" : "#F1F3F5", color: form.status === "Active" ? theme.success : theme.muted }}>{form.isDefault ? "Default" : form.status}</span></td>
                        <td className="px-3 py-2.5"><div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setDefaultForm(form.id)} className="flex h-7 items-center gap-1 rounded-md px-2 transition-colors hover:bg-slate-100 text-[0.65rem] font-medium" style={{ color: form.isDefault ? theme.success : theme.muted }} aria-label="Set as default form">{form.isDefault ? <CheckCircle className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}{form.isDefault ? "Default" : "Set Default"}</button>
                          <button type="button" onClick={() => handleEdit(form.id)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-100" aria-label="Edit form"><Edit className="h-3.5 w-3.5" style={{ color: theme.muted }} /></button>
                          <button type="button" onClick={() => requestDelete(form.id)} className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-red-50" aria-label="Delete form"><Trash2 className="h-3.5 w-3.5" style={{ color: theme.danger }} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-xl border bg-white shadow-[0_20px_50px_rgba(18,30,53,0.22)]" style={{ borderColor: theme.line }}>
            <div className="border-b px-5 py-4" style={{ borderColor: theme.line }}>
              <h3 className="text-sm font-semibold" style={{ color: theme.ink }}>Delete Form</h3>
              <p className="mt-1 text-xs" style={{ color: theme.muted }}>
                Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} style={{ backgroundColor: theme.danger, color: "#fff" }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 transition-opacity duration-300">
          <div
            className={`absolute right-6 top-8 flex h-[min(670px,calc(100vh-64px))] w-[min(980px,calc(100vw-260px))] overflow-hidden rounded-2xl border bg-white shadow-[0_24px_80px_rgba(18,30,53,0.35)] transition-all duration-700 ${cardMotionClass}`}
            style={{ borderColor: theme.line, left: isSidebarCollapsed ? 96 : 208 }}
          >
            <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 ${splashVisible ? "opacity-100" : "pointer-events-none opacity-0"}`} style={{ backgroundColor: theme.appNav }}>
              <div className="text-center text-white transition-all duration-500" style={{ transform: builderPhase === "rising" ? "translateY(40px)" : "translateY(0)" }}>
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">Launching</div>
                <div className="mt-2 text-4xl font-medium tracking-tight">SMART BMS</div>
              </div>
            </div>

            <aside className={`w-[220px] shrink-0 border-r transition-opacity duration-300 ${builderPhase === "open" ? "opacity-100" : "opacity-0"}`} style={{ backgroundColor: theme.appNav, borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="border-b px-4 py-4" style={{ borderColor: "rgba(255,255,255,0.12)" }}><p className="text-xs uppercase tracking-[0.18em] text-white/60">New</p><h3 className="mt-1 text-xl font-medium text-white">Create Form</h3></div>
              <nav className="space-y-1 p-3">
                {[{ id: "settings" as const, label: "Form Settings", icon: Settings2 }, { id: "fields" as const, label: "Fields", icon: ListChecks }, { id: "custom" as const, label: "Custom Field", icon: SlidersHorizontal }, { id: "preview" as const, label: "Preview", icon: Eye }].map((item) => {
                  const Icon = item.icon
                  return (
                    <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${activeTab === item.id ? "text-white" : "text-white/75 hover:text-white"}`} style={{ backgroundColor: activeTab === item.id ? theme.appNavActive : "transparent" }}>
                      <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span>
                      <ChevronRight className={`h-3.5 w-3.5 ${activeTab === item.id ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  )
                })}
              </nav>
            </aside>

            <section className={`flex min-w-0 flex-1 flex-col bg-[#F7FAFD] transition-all duration-500 ${contentMotionClass}`}>
              <header className="flex items-center justify-between border-b bg-white px-5 py-3" style={{ borderColor: theme.line }}>
                <div>
                  <h4 className="text-sm font-medium" style={{ color: theme.ink }}>{activeTab === "settings" && "Form Settings"}{activeTab === "fields" && "Fields"}{activeTab === "custom" && "Custom Field"}{activeTab === "preview" && "Preview"}</h4>
                  <p className="text-xs" style={{ color: theme.muted }}>Ethiopia-focused form builder for Smart BMS</p>
                </div>
                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100" onClick={() => setBuilderOpen(false)} aria-label="Close form builder"><X className="h-4 w-4" /></button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto p-4"><div className="rounded-lg border bg-white p-4" style={{ borderColor: theme.line }}>
                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Template Name *</label><Input value={settings.templateName} onChange={(e) => setSettings((c) => ({ ...c, templateName: e.target.value }))} /></div>
                      <div className="space-y-1"><label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Template Description *</label><Input value={settings.templateDescription} onChange={(e) => setSettings((c) => ({ ...c, templateDescription: e.target.value }))} /></div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Header Logo</label>
                          <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: theme.line, color: theme.ink }}><ImagePlus className="h-4 w-4" /> Upload logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0]
                                if (!file) return
                                setLogoFileName(file.name)
                                setLogoPreview((prev) => {
                                  if (prev) URL.revokeObjectURL(prev)
                                  return URL.createObjectURL(file)
                                })
                              }}
                            />
                          </label>
                          <p className="text-xs" style={{ color: theme.muted }}>Shown at top of form header. Current: {logoFileName}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Header Image</label>
                          <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm" style={{ borderColor: theme.line, color: theme.ink }}><Upload className="h-4 w-4" /> Upload image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0]
                                if (!file) return
                                setHeaderImageFileName(file.name)
                                setHeaderImagePreview((prev) => {
                                  if (prev) URL.revokeObjectURL(prev)
                                  return URL.createObjectURL(file)
                                })
                              }}
                            />
                          </label>
                          <p className="text-xs" style={{ color: theme.muted }}>Header banner image. Current: {headerImageFileName}</p>
                        </div>
                      </div>

                      <div className="space-y-1"><label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Instructions</label><Textarea value={settings.instructions} maxLength={1000} rows={5} onChange={(e) => setSettings((c) => ({ ...c, instructions: e.target.value }))} /><div className="text-right text-xs" style={{ color: theme.muted }}>{settingsCharCount}/1000</div></div>

                      <div className="space-y-3 border-t pt-3" style={{ borderColor: theme.line }}>
                        {[
                          { key: "showHeaderLogo" as const, title: "Show header logo", help: "Displays your organization logo at the top of the form." },
                          { key: "showHeaderImage" as const, title: "Show header image", help: "Displays a property or branding image below the logo." },
                          { key: "enableAmharicLabels" as const, title: "Enable Amharic labels", help: "Supports applicants who prefer Amharic labels." },
                          { key: "requireEthiopianId" as const, title: "Require Ethiopian ID", help: "Collect Kebele ID, National ID, or Passport details." },
                          { key: "allowTelebirrOrCbeProof" as const, title: "Allow Telebirr/CBE income proof", help: "Accept common Ethiopia payment proof methods." },
                          { key: "showRegionSubCityWoreda" as const, title: "Use Region/Sub-City/Woreda fields", help: "Uses Ethiopia-specific address hierarchy." },
                          { key: "allowCoApplicants" as const, title: "Allow co-applicants", help: "Lets families/shared renters apply on one form." },
                          { key: "requireGuarantorForHighRiskApplicants" as const, title: "Require guarantor for flagged applicants", help: "Ask guarantor information for higher risk submissions." },
                          { key: "useApplicantBackgroundTheme" as const, title: "Use applicant-page background color", help: "Switch preview background from global white to applicant-style blue tint." },
                        ].map((toggle) => {
                          const enabled = settings[toggle.key]
                          return (
                            <div key={toggle.key} className="flex items-start justify-between gap-3">
                              <div><p className="text-sm font-medium" style={{ color: theme.ink }}>{toggle.title}</p><p className="text-xs" style={{ color: theme.muted }}>{toggle.help}</p></div>
                              <button type="button" aria-label={`Toggle ${toggle.title}`} onClick={() => setSettings((c) => ({ ...c, [toggle.key]: !c[toggle.key] }))} className={`relative mt-0.5 inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#3AA0E3]" : "bg-slate-300"}`}>
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "fields" && (
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <div key={section.id} className="overflow-hidden rounded-md border" style={{ borderColor: theme.line }}>
                          <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: "#EAF3FB" }}><h5 className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.accent }}>{section.name}</h5><span className="text-xs" style={{ color: theme.muted }}>{section.fields.length} fields</span></div>
                          <div className="space-y-3 p-3">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{section.fields.map((field) => <div key={`${section.id}-${field}`} className="flex items-center gap-2 rounded-md border bg-[#F8FAFC] px-2 py-1.5" style={{ borderColor: theme.line }}><GripVertical className="h-3.5 w-3.5" style={{ color: "#B3C1CF" }} /><span className="text-xs" style={{ color: theme.ink }}>{field}</span></div>)}</div>
                            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                              <label className="inline-flex items-center gap-2" style={{ color: theme.ink }}><input type="checkbox" checked={section.enabled} onChange={(e) => updateSection(section.id, { enabled: e.target.checked })} />Enable this section</label>
                              <label className="inline-flex items-center gap-2" style={{ color: theme.ink }}><input type="checkbox" checked={section.allowAdditionalEntries} onChange={(e) => updateSection(section.id, { allowAdditionalEntries: e.target.checked })} />Allow applicants to add multiple entries</label>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="rounded-md border p-3" style={{ borderColor: theme.line }}>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: theme.muted }}>Add Information Section</p>
                        <div className="flex gap-2"><Input value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} placeholder="Example: Guarantor Information" /><Button type="button" variant="outline" onClick={addNewSection}>Add</Button></div>
                      </div>

                      <button type="button" className="text-sm font-medium" style={{ color: theme.accent }} onClick={() => setActiveTab("custom")}>+ Add Custom Field</button>
                    </div>
                  )}

                  {activeTab === "custom" && (
                    <div className="space-y-4">
                      <div className="space-y-2"><p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Select Control Type</p><div className="flex gap-4 text-sm" style={{ color: theme.ink }}><label className="inline-flex items-center gap-2"><input type="radio" checked={customDraft.controlType === "text"} onChange={() => setCustomDraft((c) => ({ ...c, controlType: "text" }))} />Text Box</label><label className="inline-flex items-center gap-2"><input type="radio" checked={customDraft.controlType === "file"} onChange={() => setCustomDraft((c) => ({ ...c, controlType: "file" }))} />File Uploader</label></div></div>
                      <div className="space-y-1"><label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Label *</label><Input value={customDraft.label} placeholder="Example: Current Kebele Letter Available?" onChange={(e) => setCustomDraft((c) => ({ ...c, label: e.target.value }))} /></div>
                      <label className="inline-flex items-center gap-2 text-sm" style={{ color: theme.ink }}><input type="checkbox" checked={customDraft.required} onChange={(e) => setCustomDraft((c) => ({ ...c, required: e.target.checked }))} />Mark this field required</label>
                      <div className="space-y-1"><label className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.ink }}>Placeholder Text</label><Input value={customDraft.placeholder} placeholder="Type placeholder text" onChange={(e) => setCustomDraft((c) => ({ ...c, placeholder: e.target.value }))} /></div>
                      <Button type="button" variant="outline" className="gap-2" onClick={createCustomField}>{customDraft.controlType === "file" ? <Upload className="h-4 w-4" /> : <Plus className="h-4 w-4" />}Add Field</Button>
                      {customFields.length > 0 && <div className="space-y-2 border-t pt-3" style={{ borderColor: theme.line }}><p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.muted }}>Existing Custom Fields</p>{customFields.map((f) => <div key={f.id} className="rounded-md border px-3 py-2" style={{ borderColor: theme.line }}><p className="text-sm font-medium" style={{ color: theme.ink }}>{f.label}</p><p className="text-xs" style={{ color: theme.muted }}>{f.controlType === "file" ? "File uploader" : "Text box"}{f.required ? " | Required" : " | Optional"}</p></div>)}</div>}
                    </div>
                  )}

                  {activeTab === "preview" && renderPreview()}
                </div></div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
