"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"
import {
  Building2,
  CheckCircle2,
  CalendarDays,
  HandCoins,
  Users,
  Split,
  FileText,
  Calendar,
  PlusCircle,
} from "lucide-react"

type LeaseType = "fixed" | "month_to_month"
type StepKey = "term" | "dates" | "rent" | "tenants" | "sharing" | "docs"

interface TenantRow {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const steps: { key: StepKey; label: string; icon: React.ReactNode }[] = [
  { key: "term", label: "Lease Term", icon: <FileText className="h-3.5 w-3.5" /> },
  { key: "dates", label: "Lease Dates", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  { key: "rent", label: "Rent/Additional Fee", icon: <HandCoins className="h-3.5 w-3.5" /> },
  { key: "tenants", label: "Add Tenants", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "sharing", label: "Rent/Deposit Sharing", icon: <Split className="h-3.5 w-3.5" /> },
  { key: "docs", label: "Lease/Documents", icon: <FileText className="h-3.5 w-3.5" /> },
]

const dueDays = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "10th",
  "15th",
  "20th",
  "25th",
  "30th",
]

function LeasingContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const [leaseType, setLeaseType] = useState<LeaseType>("fixed")
  const [unit, setUnit] = useState("1A")
  const [leaseTerm, setLeaseTerm] = useState("New Term")

  const [leaseBeginDate, setLeaseBeginDate] = useState("2026-05-10")
  const [leaseEndDate, setLeaseEndDate] = useState("")
  const [switchToMonthToMonth, setSwitchToMonthToMonth] = useState(false)

  const [paymentFrequency, setPaymentFrequency] = useState("")
  const [customFrequencyValue, setCustomFrequencyValue] = useState("1")
  const [customFrequencyUnit, setCustomFrequencyUnit] = useState("Months")
  const [rentAmountEtb, setRentAmountEtb] = useState("120000")
  const [dueDay, setDueDay] = useState("1st")
  const [firstInvoiceDate, setFirstInvoiceDate] = useState("")

  const [tenants, setTenants] = useState<TenantRow[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  ])

  const [sharingType, setSharingType] = useState("")
  const [leaseDocumentName, setLeaseDocumentName] = useState("")
  const [tenantErrors, setTenantErrors] = useState<Record<number, { email?: string; phone?: string }>>({})

  const activeStep = steps[currentStepIndex].key

  const isStepComplete = (step: StepKey) => {
    if (step === "term") {
      return Boolean(unit && leaseTerm && leaseType)
    }
    if (step === "dates") {
      if (leaseType === "month_to_month") return Boolean(leaseBeginDate)
      return Boolean(leaseBeginDate && leaseEndDate)
    }
    if (step === "rent") {
      if (!paymentFrequency) return false
      if (paymentFrequency === "Custom" && (!customFrequencyValue || Number(customFrequencyValue) <= 0 || !customFrequencyUnit)) return false
      if (!rentAmountEtb || Number(rentAmountEtb) <= 0) return false
      if (!firstInvoiceDate) return false
      return true
    }
    if (step === "tenants") {
      return tenants.some(
        (t) =>
          t.firstName.trim() &&
          t.lastName.trim() &&
          t.email.trim() &&
          t.phone.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim()) &&
          /^251(7|9)\d{8}$/.test(t.phone.trim())
      )
    }
    if (step === "sharing") {
      return Boolean(sharingType)
    }
    if (step === "docs") {
      return Boolean(leaseDocumentName.trim())
    }
    return false
  }

  const completedSet = useMemo(() => {
    return new Set(steps.filter((s) => isStepComplete(s.key)).map((s) => s.key))
  }, [
    unit,
    leaseTerm,
    leaseType,
    leaseBeginDate,
    leaseEndDate,
    paymentFrequency,
    customFrequencyValue,
    customFrequencyUnit,
    rentAmountEtb,
    firstInvoiceDate,
    tenants,
    sharingType,
    leaseDocumentName,
  ])

  const canGoNext = isStepComplete(activeStep)
  const isLastStep = currentStepIndex === steps.length - 1

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

  const updateTenant = (index: number, key: keyof TenantRow, value: string) => {
    setTenants((prev) => prev.map((t, i) => (i === index ? { ...t, [key]: value } : t)))
  }

  const addTenantRow = () => {
    setTenants((prev) => [
      ...prev,
      { firstName: "", lastName: "", email: "", phone: "" },
    ])
  }

  const validateTenants = () => {
    const nextErrors: Record<number, { email?: string; phone?: string }> = {}
    tenants.forEach((t, i) => {
      if (t.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim())) {
        nextErrors[i] = { ...(nextErrors[i] || {}), email: "Invalid email format" }
      }
      if (t.phone.trim() && !/^251(7|9)\d{8}$/.test(t.phone.trim())) {
        nextErrors[i] = { ...(nextErrors[i] || {}), phone: "Phone must be 2517/2519 + 8 digits" }
      }
    })
    setTenantErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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
          title="Leasing"
          subtitle=""
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarCollapsed((x) => !x)}
        />

        <main className="p-3 md:p-4">
          <div className="mx-auto max-w-[1320px]">
            <div className="rounded-md border border-[#D6DEEA] bg-[#F2F5FA] px-3 py-2.5">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[2fr_repeat(4,minmax(0,1fr))]">
                <div className="flex items-center gap-2.5 border-r border-[#E1E6EF] pr-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F4FA] text-[#5B7E9E]">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[0.95rem] font-semibold leading-tight text-[#24394F]">Africa Avenue (Bole Airport Road) in the Bole area</div>
                    <div className="text-[0.76rem] text-[#586D84]">Addis Ababa, Ethiopia | 1A</div>
                  </div>
                </div>

                <TopCol title="Rental Lease for" value="-" />
                <TopCol title="Start" value={leaseBeginDate || "-"} />
                <TopCol title="End" value={leaseEndDate || "-"} />
                <TopCol title="Monthly Rent" value={rentAmountEtb ? `ETB ${Number(rentAmountEtb).toLocaleString()}` : "-"} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[270px_1fr]">
              <aside className="rounded-md border border-[#E0E6EF] bg-white py-2">
                {steps.map((step, idx) => {
                  const active = step.key === activeStep
                  const done = completedSet.has(step.key)
                  return (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`flex w-full items-center gap-2.5 border-b border-[#EEF2F7] px-3.5 py-3 text-left last:border-b-0 ${
                        active ? "bg-[#F7FAFE]" : "bg-white"
                      }`}
                    >
                      <span className={`flex h-5.5 w-5.5 items-center justify-center rounded-full ${done ? "text-[#34B56A]" : "text-[#A3B0C0]"}`}>
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.icon}
                      </span>
                      <span className={`text-[0.92rem] ${active ? "font-semibold text-[#203449]" : "text-[#6F7F91]"}`}>{step.label}</span>
                    </button>
                  )
                })}
              </aside>

              <section className="rounded-md border border-[#E0E6EF] bg-white p-3.5">
                {activeStep === "term" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Lease Term</h2>
                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Select Unit</label>
                        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]">
                          <option value="1A">1A</option>
                          <option value="1B">1B</option>
                          <option value="2A">2A</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Select Lease Term</label>
                        <select value={leaseTerm} onChange={(e) => setLeaseTerm(e.target.value)} className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]">
                          <option value="New Term">New Term</option>
                          <option value="Renewal">Renewal</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      <LeaseTypeCard title="Fixed Term" description="This lease has a fixed start date and will expire after a fixed end date." checked={leaseType === "fixed"} onClick={() => setLeaseType("fixed")} />
                      <LeaseTypeCard title="Month to Month" description="Lease has a start date but no fixed end date. It should automatically renew each month." checked={leaseType === "month_to_month"} onClick={() => setLeaseType("month_to_month")} />
                    </div>
                  </>
                )}

                {activeStep === "dates" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Lease Dates</h2>
                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                      <DateField label="Lease Begin Date *" value={leaseBeginDate} onChange={setLeaseBeginDate} />
                      <DateField label="Lease End Date *" value={leaseEndDate} onChange={setLeaseEndDate} disabled={leaseType === "month_to_month"} />
                    </div>
                    <label className="mt-2.5 inline-flex items-center gap-2 text-[0.82rem] text-[#2E4358]">
                      <input type="checkbox" checked={switchToMonthToMonth} onChange={(e) => setSwitchToMonthToMonth(e.target.checked)} className="h-3.5 w-3.5" />
                      Switch to Month-To-Month at the end of the lease
                    </label>
                  </>
                )}

                {activeStep === "rent" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Rent/Additional Fee</h2>
                    <div className="mt-2.5">
                      <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Payment Frequency</label>
                      <select value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)} className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]">
                        <option value="">Select</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-Monthly">Bi-Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    {paymentFrequency === "Custom" && (
                      <div className="mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-[130px_1fr]">
                        <div>
                          <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Every</label>
                          <input
                            type="number"
                            min={1}
                            value={customFrequencyValue}
                            onChange={(e) => setCustomFrequencyValue(e.target.value)}
                            className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Unit</label>
                          <select
                            value={customFrequencyUnit}
                            onChange={(e) => setCustomFrequencyUnit(e.target.value)}
                            className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]"
                          >
                            <option>Days</option>
                            <option>Weeks</option>
                            <option>Months</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {paymentFrequency && (
                      <div className="mt-3 space-y-2.5">
                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Rent</label>
                            <div className="flex h-9 items-center overflow-hidden rounded border border-[#D8DFE9]">
                              <span className="flex h-full w-12 items-center justify-center border-r border-[#D8DFE9] text-[0.8rem] text-[#6A7C90]">ETB</span>
                              <input value={rentAmountEtb} onChange={(e) => setRentAmountEtb(e.target.value)} className="h-full w-full px-2.5 text-[0.82rem] outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Due on the</label>
                            <div className="grid grid-cols-[1fr_auto] overflow-hidden rounded border border-[#D8DFE9]">
                              <select value={dueDay} onChange={(e) => setDueDay(e.target.value)} className="h-9 border-r border-[#D8DFE9] px-2.5 text-[0.82rem]">
                                {dueDays.map((day) => (
                                  <option key={day}>{day}</option>
                                ))}
                              </select>
                              <div className="flex items-center px-2.5 text-[0.75rem] text-[#6A7C90]">of every month</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">On which date should the first rental invoice be due?*</label>
                          <input type="date" value={firstInvoiceDate} onChange={(e) => setFirstInvoiceDate(e.target.value)} className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]" />
                          <p className="mt-1.5 text-[0.73rem] text-[#8A98A8]">We'll immediately create an unpaid invoice due on whichever date you select. Invoices will continue from that date onward.</p>
                        </div>

                        <div className="border-t border-[#E7EDF5] pt-2">
                          <button type="button" className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-[#6E83A0] hover:text-[#4E6F98]">
                            <PlusCircle className="h-3.5 w-3.5" /> Add Additional Fee (Optional)
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeStep === "tenants" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Add Tenants</h2>
                    <div className="mt-2 rounded border border-[#E2E8F1] overflow-hidden">
                      <div className="grid grid-cols-6 gap-2 bg-[#F2F5FA] px-2.5 py-2 text-[0.75rem] font-semibold text-[#5F7288]">
                        <div>First Name</div>
                        <div>Last Name</div>
                        <div>Email</div>
                        <div>Phone Number</div>
                        <div>Application Status</div>
                        <div></div>
                      </div>
                      <div className="space-y-2 px-2.5 py-2.5">
                        {tenants.map((tenant, i) => (
                          <div key={i} className="grid grid-cols-6 gap-2">
                            <input value={tenant.firstName} onChange={(e) => updateTenant(i, "firstName", e.target.value)} className="h-8 rounded border border-[#D8DFE9] px-2 text-[0.78rem]" />
                            <input value={tenant.lastName} onChange={(e) => updateTenant(i, "lastName", e.target.value)} className="h-8 rounded border border-[#D8DFE9] px-2 text-[0.78rem]" />
                            <div>
                              <input value={tenant.email} onChange={(e) => updateTenant(i, "email", e.target.value)} className="h-8 w-full rounded border border-[#D8DFE9] px-2 text-[0.78rem]" />
                              {tenantErrors[i]?.email && <p className="mt-1 text-[0.68rem] text-red-600">{tenantErrors[i].email}</p>}
                            </div>
                            <div>
                              <input value={tenant.phone} onChange={(e) => updateTenant(i, "phone", e.target.value)} className="h-8 w-full rounded border border-[#D8DFE9] px-2 text-[0.78rem]" />
                              {tenantErrors[i]?.phone && <p className="mt-1 text-[0.68rem] text-red-600">{tenantErrors[i].phone}</p>}
                            </div>
                            <div className="flex h-8 items-center rounded border border-[#E4EAF2] px-2 text-[0.75rem] text-[#7D8EA1]">Application Not Requested</div>
                            <div />
                          </div>
                        ))}

                        <button type="button" onClick={addTenantRow} className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-[#4E88C8]">
                          <PlusCircle className="h-3.5 w-3.5" /> Add Another Tenant
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeStep === "sharing" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Rent/Deposit Sharing</h2>
                    <div className="mt-2.5">
                      <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Sharing Method</label>
                      <select value={sharingType} onChange={(e) => setSharingType(e.target.value)} className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]">
                        <option value="">Select</option>
                        <option value="Equal Split">Equal Split</option>
                        <option value="Custom Split">Custom Split</option>
                        <option value="Primary Tenant Pays">Primary Tenant Pays</option>
                      </select>
                    </div>
                  </>
                )}

                {activeStep === "docs" && (
                  <>
                    <h2 className="text-[1.3rem] font-semibold text-[#22364A]">Lease/Documents</h2>
                    <div className="mt-2.5">
                      <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">Lease Document Name</label>
                      <input value={leaseDocumentName} onChange={(e) => setLeaseDocumentName(e.target.value)} placeholder="Enter document title" className="h-9 w-full rounded border border-[#D8DFE9] px-2.5 text-[0.82rem]" />
                    </div>
                  </>
                )}
              </section>
            </div>

            <div className="mt-4 border-t border-[#E4EAF2] pt-3">
              <div className="flex items-center justify-between">
                <div />
                <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((x) => Math.max(0, x - 1))}
                  className="h-8 rounded border border-[#9CB7D8] px-5 text-[0.78rem] font-semibold text-[#4E88C8]"
                >
                  Back
                </button>
              )}

              {!isLastStep && canGoNext && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === "tenants" && !validateTenants()) return
                    setCurrentStepIndex((x) => Math.min(steps.length - 1, x + 1))
                  }}
                  className="h-8 rounded bg-[#4E88C8] px-5 text-[0.78rem] font-semibold text-white"
                >
                  Next
                </button>
              )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function TopCol({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-[0.72rem] font-medium text-[#5D6F83]">{title}</div>
      <div className="mt-1 text-[0.82rem] font-semibold text-[#22364A]">{value}</div>
    </div>
  )
}

function LeaseTypeCard({
  title,
  description,
  checked,
  onClick,
}: {
  title: string
  description: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className={`rounded border p-2.5 text-left ${checked ? "border-[#9FB9D8] bg-[#F8FBFF]" : "border-[#E0E6EF] bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#607790]" />
          <h3 className="text-[0.95rem] font-semibold text-[#253A50]">{title}</h3>
        </div>
        <span className={`mt-0.5 inline-block h-3.5 w-3.5 rounded-full border ${checked ? "border-[#4E88C8] bg-[#4E88C8]" : "border-[#D7DDE7]"}`} />
      </div>
      <p className="mt-1 text-[0.76rem] leading-[1.35] text-[#6A7C90]">{description}</p>
    </button>
  )
}

function DateField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div>
      <label className="mb-1 block text-[0.78rem] font-medium text-[#3D5167]">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-9 w-full rounded border border-[#D8DFE9] bg-white px-2.5 pr-8 text-[0.82rem]"
        />
        <Calendar className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7A8EA5]" />
      </div>
    </div>
  )
}

export default function LeasesPage() {
  return (
    <ProtectedRoute>
      <LeasingContent />
    </ProtectedRoute>
  )
}
