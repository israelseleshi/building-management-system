"use client"

import { use, useEffect, useMemo, useState } from "react"

type ApplyPageProps = {
  params: Promise<{
    ownerSlug: string
    formSlug: string
  }>
}

type SectionField = {
  key: string
  label: string
  required?: boolean
  placeholder?: string
}

type FormSection = {
  title: string
  description: string
  fields: SectionField[]
}

type BuildingProfile = {
  name: string
  tagline: string
  location: string
  contactPhone: string
  contactEmail: string
  intro: string
  amenities: string[]
}

const defaultBuilding: BuildingProfile = {
  name: "Smart BMS Property",
  tagline: "Dedicated online application page",
  location: "Addis Ababa, Ethiopia",
  contactPhone: "+251 911 000 000",
  contactEmail: "leasing@smartbms.et",
  intro:
    "This page is the official application portal for this building. Submit your details once and our leasing team will review and contact you.",
  amenities: ["24/7 Security", "Water Backup", "Nearby Transit", "On-site Management"],
}

const buildingByOwnerSlug: Record<string, BuildingProfile> = {
  "rayuma-building": {
    name: "Rayuma Building",
    tagline: "Comfortable city living with dependable management",
    location: "Bole, Addis Ababa",
    contactPhone: "+251 911 234 567",
    contactEmail: "rayuma.leasing@smartbms.et",
    intro:
      "Welcome to Rayuma Building's dedicated application page. Review the details below and complete your application in one session.",
    amenities: ["Secure Entrance", "Elevator Access", "Reliable Utilities", "Shared Common Area"],
  },
}

const sectionsByFormSlug: Record<string, FormSection[]> = {
  "standard-addis-rental-form": [
    {
      title: "Personal Information",
      description: "Primary applicant identity and contact details.",
      fields: [
        { key: "first_name", label: "First Name", required: true },
        { key: "father_name", label: "Father Name", required: true },
        { key: "grandfather_name", label: "Grandfather Name", required: true },
        { key: "mobile_number", label: "Mobile Number", required: true, placeholder: "+2519..." },
        { key: "email", label: "Email", required: true, placeholder: "name@email.com" },
      ],
    },
    {
      title: "Address Information",
      description: "Current address details.",
      fields: [
        { key: "region", label: "Region", required: true },
        { key: "city", label: "City", required: true },
        { key: "sub_city", label: "Sub-City", required: true },
        { key: "woreda", label: "Woreda", required: true },
        { key: "house_number", label: "House Number", required: false },
      ],
    },
    {
      title: "Income Information",
      description: "Income and employment profile for screening.",
      fields: [
        { key: "monthly_income", label: "Monthly Income (ETB)", required: true },
        { key: "income_source", label: "Income Source", required: true },
        { key: "employer_name", label: "Employer / Business Name", required: true },
      ],
    },
  ],
  "commercial-tenant-form": [
    {
      title: "Business Information",
      description: "Business profile and responsible contacts.",
      fields: [
        { key: "business_name", label: "Business Name", required: true },
        { key: "tin_number", label: "TIN Number", required: true },
        { key: "contact_person", label: "Contact Person", required: true },
        { key: "business_phone", label: "Business Phone", required: true, placeholder: "+2519..." },
        { key: "business_email", label: "Business Email", required: true },
      ],
    },
    {
      title: "Lease Requirement",
      description: "Commercial unit preference and timeline.",
      fields: [
        { key: "preferred_area", label: "Preferred Area", required: true },
        { key: "unit_type", label: "Unit Type", required: true },
        { key: "start_date", label: "Preferred Start Date", required: true },
      ],
    },
  ],
  "shared-housing-form": [
    {
      title: "Applicant Information",
      description: "Main applicant identity and communication details.",
      fields: [
        { key: "full_name", label: "Full Name", required: true },
        { key: "mobile_number", label: "Mobile Number", required: true, placeholder: "+2519..." },
        { key: "email", label: "Email", required: true },
        { key: "id_number", label: "ID Number", required: true },
      ],
    },
    {
      title: "Household Information",
      description: "Household occupancy and move-in preference.",
      fields: [
        { key: "occupants", label: "Number of Occupants", required: true },
        { key: "dependents", label: "Dependents", required: false },
        { key: "move_in_date", label: "Preferred Move-in Date", required: true },
      ],
    },
  ],
}

function toTitle(slug: string) {
  if (!slug) return "Unknown"
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function PublicApplyPage({ params }: ApplyPageProps) {
  const resolvedParams = use(params)
  const ownerSlug = resolvedParams?.ownerSlug ?? ""
  const formSlug = resolvedParams?.formSlug ?? ""
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referenceCode, setReferenceCode] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const sections = useMemo(
    () => sectionsByFormSlug[formSlug] || sectionsByFormSlug["standard-addis-rental-form"],
    [formSlug]
  )

  const building = useMemo(
    () => buildingByOwnerSlug[ownerSlug] || { ...defaultBuilding, name: toTitle(ownerSlug) },
    [ownerSlug]
  )

  const initialValues = useMemo(() => {
    const base: Record<string, string> = {}
    for (const section of sections) {
      for (const field of section.fields) {
        base[field.key] = ""
      }
    }
    return base
  }, [sections])

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
    setIsSubmitting(false)
  }, [initialValues])

  const formName = toTitle(formSlug)

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#E8EEF4] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 text-center shadow-[0_16px_44px_rgba(19,40,64,0.13)]" style={{ borderColor: "#CCD6E2" }}>
          <h1 className="text-2xl font-bold text-[#0F2740]">Application Submitted Successfully</h1>
          <p className="mt-2 text-sm text-[#60758A]">Thank you. {building.name} has received your {formName} application.</p>
          <div className="mx-auto mt-5 max-w-sm rounded-lg border bg-[#F5F8FB] p-3" style={{ borderColor: "#CCD6E2" }}>
            <p className="text-xs uppercase tracking-[0.12em] text-[#60758A]">Reference Code</p>
            <p className="mt-1 text-lg font-semibold text-[#0F2740]">{referenceCode}</p>
          </div>
          <button
            type="button"
            className="mt-6 h-10 rounded-md bg-[#3C98D9] px-5 text-sm font-semibold text-white hover:bg-[#2D86C5]"
            onClick={() => {
              setSubmitted(false)
              setValues(initialValues)
            }}
          >
            Submit Another Application
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#E8EEF4] px-4 py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-[0_20px_60px_rgba(10,42,67,0.15)]" style={{ borderColor: "#CCD6E2" }}>
        <header className="bg-gradient-to-r from-[#0A2A43] to-[#144D76] px-6 py-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Dedicated Building Portal</p>
              <h1 className="mt-1 text-2xl font-bold">{building.name}</h1>
              <p className="mt-1 text-sm text-white/80">{building.tagline}</p>
              <p className="mt-2 text-xs text-white/75">{building.location}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3 text-xs text-white/90 backdrop-blur-sm">
              <p className="font-semibold uppercase tracking-[0.12em]">Form Type</p>
              <p className="mt-1">{formName}</p>
            </div>
          </div>
        </header>

        <form
          className="space-y-7 p-6"
          onSubmit={async (event) => {
            event.preventDefault()

            const nextErrors: Record<string, string> = {}
            for (const section of sections) {
              for (const field of section.fields) {
                if (field.required && !values[field.key]?.trim()) {
                  nextErrors[field.key] = `${field.label} is required`
                }
              }
            }

            if (Object.keys(nextErrors).length > 0) {
              setErrors(nextErrors)
              return
            }

            setErrors({})
            setIsSubmitting(true)
            await new Promise((resolve) => setTimeout(resolve, 700))
            setReferenceCode(`BMS-${Date.now().toString().slice(-6)}`)
            setIsSubmitting(false)
            setSubmitted(true)
          }}
        >
          <section className="rounded-xl border bg-[#F7FAFD] p-4" style={{ borderColor: "#CCD6E2" }}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#0F2740]">About This Property</h2>
            <p className="mt-2 text-sm leading-6 text-[#60758A]">{building.intro}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {building.amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-[#E6F2FB] px-3 py-1 text-xs font-medium text-[#1E6FA8]">
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-xl border p-4" style={{ borderColor: "#CCD6E2" }}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#0F2740]">Application Steps</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {["Complete all fields", "Submit once for review", "Receive follow-up call/email"].map((step, index) => (
                <div key={step} className="rounded-md border bg-[#FCFEFF] p-3" style={{ borderColor: "#D9E3ED" }}>
                  <p className="text-xs font-semibold text-[#2D86C5]">Step {index + 1}</p>
                  <p className="mt-1 text-sm text-[#355166]">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border p-4" style={{ borderColor: "#CCD6E2" }}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#3096DA]">{section.title}</h3>
              <p className="mt-1 text-xs text-[#60758A]">{section.description}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.fields.map((field) => {
                  const value = values[field.key] || ""
                  const hasError = Boolean(errors[field.key])
                  const inputType = inferFieldInputType(field.label)
                  return (
                    <label key={field.key} className="text-sm text-[#0F2740]">
                      <span className="mb-1 block text-xs font-medium text-[#60758A]">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      <input
                        type={inputType}
                        value={value}
                        onChange={(e) => {
                          const nextValue = e.target.value
                          setValues((current) => ({ ...current, [field.key]: nextValue }))
                          if (errors[field.key]) {
                            setErrors((current) => {
                              const next = { ...current }
                              delete next[field.key]
                              return next
                            })
                          }
                        }}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#3C98D9]/30"
                        style={{ borderColor: hasError ? "#E15949" : "#CCD6E2" }}
                      />
                      {hasError ? (
                        <span className="mt-1 block text-xs text-[#E15949]">{errors[field.key]}</span>
                      ) : null}
                    </label>
                  )
                })}
              </div>
            </section>
          ))}

          <section className="rounded-xl border bg-[#F8FBFE] p-4" style={{ borderColor: "#CCD6E2" }}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#0F2740]">Contact</h3>
            <p className="mt-2 text-sm text-[#60758A]">Need help while applying? Contact the leasing team directly.</p>
            <div className="mt-2 text-sm text-[#355166]">
              <p>Phone: {building.contactPhone}</p>
              <p>Email: {building.contactEmail}</p>
            </div>
          </section>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[#60758A]">By submitting, you agree to be contacted for tenancy screening and lease follow-up.</p>
            <button
              type="submit"
              className="h-10 rounded-md bg-[#3C98D9] px-6 text-sm font-semibold text-white hover:bg-[#2D86C5] disabled:cursor-not-allowed disabled:bg-[#9AC5E5]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

function inferFieldInputType(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes("email")) return "email"
  if (lower.includes("date")) return "date"
  if (lower.includes("number") || lower.includes("occupants") || lower.includes("dependents")) return "number"
  if (lower.includes("phone") || lower.includes("mobile")) return "tel"
  return "text"
}

