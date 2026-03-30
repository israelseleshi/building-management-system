"use client"

import { useMemo, useState } from "react"

type ApplyPageProps = {
  params: {
    ownerSlug: string
    formSlug: string
  }
}

const sectionMap: Record<string, { title: string; fields: string[] }[]> = {
  "standard-addis-rental-form": [
    { title: "Personal Information", fields: ["First Name", "Father Name", "Grandfather Name", "Mobile Number", "Email"] },
    { title: "Address Information", fields: ["Region", "City", "Sub-City", "Woreda", "House Number"] },
    { title: "Income Information", fields: ["Monthly Income (ETB)", "Income Source", "Employer / Business Name"] },
  ],
  "commercial-tenant-form": [
    { title: "Business Information", fields: ["Business Name", "TIN", "Contact Person", "Business Phone", "Email"] },
    { title: "Property Requirement", fields: ["Preferred Area", "Unit Type", "Start Date"] },
  ],
  "shared-housing-form": [
    { title: "Applicant Information", fields: ["Full Name", "Mobile Number", "Email", "ID Number"] },
    { title: "Household Information", fields: ["Number of Occupants", "Dependents", "Preferred Move-in Date"] },
  ],
}

function toTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function PublicApplyPage({ params }: ApplyPageProps) {
  const { ownerSlug, formSlug } = params
  const [submitted, setSubmitted] = useState(false)

  const sections = useMemo(() => {
    return sectionMap[formSlug] || sectionMap["standard-addis-rental-form"]
  }, [formSlug])

  const ownerName = toTitle(ownerSlug)
  const formName = toTitle(formSlug)

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#DDE3EC] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center" style={{ borderColor: "#CCD6E2" }}>
          <h1 className="text-2xl font-bold text-[#0F2740]">Application Submitted</h1>
          <p className="mt-2 text-sm text-[#60758A]">
            Thank you. {ownerName} received your application for {formName}.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#DDE3EC] px-4 py-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-white shadow-[0_20px_50px_rgba(10,42,67,0.15)]" style={{ borderColor: "#CCD6E2" }}>
        <header className="bg-[#0A2A43] px-6 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Smart BMS Application</p>
          <h1 className="mt-1 text-2xl font-bold">{ownerName}</h1>
          <p className="mt-1 text-sm text-white/80">{formName}</p>
        </header>

        <form
          className="space-y-6 p-6"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border p-4" style={{ borderColor: "#CCD6E2" }}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3096DA]">{section.title}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.fields.map((field) => (
                  <label key={field} className="text-sm text-[#0F2740]">
                    <span className="mb-1 block text-xs font-medium text-[#60758A]">{field}</span>
                    <input
                      type="text"
                      required
                      className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#3C98D9]/30"
                      style={{ borderColor: "#CCD6E2" }}
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 rounded-md bg-[#3C98D9] px-6 text-sm font-semibold text-white hover:bg-[#2D86C5]"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

