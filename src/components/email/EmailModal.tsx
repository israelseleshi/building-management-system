"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

export type EmailTemplate = {
  id: string
  name: string
  subject: string
  body: string
}

export type EmailComposePayload = {
  recipients: string[]
  subject: string
  body: string
  scheduledAt?: Date
}

type EventContext = {
  id: string
  title: string
  type: "maintenance" | "payment" | "inspection" | "meeting" | "notice" | "lease"
  startDate: Date
}

type TenantOption = {
  id: string
  name: string
  email: string
  unitName?: string
}

interface EmailModalProps {
  open: boolean
  onClose: () => void
  event: EventContext | null
  defaultRecipients: string[]
  tenantOptions: TenantOption[]
  onSendNow: (payload: EmailComposePayload) => void
  onSchedule: (payload: EmailComposePayload) => void
  onSaveDraft: (payload: EmailComposePayload) => void
}

const templates: EmailTemplate[] = [
  {
    id: "maintenance",
    name: "Maintenance Notice",
    subject: "Maintenance Notice - {{eventTitle}}",
    body: "Dear {{tenantName}},\n\nA maintenance activity is scheduled for {{eventDate}} at your unit {{unitName}}.\n\nRegards,\nManagement",
  },
  {
    id: "rent",
    name: "Rent Reminder",
    subject: "Rent Reminder - {{eventDate}}",
    body: "Dear {{tenantName}},\n\nThis is a reminder that rent is due on {{eventDate}}.\n\nThank you.",
  },
  {
    id: "inspection",
    name: "Inspection Notice",
    subject: "Inspection - {{eventTitle}}",
    body: "Dear {{tenantName}},\n\nAn inspection is scheduled on {{eventDate}}.\n\nThank you.",
  },
  {
    id: "lease",
    name: "Lease Expiry Notice",
    subject: "Lease Expiry - {{unitName}}",
    body: "Dear {{tenantName}},\n\nYour lease related to {{unitName}} is near expiry.\n\nPlease contact management.",
  },
]

function applyTemplate(template: EmailTemplate, vars: Record<string, string>) {
  const replace = (text: string) =>
    text
      .replaceAll("{{tenantName}}", vars.tenantName || "Tenant")
      .replaceAll("{{eventTitle}}", vars.eventTitle || "")
      .replaceAll("{{eventDate}}", vars.eventDate || "")
      .replaceAll("{{unitName}}", vars.unitName || "your unit")
  return { subject: replace(template.subject), body: replace(template.body) }
}

export function EmailModal({
  open,
  onClose,
  event,
  defaultRecipients,
  tenantOptions,
  onSendNow,
  onSchedule,
  onSaveDraft,
}: EmailModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [to, setTo] = useState<string[]>([])
  const [manualEmail, setManualEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [scheduleAt, setScheduleAt] = useState("")

  const templateById = useMemo(() => new Map(templates.map((t) => [t.id, t])), [])

  useEffect(() => {
    if (!open || !event) return
    const defaultSubject = `${event.type.toUpperCase()} - ${event.title}`
    const defaultBody = `Dear Tenant,\n\nThis is to inform you about the following event:\n\nEvent: ${event.title}\nDate: ${event.startDate.toLocaleDateString()}\nTime: ${event.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\n\nPlease take necessary action if required.\n\nThank you.`
    setTo(defaultRecipients)
    setSubject(defaultSubject)
    setBody(defaultBody)
    setScheduleAt("")
    setManualEmail("")
    setSelectedTemplateId("")
  }, [open, event, defaultRecipients])

  if (!open || !event) return null

  const addManualRecipient = () => {
    const email = manualEmail.trim()
    if (!email) return
    if (!to.includes(email)) setTo((prev) => [...prev, email])
    setManualEmail("")
  }

  const toggleRecipient = (email: string) => {
    setTo((prev) => (prev.includes(email) ? prev.filter((x) => x !== email) : [...prev, email]))
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const tpl = templateById.get(templateId)
    if (!tpl) return
    const firstTenant = tenantOptions.find((x) => to.includes(x.email))
    const result = applyTemplate(tpl, {
      tenantName: firstTenant?.name || "Tenant",
      eventTitle: event.title,
      eventDate: event.startDate.toLocaleDateString(),
      unitName: firstTenant?.unitName || "your unit",
    })
    setSubject(result.subject)
    setBody(result.body)
  }

  const payload: EmailComposePayload = {
    recipients: to,
    subject: subject.trim(),
    body: body.trim(),
    scheduledAt: scheduleAt ? new Date(scheduleAt) : undefined,
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/30 p-3 md:p-4">
      <div className="mx-auto mt-6 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-bold uppercase tracking-[0.06em] text-slate-700">Compose Email</div>
        </div>
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-4 p-5">
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">To</label>
            <div className="rounded-lg border border-slate-300 p-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {to.map((email) => (
                  <span key={email} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                    {email}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="Add recipient email"
                  className="h-9 flex-1 rounded border border-slate-300 px-3 text-sm"
                />
                <Button variant="outline" onClick={addManualRecipient}>Add</Button>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">
                {tenantOptions.map((tenant) => (
                  <label key={tenant.id} className="inline-flex items-center gap-2 text-xs text-slate-700">
                    <input type="checkbox" checked={to.includes(tenant.email)} onChange={() => toggleRecipient(tenant.email)} />
                    {tenant.name} ({tenant.email})
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Template</label>
            <select className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" value={selectedTemplateId} onChange={(e) => handleTemplateChange(e.target.value)}>
              <option value="">None</option>
              {templates.map((tpl) => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Message Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[160px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Schedule Send</label>
            <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="outline" onClick={() => onSaveDraft(payload)}>Save Draft</Button>
          <Button variant="outline" onClick={() => onSchedule(payload)}>Schedule</Button>
          <Button className="bg-[#3096DA] text-white hover:bg-[#277FB8]" onClick={() => onSendNow(payload)}>Send Now</Button>
        </div>
      </div>
    </div>
  )
}
