"use client"

import Link from "next/link"
import {
  Landmark,
  Mail,
  Phone,
} from "lucide-react"

const featureLinks = [
  "Online Rent Payments",
  "Online Lease Signing",
  "Maintenance Requests",
  "Book Maintenance Repairs",
  "Tenant Screening",
  "Tenant Communication",
  "Expense & Reporting",
  "Mobile App",
  "Integrations",
]

const propertyTypeLinks = [
  "Residential",
  "Commercial",
  "Apartment Housing",
  "Self Storage",
  "Senior Living",
  "Mobile Homes",
  "Military Housing",
  "Student Housing",
]

const resourceLinks = ["Case Studies", "Blog", "Definitions", "Support & Security"]
const companyLinks = ["About Us", "Careers", "Contact"]

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#3a4159" }} className="w-full px-6 py-12 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl border border-white/30 bg-white/10 flex items-center justify-center">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <span className="text-[2rem] font-semibold tracking-tight text-white leading-none">BMS</span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white/80" />
                </div>
                <span className="text-[1rem] md:text-[1.05rem] font-medium leading-[1.4] text-white break-all">support@bms.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white/80" />
                </div>
                <span className="text-[1rem] md:text-[1.05rem] font-medium leading-[1.4] text-white">+251-964-0172</span>
              </div>
            </div>
          </div>

          <FooterColumn title="Features" links={featureLinks} />
          <FooterColumn title="Property Types" links={propertyTypeLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="BMS" links={companyLinks} />
        </div>

        <div className="my-8 h-px w-full bg-white/20" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-white/65">
          <p className="text-[0.95rem] md:text-[1rem] leading-normal">(c) BMS. All Rights Reserved 2026</p>
          <div className="flex flex-wrap items-center gap-3 text-[0.95rem] md:text-[1rem] leading-normal">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">Terms and Conditions</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">Do Not Sell My Info</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[1.2rem] md:text-[1.5rem] font-semibold leading-tight text-white">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-[1rem] md:text-[1.05rem] leading-normal text-white/90 transition-colors hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

