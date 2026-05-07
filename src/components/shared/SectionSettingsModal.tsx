"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export type SettingsField = {
  key: string
  label: string
  type?: "text" | "number" | "select" | "textarea"
  placeholder?: string
  options?: string[]
}

interface SectionSettingsModalProps {
  open: boolean
  title: string
  subtitle?: string
  fields: SettingsField[]
  onClose: () => void
  onSave?: (values: Record<string, string>) => void
}

export function SectionSettingsModal({
  open,
  title,
  subtitle,
  fields,
  onClose,
  onSave,
}: SectionSettingsModalProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    const next: Record<string, string> = {}
    fields.forEach((f) => {
      next[f.key] = ""
    })
    setValues(next)
  }, [open, fields])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#E9EDF3]/70 px-4 py-6 backdrop-blur-[1px]">
      <div className="w-full max-w-xl rounded-2xl border border-[#D9E1E8] bg-white shadow-[0_16px_40px_rgba(31,53,73,0.18)]">
        <div className="rounded-t-2xl border-b border-[#D9E1E8] bg-white px-5 py-4">
          <div className="text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-[#1F3549]">{title}</div>
          {subtitle ? <p className="mt-1 text-sm text-[#7B8C9D]">{subtitle}</p> : null}
        </div>

        <div className="space-y-4 px-5 py-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[#7B8C9D]">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="min-h-[90px] max-w-[380px] w-full rounded-lg border border-[#D9E1E8] bg-white px-3 py-2 text-sm text-[#1F3549] outline-none focus:border-[#4E88C8]"
                />
              ) : field.type === "select" ? (
                <select
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="h-10 max-w-[280px] w-full rounded-lg border border-[#D9E1E8] bg-white px-3 text-sm text-[#1F3549] outline-none focus:border-[#4E88C8]"
                >
                  <option value="">Select {field.label}</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="h-10 max-w-[280px] w-full rounded-lg border border-[#D9E1E8] bg-white px-3 text-sm text-[#1F3549] outline-none focus:border-[#4E88C8]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#D9E1E8] px-5 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave?.(values)
              onClose()
            }}
            style={{ backgroundColor: "#3498DB", color: "#FFFFFF" }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

