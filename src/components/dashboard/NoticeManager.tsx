"use client"

import { useMemo, useState, useTransition } from "react"
import { createGlobalNotice } from "@/lib/actions/notices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Search } from "lucide-react"

type WizardStep = 1 | 2 | 3 | 4 | 5

const allUnitsSeed = [
  "A-101",
  "A-102",
  "A-103",
  "A-104",
  "B-201",
  "B-202",
  "B-203",
  "B-204",
  "C-301",
  "C-302",
]

export default function NoticeManager({ allowSubmit = true }: { allowSubmit?: boolean }) {
  const [step, setStep] = useState<WizardStep>(1)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])

  const [inApp, setInApp] = useState(true)
  const [email, setEmail] = useState(false)
  const [sms, setSms] = useState(false)

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sentVia, setSentVia] = useState<string[]>([])

  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allUnitsSeed
    return allUnitsSeed.filter((u) => u.toLowerCase().includes(q))
  }, [search])

  const allVisibleSelected = filteredUnits.length > 0 && filteredUnits.every((u) => selectedUnits.includes(u))

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedUnits((prev) => prev.filter((u) => !filteredUnits.includes(u)))
      return
    }
    setSelectedUnits((prev) => Array.from(new Set([...prev, ...filteredUnits])))
  }

  const toggleUnit = (unit: string) => {
    setSelectedUnits((prev) => (prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]))
  }

  const canNext = (() => {
    if (step === 1) return selectedUnits.length > 0
    if (step === 2) return title.trim().length > 0 && message.trim().length > 0
    if (step === 3) return inApp || email || sms
    return true
  })()

  const channels = [inApp ? "In-App" : null, email ? "Email" : null, sms ? "SMS" : null].filter(Boolean) as string[]

  const handleNext = () => {
    if (!canNext) return
    setStep((prev) => (prev < 5 ? ((prev + 1) as WizardStep) : prev))
  }

  const handleCancel = () => {
    if (step === 5) {
      setStep(1)
      setTitle("")
      setMessage("")
      setSearch("")
      setSelectedUnits([])
      setEmail(false)
      setSms(false)
      setInApp(true)
      setSentVia([])
      setError(null)
      return
    }
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : 1))
  }

  const handleFinish = () => {
    setError(null)
    if (!allowSubmit) {
      setSentVia(channels)
      setStep(5)
      return
    }
    const fd = new FormData()
    fd.append("title", title)
    fd.append(
      "message",
      `${message}\n\n---\nUnits: ${selectedUnits.join(", ")}\nChannels: ${channels.join(", ")}`
    )
    fd.append("priority", "normal")

    startTransition(async () => {
      try {
        await createGlobalNotice(fd)
        setSentVia(channels)
        setStep(5)
      } catch (err: any) {
        setError(err?.message || "Failed to send announcement")
      }
    })
  }

  return (
    <Card
      className="border border-[#D9E2EE] shadow-[0_8px_24px_rgba(31,53,73,0.08)]"
      style={{ backgroundColor: "var(--card)" }}
    >
      <CardHeader className="border-b border-[#E5ECF5] pb-4">
        <CardTitle className="text-xl font-semibold text-[#1F3549]">Create Announcement</CardTitle>
        <StepIndicator step={step} />
      </CardHeader>

      <CardContent className="pt-5">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#4B647E]">Select Units</div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8FA4]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search units"
                  className="h-10 border-[#C8D6E6] pl-9"
                />
              </div>
              <Button type="button" variant="outline" className="border-[#BFD1E6]" onClick={toggleSelectAllVisible}>
                {allVisibleSelected ? "Unselect All" : "Select All"}
              </Button>
            </div>

            <div className="max-h-[240px] space-y-2 overflow-y-auto rounded-lg border border-[#D7E1EE] p-3">
              {filteredUnits.map((unit) => (
                <label key={unit} className="flex cursor-pointer items-center justify-between rounded-md border border-[#E3EAF3] px-3 py-2 hover:bg-[#F7FAFF]">
                  <span className="text-sm font-medium text-[#2A425A]">{unit}</span>
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(unit)}
                    onChange={() => toggleUnit(unit)}
                    className="h-4 w-4 accent-[#3096DA]"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#4B647E]">Announcement Content</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="h-10 border-[#C8D6E6]"
            />
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write announcement content..."
              rows={8}
              className="border-[#C8D6E6]"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#4B647E]">Notification Channels</div>
            <div className="space-y-2 rounded-lg border border-[#D7E1EE] p-4">
              <label className="flex items-center justify-between rounded-md border border-[#DCE6F2] px-3 py-2 bg-gray-50">
                <span className="text-sm font-medium text-[#21364C]">In-App Notification <span className="text-xs text-[#7C8FA4]">(Default)</span></span>
                <input type="checkbox" checked={inApp} disabled className="h-4 w-4 accent-[#3096DA] cursor-not-allowed" />
              </label>
              <label className="flex items-center justify-between rounded-md border border-[#DCE6F2] px-3 py-2 hover:bg-[#F7FAFF] cursor-pointer">
                <span className="text-sm font-medium text-[#21364C]">SMS</span>
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="h-4 w-4 accent-[#3096DA]" />
              </label>
              <label className="flex items-center justify-between rounded-md border border-[#DCE6F2] px-3 py-2 hover:bg-[#F7FAFF] cursor-pointer">
                <span className="text-sm font-medium text-[#21364C]">Email</span>
                <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="h-4 w-4 accent-[#3096DA]" />
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 rounded-lg border border-[#D7E1EE] bg-[#F8FBFF] p-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-[#4B647E]">Review & Confirm</div>
            <div className="text-sm text-[#21364C]"><span className="font-semibold">Title:</span> {title}</div>
            <div className="text-sm text-[#21364C]"><span className="font-semibold">Units:</span> {selectedUnits.join(", ")}</div>
            <div className="text-sm text-[#21364C]"><span className="font-semibold">Channels:</span> {channels.join(", ")}</div>
            <div className="rounded-md border border-[#DFE8F3] bg-white p-3 text-sm text-[#314C66]">{message}</div>
          </div>
        )}

        {step === 5 && (
          <div className="mx-auto max-w-[440px] rounded-xl border border-[#D1E2F5] bg-white p-6 text-center shadow-[0_10px_24px_rgba(27,88,138,0.12)]">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2F95DA] text-white">
              <Check className="h-6 w-6" />
            </div>
            <div className="text-xl font-semibold text-[#1E3951]">Announcement Sent</div>
            <div className="mt-2 text-sm text-[#5D748C]">
              Your announcement was successfully sent via: {sentVia.join(", ")}.
            </div>
            <div className="mt-4 rounded-md bg-[#F2F7FD] p-3 text-left text-sm text-[#33506B]">
              <div className="font-semibold">{title}</div>
              <div className="mt-1">Units reached: {selectedUnits.length}</div>
            </div>
          </div>
        )}

        {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {step === 5 ? "Create Another" : "Cancel"}
          </Button>
          {step < 4 && (
            <Button type="button" className="bg-[#3096DA] text-white hover:bg-[#2787C7]" onClick={handleNext} disabled={!canNext}>
              Next
            </Button>
          )}
          {step === 4 && (
            <Button type="button" className="bg-[#3096DA] text-white hover:bg-[#2787C7]" onClick={handleFinish} disabled={pending}>
              {pending ? "Sending..." : "Finish"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StepIndicator({ step }: { step: WizardStep }) {
  const steps = [
    "Units",
    "Content",
    "Channel",
    "Review",
    "Done",
  ]

  return (
    <div className="mt-4 flex items-center gap-1.5">
      {steps.map((label, idx) => {
        const n = idx + 1
        const active = step === n
        const done = step > n
        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-1.5">
            <div className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${done ? "bg-[#3096DA] text-white" : active ? "border-2 border-[#3096DA] bg-[#EAF4FD] text-[#1D6EA8]" : "border border-[#C6D5E7] bg-white text-[#748AA3]"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            <span className={`truncate text-[11px] font-medium ${active || done ? "text-[#2C6FA0]" : "text-[#7E91A7]"}`}>{label}</span>
            {idx < steps.length - 1 && <div className={`h-[2px] flex-1 rounded ${step > n ? "bg-[#3096DA]" : "bg-[#D8E4F2]"}`} />}
          </div>
        )
      })}
    </div>
  )
}
