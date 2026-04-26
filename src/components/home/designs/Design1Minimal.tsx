"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import {
  ArrowRight,
  BarChart3,
  Building,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  FileText,
  HelpCircle,
  House,
  LogOut,
  Landmark,
  Mail,
  MessageSquare,
  Rocket,
  Settings,
  ShieldCheck,
  Users2,
  Warehouse,
  Wrench,
} from "lucide-react"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"

const NAVY = "#1F3549"
const NAVY_DARK = "#152A3D"
const ACCENT = "#78a8f0"
const HERO_BLUE = "#33479a"

const copy = {
  en: {
    heroTitleTop: "Property Management",
    heroTitleOutline: "Software",
    heroTitleBold: "Built for You",
    heroSubtitle:
      "Coordinate listings, leases, payments, maintenance, documents, and tenant communication from one connected platform.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "View Features",
    trustTitle: "Trusted workflow for landlords and building operators",
    trustItems: [
      "Bilingual EN/AM experience",
      "Commercial + residential ready",
      "Owner and tenant dashboards",
    ],
    sectionDesc:
      "Focused capabilities designed to reduce manual work and increase visibility across all operations.",
    workflowTitle: "How your operations flow in BMS",
    workflowDesc:
      "From publishing a unit to monthly reporting, each step is connected.",
    diffTitle: "Built for your local reality",
    diffDesc:
      "Unlike generic tools, BMS includes workflows relevant to Ethiopian operations and commercial teams.",
    portalTitle: "Two experiences, one system",
    portalDesc:
      "Owners and tenants each get purpose-built dashboards with shared real-time data.",
    securityTitle: "Security, onboarding, and confidence",
    securityDesc:
      "Control who can access what, onboard quickly, and operate with clear records.",
    finalTitle: "Ready to simplify property operations?",
    finalDesc:
      "Save time across leasing, payments, and maintenance.\nBook a live demo to see how BMS fits your workflow.",
    finalCta: "Register as Owner",
  },
  am: {
    heroTitleTop: "Property Management",
    heroTitleOutline: "Software",
    heroTitleBold: "Built for You",
    heroSubtitle:
      "Coordinate listings, leases, payments, maintenance, documents, and tenant communication from one connected platform.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "View Features",
    trustTitle: "Trusted workflow for landlords and building operators",
    trustItems: [
      "Bilingual EN/AM experience",
      "Commercial + residential ready",
      "Owner and tenant dashboards",
    ],
    sectionDesc:
      "Focused capabilities designed to reduce manual work and increase visibility across all operations.",
    workflowTitle: "How your operations flow in BMS",
    workflowDesc:
      "From publishing a unit to monthly reporting, each step is connected.",
    diffTitle: "Built for your local reality",
    diffDesc:
      "Unlike generic tools, BMS includes workflows relevant to Ethiopian operations and commercial teams.",
    portalTitle: "Two experiences, one system",
    portalDesc:
      "Owners and tenants each get purpose-built dashboards with shared real-time data.",
    securityTitle: "Security, onboarding, and confidence",
    securityDesc:
      "Control who can access what, onboard quickly, and operate with clear records.",
    finalTitle: "Ready to simplify property operations?",
    finalDesc:
      "Save time across leasing, payments, and maintenance.\nBook a live demo to see how BMS fits your workflow.",
    finalCta: "Register as Owner",
  },
}

const modules = [
  { icon: Building2, title: "Listings & Units", desc: "Publish and manage available units from one place." },
  { icon: Users2, title: "Tenant Management", desc: "Track tenant profiles, requests, and communication." },
  { icon: CalendarDays, title: "Lease Lifecycle", desc: "Create, monitor, and renew rental agreements." },
  { icon: CreditCard, title: "Rent & Invoices", desc: "Monitor payment status and improve collection consistency." },
  { icon: Wrench, title: "Maintenance", desc: "Capture and resolve work orders with clear status updates." },
  { icon: FileText, title: "Documents", desc: "Store and review agreements and tenant files securely." },
  { icon: MessageSquare, title: "Messaging", desc: "Run landlord-tenant communication in-app." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Review occupancy, finance trends, and performance." },
]

const workflow = [
  "Publish available units",
  "Receive and review applicants",
  "Create leases and assign tenants",
  "Generate invoices and collect rent",
  "Resolve maintenance requests",
  "Review monthly reports",
]

const ownerItems = [
  "Portfolio dashboard with occupancy and revenue",
  "Lease, document, and payout visibility",
  "Team activity and operations tracking",
]

const tenantItems = [
  "View listings and payment history",
  "Submit maintenance and document requests",
  "Receive notices and communicate in-app",
]

const securityItems = [
  "Role-based access and secure records",
  "Centralized documents and review history",
  "Fast onboarding with guided workflows",
]

const propertyTypes = [
  { icon: House, title: "Residential Properties" },
  { icon: Building, title: "Commercial Properties" },
  { icon: Warehouse, title: "Apartment Housing" },
]

const faqTabs = [
  { id: "basic", label: "BASICS" },
  { id: "features", label: "FEATURES" },
  { id: "support", label: "SUPPORT" },
] as const

type FaqTab = (typeof faqTabs)[number]["id"]
type FaqItem = { id: string; q: string; a: string }

const faqByTab: Record<FaqTab, FaqItem[]> = {
  basic: [
    {
      id: "g1",
      q: "What is a property management software?",
      a: "Property management software is a centralized system for handling listings, leases, rent collection, maintenance, documents, and communication in one place. Instead of switching between spreadsheets and separate apps, teams can run daily operations with better visibility and fewer manual mistakes.",
    },
    {
      id: "g2",
      q: "What is BMS, and who is it for?",
      a: "BMS is built for owners, managers, and operations teams handling residential, commercial, and apartment properties. It is designed for teams that need one shared platform for tenant workflows, property operations, and financial tracking.",
    },
    {
      id: "g3",
      q: "How much does property management software cost?",
      a: "Cost usually depends on number of units, required modules, and onboarding scope. BMS supports phased rollout, so teams can start with core workflows and expand as portfolio needs grow.",
    },
    {
      id: "g4",
      q: "How many programs can BMS replace?",
      a: "Most teams use BMS to replace multiple disconnected tools used for listings, rent follow-up, maintenance handling, and tenant communication. This reduces duplicated work and gives management one reliable source of operational truth.",
    },
    {
      id: "g5",
      q: "Can I use BMS on mobile and desktop?",
      a: "Yes. BMS works on desktop and mobile so staff can handle approvals, requests, and updates from the office or while on-site. This helps keep operations responsive without waiting to return to a workstation.",
    },
    {
      id: "g6",
      q: "Is data stored securely in BMS?",
      a: "Yes. BMS applies role-based access and clear permission boundaries so users only see what they should. Activity history and structured records also make audits and accountability much easier for teams.",
    },
  ],
  features: [
    {
      id: "p1",
      q: "Does BMS support both owners and tenants?",
      a: "Yes. BMS includes separate owner and tenant experiences connected to the same underlying data. That means both sides see consistent updates for leases, invoices, requests, and notices in real time.",
    },
    {
      id: "p2",
      q: "Can we manage multiple properties in one account?",
      a: "Yes. You can manage multiple properties and units from a single account with portfolio-level visibility. Permissions can be assigned by role so teams can collaborate without losing control over sensitive actions.",
    },
    {
      id: "p3",
      q: "Does BMS support maintenance workflows?",
      a: "Yes. BMS supports the full maintenance cycle from request intake to assignment, progress tracking, and completion updates. Teams can monitor workload and response times without manual status chasing.",
    },
    {
      id: "p4",
      q: "Do you provide reporting and analytics?",
      a: "Yes. BMS provides reporting for occupancy, collections, and recurring operational metrics. These insights help teams detect issues early and make better decisions on staffing, budgets, and growth.",
    },
    {
      id: "p5",
      q: "Can we customize workflows per property?",
      a: "Yes. Workflows can be adapted to how each property actually operates, including statuses, approval flow, and process steps. This keeps the system practical for mixed portfolios with different operating models.",
    },
    {
      id: "p6",
      q: "Does BMS support document and lease history?",
      a: "Yes. BMS keeps organized lease and document records with clear history over time. This makes renewals, dispute resolution, and compliance checks much easier to manage.",
    },
  ],
  support: [
    {
      id: "s1",
      q: "How quickly can a team onboard?",
      a: "Most teams can onboard quickly through a guided setup process and phased adoption plan. Starting with essential workflows first helps teams get value early while minimizing disruption.",
    },
    {
      id: "s2",
      q: "Do you provide setup and staff training?",
      a: "Yes. We support setup, workflow configuration, and practical training for core staff roles. The goal is to make teams productive quickly, not just complete technical setup.",
    },
    {
      id: "s3",
      q: "What support is available after onboarding?",
      a: "After onboarding, support is available for configuration updates, usage guidance, and troubleshooting. Teams can continue refining workflows as operations evolve over time.",
    },
    {
      id: "s4",
      q: "Can we request custom improvements?",
      a: "Yes. Custom improvement ideas and workflow requests are reviewed continuously for roadmap planning. High-impact requests that improve daily operations are prioritized first.",
    },
    {
      id: "s5",
      q: "Do you provide migration help from older tools?",
      a: "Yes. We help teams migrate from spreadsheets or fragmented systems in a structured way. This includes mapping old data to clean records and reducing transition risk.",
    },
    {
      id: "s6",
      q: "Is ongoing support available after launch?",
      a: "Yes. Post-launch support is available for refresher training, setup tuning, and day-to-day operational issues. The objective is steady long-term adoption, not one-time deployment.",
    },
  ],
}

const demoQuestions = [
  "What changes when every unit balance is visible in one live dashboard?",
  "How much faster do teams resolve issues with one shared operations view?",
  "What would collections look like with fully structured payment workflows?",
  "How much follow-up time is saved when leases and billing stay connected?",
  "What happens to reporting speed when records are centralized by default?",
  "How quickly can new staff onboard with guided property workflows?",
  "What improves when maintenance, documents, and finance move in one system?",
  "How much risk is reduced with tracked approvals and activity history?",
  "What growth decisions become easier with clean portfolio analytics?",
  "How many manual tools can operations teams replace with one platform?",
]

function HeroDashboardRecreation() {
  return (
    <div className="hero-visual-wrap">
      <div className="hero-desktop-shell">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", minHeight: "482px" }}>
          <div style={{ backgroundColor: "#184c70", color: "rgba(255,255,255,0.86)", padding: "0.78rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.78rem", fontWeight: 700, fontSize: "0.95rem" }}>
              <Landmark style={{ width: 17, height: 17 }} />
              <span>BMS</span>
            </div>
            <div style={{ display: "grid", gap: "0.18rem" }}>
              {["Properties", "Tenants", "Leases", "Payments", "Maintenance", "Documents", "Messaging", "Insights"].map((item, idx) => (
                <div
                  key={item}
                  style={{
                    borderRadius: "6px",
                    padding: "0.36rem 0.5rem",
                    fontSize: "0.74rem",
                    backgroundColor: idx === 0 ? "rgba(255,255,255,0.14)" : "transparent",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "auto", display: "grid", gap: "0.18rem", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "0.55rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.32rem", padding: "0.36rem 0.5rem", fontSize: "0.73rem" }}>
                <Settings style={{ width: 13, height: 13 }} /> Settings
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.32rem", padding: "0.36rem 0.5rem", fontSize: "0.73rem" }}>
                <HelpCircle style={{ width: 13, height: 13 }} /> Help & Support
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.32rem", padding: "0.36rem 0.5rem", fontSize: "0.73rem" }}>
                <LogOut style={{ width: 13, height: 13 }} /> Logout
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: "#f6f8fb", padding: "0.9rem" }}>
            <div style={{ fontSize: "0.86rem", color: "#415872", fontWeight: 700, marginBottom: "0.6rem" }}>
              Overview
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "0.65rem" }}>
              <div style={{ border: "1px solid #d4deea", background: "white", borderRadius: "8px", padding: "0.6rem" }}>
                <div style={{ fontSize: "0.79rem", color: "#5f6f85", marginBottom: "0.5rem" }}>Outstanding Balances - Rentals</div>
                {["ETB 52,000", "ETB 14,800", "ETB 11,700", "ETB 8,900", "ETB 7,200"].map((row, i) => (
                  <div key={row} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.77rem", color: i === 0 ? "#1c2f45" : "#5f6f85", paddingBlock: "0.23rem", borderTop: i === 0 ? "none" : "1px solid #eef3f8" }}>
                    <span>Unit {i + 1}</span>
                    <span>{row}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid #d4deea", background: "white", borderRadius: "8px", padding: "0.6rem" }}>
                <div style={{ fontSize: "0.79rem", color: "#5f6f85", marginBottom: "0.45rem" }}>Rental Listings</div>
                <div style={{ width: "92px", height: "92px", borderRadius: "50%", margin: "0.25rem auto", background: "conic-gradient(#f2b32f 0 220deg, #e3e9f3 220deg)" }} />
                <div style={{ fontSize: "0.7rem", color: "#64758b", textAlign: "center" }}>23 Total Units</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.65rem", marginTop: "0.65rem" }}>
              <div style={{ border: "1px solid #d4deea", background: "white", borderRadius: "8px", padding: "0.6rem" }}>
                <div style={{ fontSize: "0.79rem", color: "#5f6f85", marginBottom: "0.45rem" }}>Expiring Leases</div>
                <div style={{ height: "88px", background: "linear-gradient(180deg,#f8fafc,#f2f7fc)", borderRadius: "6px", border: "1px solid #edf2f7", position: "relative" }}>
                  <div style={{ position: "absolute", left: "10%", bottom: "16%", width: "66%", height: "10px", backgroundColor: "#a67ad8", borderRadius: "999px" }} />
                </div>
              </div>
              <div style={{ border: "1px solid #d4deea", background: "white", borderRadius: "8px", padding: "0.6rem" }}>
                <div style={{ fontSize: "0.79rem", color: "#5f6f85", marginBottom: "0.45rem" }}>Tasks</div>
                <div style={{ display: "grid", gap: "0.28rem" }}>
                  {[1, 2, 3, 4].map((task) => (
                    <div key={task} style={{ height: "15px", borderRadius: "4px", backgroundColor: "#edf3f9" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OwnerPortalIllustration() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "560px",
        aspectRatio: "1.62 / 1",
        borderRadius: "30px",
        overflow: "hidden",
        border: "1px solid #d8e4f4",
        background:
          "radial-gradient(circle at 18% 92%, rgba(180, 204, 239, 0.62) 0 18%, transparent 18%), radial-gradient(circle at 74% 20%, rgba(200, 220, 247, 0.7) 0 22%, transparent 22%), linear-gradient(135deg, #dbe8fa 0%, #cfe0f7 52%, #dce8f8 100%)",
        boxShadow: "0 20px 46px rgba(32, 59, 103, 0.12)",
      }}
    >
      <div style={{ position: "absolute", inset: "0 auto auto 16%", width: "44%", height: "100%", background: "rgba(255,255,255,0.13)", transform: "skewX(-24deg)" }} />
      <div style={{ position: "absolute", inset: "0 auto auto 63%", width: "18%", height: "100%", background: "rgba(255,255,255,0.15)", transform: "skewX(-24deg)" }} />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "80%",
          height: "71%",
          borderRadius: "26px",
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,250,255,0.96))",
          border: "1px solid #d8e4f4",
          boxShadow: "0 20px 48px rgba(34, 58, 97, 0.16)",
          padding: "8px",
          overflow: "hidden",
        }}
      >
        <div style={{ borderRadius: "16px", border: "1px solid #cfe0f6", padding: "8px", minHeight: "100%", background: "linear-gradient(180deg, #fbfdff, #f4f8fd)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid #d9e6f7" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#233b63", letterSpacing: "0.01em" }}>Get started with BMS</div>
            <div style={{ width: "54px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #eaf3ff, #dceaff)", border: "1px solid #d3e2f4", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Rocket style={{ width: 14, height: 14, color: "#2f58a8" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.02fr 1fr", gap: "8px" }}>
            <div style={{ borderRadius: "12px", background: "transparent", minHeight: "76px" }} />

            <div style={{ borderRadius: "12px", border: "1px solid #e0e8f3", background: "#ffffff", minHeight: "76px", padding: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", paddingBottom: "4px", borderBottom: "1px solid #eef4fb" }}>
                <span style={{ fontSize: "0.55rem", color: "#2a4468", fontWeight: 700 }}>Recent Tenant Transactions</span>
                <span style={{ fontSize: "0.5rem", color: "#7a92b1" }}>Updated now</span>
              </div>
              {[
                ["Rent payment received", "Sunset Villas, Unit 4B", "ETB 18,500"],
                ["Late fee posted", "Bole Offices, Suite 2A", "ETB 1,200"],
                ["Charge reversed", "Lideta Apartments, 4C", "ETB 3,000"],
              ].map(([label, source, amount], idx) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "6px", padding: "4px 0", borderTop: idx === 0 ? "none" : "1px solid #eff4fa", color: "#395275", fontSize: "0.52rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: idx === 0 ? "#d9e7ff" : "#edf4ff", border: "1px solid #d7e4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#4f7be8", fontSize: "0.46rem", flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div>{label}</div>
                      <div style={{ marginTop: "1px", color: "#859ab6", fontSize: "0.5rem" }}>{source}</div>
                    </div>
                  </div>
                  <div style={{ color: idx === 2 ? "#da6262" : "#263f67", fontWeight: 700, whiteSpace: "nowrap", fontSize: "0.54rem" }}>
                    {idx === 2 ? `-${amount}` : amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "0.88fr 1.12fr", gap: "8px" }}>
            <div style={{ borderRadius: "12px", border: "1px solid #e0e8f3", background: "#ffffff", minHeight: "56px", padding: "8px" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#263f67", marginBottom: "3px" }}>27 March</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#365073", fontSize: "0.52rem" }}>
                <span style={{ width: "2px", height: "16px", borderRadius: "999px", background: "#4f87ff" }} />
                <span>Inspection for Sunset Villas, Unit 3B</span>
              </div>
            </div>
            <div style={{ borderRadius: "12px", border: "1px solid #e0e8f3", background: "#ffffff", minHeight: "56px", padding: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.52rem", color: "#7a90ad" }}>Transaction Summary</span>
                <span style={{ fontSize: "0.52rem", color: "#4f87ff" }}>This week</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                {[
                  ["26", "Payments"],
                  ["8", "Charges"],
                  ["3", "Refunds"],
                  ["94%", "Matched"],
                ].map(([value, label]) => (
                  <div key={value + label} style={{ borderRadius: "8px", border: "1px solid #edf3fa", background: "#fbfdff", padding: "6px" }}>
                    <div style={{ fontSize: "0.56rem", color: "#243d64", fontWeight: 700 }}>{value}</div>
                    <div style={{ marginTop: "2px", fontSize: "0.46rem", color: "#7f93b0" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "4.5%",
          top: "33%",
          width: "42%",
          maxHeight: "42%",
          borderRadius: "20px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,251,255,0.95))",
          border: "1px solid #dbe7f6",
          boxShadow: "0 16px 34px rgba(34, 58, 97, 0.16)",
          padding: "12px 12px 10px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "0.58rem", color: "#253e66", fontWeight: 700 }}>Outstanding Balances</span>
          <span style={{ fontSize: "0.5rem", color: "#8aa0bc" }}>Monthly</span>
        </div>
        <div style={{ display: "grid", gap: "4px", marginBottom: "7px" }}>
          {[
            ["Sunset Villas - Unit 3B", "12 days overdue", "ETB 52,000"],
            ["Bole Offices - Suite 2A", "7 days overdue", "ETB 18,750"],
          ].map(([unit, due, amount], idx) => (
            <div key={unit} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "6px", alignItems: "center", padding: "4px 0", borderTop: idx === 0 ? "none" : "1px solid #eef3f8" }}>
              <div>
                <div style={{ fontSize: "0.53rem", color: "#243d64", fontWeight: 700 }}>{unit}</div>
                <div style={{ marginTop: "1px", fontSize: "0.48rem", color: "#899cb5" }}>{due}</div>
              </div>
              <div style={{ fontSize: "0.56rem", color: "#243d64", fontWeight: 700, whiteSpace: "nowrap" }}>
                {amount}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e8eef7", paddingTop: "6px" }}>
          <div style={{ fontSize: "0.52rem", color: "#2d456b", fontWeight: 700, marginBottom: "5px" }}>Applicants</div>
          <div style={{ borderRadius: "10px", border: "1px solid #e1eaf7", background: "#ffffff", padding: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.54rem", fontWeight: 700, color: "#203a62" }}>á‹˜áˆ‹áˆˆáˆ áˆ°á‹©áˆœ</div>
                <div style={{ fontSize: "0.47rem", color: "#7f94af", marginTop: "1px" }}>Application #APL-2841 â€¢ 2BR â€¢ Kazanchis</div>
              </div>
              <span style={{ fontSize: "0.46rem", color: "#23784f", background: "#e7f8f0", border: "1px solid #cdeedc", borderRadius: "999px", padding: "2px 6px" }}>Verified</span>
            </div>
            <div style={{ marginTop: "4px", fontSize: "0.46rem", color: "#5f7391" }}>Submitted docs: ID, bank statement, guarantor letter</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaseWorkflowIllustration() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "560px",
        aspectRatio: "1.62 / 1",
        borderRadius: "30px",
        overflow: "hidden",
        border: "1px solid #e4e1dc",
        background:
          "radial-gradient(circle at 74% 18%, rgba(224, 224, 229, 0.75) 0 14%, transparent 14%), radial-gradient(circle at 48% 64%, rgba(230, 230, 235, 0.7) 0 20%, transparent 20%), linear-gradient(135deg, #f1efeb 0%, #ece9e4 48%, #f4f2ef 100%)",
        boxShadow: "0 20px 46px rgba(76, 76, 76, 0.08)",
      }}
    >
      <div style={{ position: "absolute", inset: "0 auto auto 16%", width: "16%", height: "100%", background: "rgba(255,255,255,0.16)" }} />
      <div style={{ position: "absolute", inset: "0 auto auto 32%", width: "22%", height: "100%", background: "rgba(255,255,255,0.14)" }} />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "80%",
          height: "71%",
          borderRadius: "26px",
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(249,248,246,0.96))",
          border: "1px solid #e4e2df",
          boxShadow: "0 20px 46px rgba(96, 96, 96, 0.11)",
          padding: "8px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "6px", borderBottom: "1px solid #e8e5e1", marginBottom: "7px" }}>
          <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "#263c66", letterSpacing: "0.01em" }}>Lease Overview</div>
          <div style={{ fontSize: "0.5rem", color: "#8390a3" }}>Unit Group A</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", marginTop: "54px" }}>
          {[
            ["Outstanding Balance", "Birr 24,500"],
            ["Upcoming Charges", "Birr 18,750"],
            ["Fixed Term", "1/1/2026 - 12/31/2026"],
            ["Linked Units", "12 Units"],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: "9px", border: "1px solid #ece8e3", background: "#fcfbf9", padding: "7px 7px 6px" }}>
              <div style={{ fontSize: "0.48rem", color: "#8890a3", marginBottom: "3px" }}>{label}</div>
              <div style={{ fontSize: label === "Fixed Term" ? "0.54rem" : "0.68rem", color: "#2a416b", fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "8px", borderRadius: "10px", border: "1px solid #ebe6e1", background: "#fcfbf9", padding: "8px" }}>
          <div style={{ fontSize: "0.6rem", color: "#2a416b", fontWeight: 700, marginBottom: "5px" }}>Lease termination</div>
          <div style={{ display: "grid", gap: "4px" }}>
            {[
              ["Sunset Villas - 3B", "Notice served â€¢ 30 days left", "In review"],
              ["Lideta Apartments - 4C", "Exit inspection scheduled", "Scheduled"],
              ["Bole Offices - 2A", "Deposit settlement pending", "Pending"],
            ].map(([unit, detail, status]) => (
              <div key={unit} style={{ borderRadius: "8px", border: "1px solid #ebe8e4", background: "#ffffff", padding: "6px", display: "grid", gridTemplateColumns: "1fr auto", gap: "6px", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.5rem", color: "#324a72", fontWeight: 700 }}>{unit}</div>
                  <div style={{ marginTop: "1px", fontSize: "0.45rem", color: "#72809a" }}>{detail}</div>
                </div>
                <span style={{ fontSize: "0.44rem", color: "#486281", background: "#f3f6fb", border: "1px solid #e0e8f3", borderRadius: "999px", padding: "2px 6px", whiteSpace: "nowrap" }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "9%",
          right: "6%",
          top: "33.5%",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(231,226,220,0.7)",
          boxShadow: "0 12px 26px rgba(96, 96, 96, 0.08)",
          padding: "10px 11px",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "5%",
          top: "32%",
          maxHeight: "24%",
          borderRadius: "18px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(251,250,248,0.95))",
          border: "1px solid #e7e2dc",
          boxShadow: "0 18px 36px rgba(96, 96, 96, 0.12)",
          padding: "8px",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: "0.58rem", color: "#2a416b", fontWeight: 700, marginBottom: "6px", paddingBottom: "4px", borderBottom: "1px solid #ece8e2" }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "7px" }}>
          {[
            ["Post Charge", "#fff3e7", "#ef8a23"],
            ["Receive Payment", "#e8faf1", "#18b06f"],
            ["Extend access to portal", "#e9f1ff", "#4f87ff"],
          ].map(([label, bg, fg], idx) => (
            <div key={label} style={{ borderRadius: "8px", border: "1px solid #ece8e2", background: "#ffffff", padding: "7px 6px", display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
              <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: bg, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.54rem", flexShrink: 0 }}>
                {idx === 0 ? "P" : idx === 1 ? "$" : "[]"}
              </span>
              <span style={{ color: "#35517a", fontSize: "0.48rem", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: "58%", top: "44px", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #2f3e8e", transform: "rotate(-44deg)" }} />
      </div>
    </div>
  )
}

function MaintenanceSnapshotCard() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "560px",
        aspectRatio: "1.62 / 1",
        borderRadius: "30px",
        overflow: "hidden",
        border: "1px solid #eedeea",
        background:
          "radial-gradient(circle at 62% 20%, rgba(232, 209, 227, 0.38) 0 22%, transparent 22%), radial-gradient(circle at 34% 82%, rgba(236, 217, 232, 0.4) 0 30%, transparent 30%), linear-gradient(135deg, #f6edf4 0%, #f2e9f1 54%, #f7eef5 100%)",
        boxShadow: "0 20px 46px rgba(110, 82, 106, 0.12)",
      }}
    >
      <div style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%, -50%)", width: "90%", height: "82%", borderRadius: "18px", border: "1px solid #e7dce6", background: "linear-gradient(180deg, #ffffff, #fbf8fb)", padding: "10px", overflow: "hidden", boxShadow: "0 12px 28px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1.5px solid #efe4ee" }}>
          <span style={{ fontSize: "0.68rem", color: "#2e4368", fontWeight: 800, letterSpacing: "-0.01em" }}>Tenant requests</span>
          <span style={{ fontSize: "0.55rem", color: "#8793aa", fontWeight: 600 }}>Work orders</span>
        </div>

        <div
          style={{
            marginTop: "12px",
            width: "100%",
            borderRadius: "12px",
            border: "1.5px solid #e8e3eb",
            background: "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,245,250,0.98))",
            boxShadow: "0 8px 18px rgba(88, 64, 85, 0.08)",
            padding: "8px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
            {[
              ["All requests", "250"],
              ["Captured", "170"],
              ["AI resolved", "68%"],
              ["Created", "32%"],
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: "8px", background: "#ffffff", border: "1px solid #ece7f0", padding: "6px 5px", textAlign: "center" }}>
                <div style={{ fontSize: "0.48rem", color: "#8690a5", lineHeight: 1.1, fontWeight: 600 }}>{label}</div>
                <div style={{ marginTop: "4px", fontSize: "0.78rem", color: "#253b63", fontWeight: 800 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
          {[
            ["Smell of gas from stove", "High", "Completed"],
            ["Bathroom door knob stuck", "Medium", "In Progress"],
            ["Change fridge light bulb", "Medium", "In Progress"],
            ["Broken microwave", "Low", "Pending"],
          ].map(([task, priority, stage], idx) => (
            <div key={task} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.6fr 0.8fr", alignItems: "center", gap: "8px", borderTop: idx === 0 ? "none" : "1px solid #f0e8f0", paddingTop: idx === 0 ? 0 : "6px" }}>
              <span style={{ fontSize: "0.55rem", color: "#314a72", fontWeight: 700 }}>{task}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: priority === "High" ? "#bf546f" : priority === "Medium" ? "#c37a2d" : "#6d83a1" }} />
                <span style={{ fontSize: "0.52rem", color: priority === "High" ? "#bf546f" : priority === "Medium" ? "#c37a2d" : "#6d83a1", fontWeight: 600 }}>{priority}</span>
              </div>
              <span style={{ fontSize: "0.52rem", color: stage === "Completed" ? "#238859" : stage === "In Progress" ? "#d08327" : "#8b95a7", fontWeight: 700, textAlign: "right" }}>{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
function ApplicantsForUnitsCard() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "560px",
        aspectRatio: "1.62 / 1",
        borderRadius: "30px",
        overflow: "hidden",
        border: "1px solid #d9e3a7",
        background:
          "radial-gradient(circle at 72% 24%, rgba(232, 244, 173, 0.48) 0 20%, transparent 20%), radial-gradient(circle at 36% 84%, rgba(228, 241, 162, 0.45) 0 32%, transparent 32%), linear-gradient(135deg, #e5f391 0%, #dded86 52%, #e9f5a8 100%)",
        boxShadow: "0 20px 46px rgba(92, 118, 44, 0.14)",
      }}
    >
      <div style={{ position: "absolute", inset: "0 auto auto 16%", width: "20%", height: "100%", background: "rgba(255,255,255,0.24)", transform: "skewX(-12deg)" }} />
      <div style={{ position: "absolute", inset: "0 auto auto 60%", width: "12%", height: "100%", background: "rgba(255,255,255,0.18)", transform: "skewX(-12deg)" }} />

      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "92%", height: "85%", display: "grid", gap: "10px", alignContent: "center" }}>
        {[
          ["Fayda Report", "Fyda identity report", ""],
          ["Credit Report", "Applicant's credit report", ""],
          ["Income Verification", "Automatically verify income", ""],
        ].map(([title, subtitle, icon], idx) => (
          <div
            key={title}
            style={{
              marginLeft: idx === 0 ? "2%" : idx === 1 ? "10%" : "18%",
              borderRadius: "14px",
              border: "2px solid #dde7b3",
              background: "linear-gradient(180deg, rgba(255,255,255,1), rgba(251,255,241,0.98))",
              boxShadow: "0 10px 22px rgba(99, 126, 52, 0.12)",
              padding: "10px 14px",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#eaf0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", color: "#16335e", fontWeight: 800 }}>{title}</div>
              <div style={{ marginTop: "2px", fontSize: "0.58rem", color: "#4b5563" }}>{subtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #dce7f5", fontSize: "0.52rem", fontWeight: 800, color: "#16335e" }}>
              {idx === 1 ? "Approve or Reject" : "Show Report"} <ChevronRight style={{ width: 10, height: 10 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Design1Minimal() {
  const router = useRouter()
  const locale = useLocale() as "en" | "am"
  const t = copy[locale]
  const [portalView, setPortalView] = useState<"owner" | "tenant">("owner")
  const [faqTab, setFaqTab] = useState<FaqTab>("basic")
  const [openFaq, setOpenFaq] = useState("")
  const [demoEmail, setDemoEmail] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [typedQuestion, setTypedQuestion] = useState("")
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false)
  const faqItems = faqByTab[faqTab]
  const leftFaqItems = faqItems.filter((_, idx) => idx % 2 === 0)
  const rightFaqItems = faqItems.filter((_, idx) => idx % 2 === 1)

  useEffect(() => {
    const full = demoQuestions[questionIndex] ?? ""
    const next = isDeletingQuestion
      ? full.slice(0, Math.max(0, typedQuestion.length - 1))
      : full.slice(0, typedQuestion.length + 1)

    const doneTyping = !isDeletingQuestion && next === full
    const doneDeleting = isDeletingQuestion && next.length === 0

    const delay = doneTyping ? 3200 : isDeletingQuestion ? 28 : 42
    const timer = window.setTimeout(() => {
      setTypedQuestion(next)
      if (doneTyping) setIsDeletingQuestion(true)
      if (doneDeleting) {
        setIsDeletingQuestion(false)
        setQuestionIndex((prev) => (prev + 1) % demoQuestions.length)
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [isDeletingQuestion, questionIndex, typedQuestion])

  const handleScheduleDemo = () => {
    const trimmed = demoEmail.trim()
    const target = trimmed
      ? `/home/register?email=${encodeURIComponent(trimmed)}`
      : "/home/register"
    router.push(target)
  }

  const portalContent = useMemo(() => {
    if (portalView === "owner") {
      return {
        title: "Owner Portal",
        image: "/Centralized-Dashboard.png",
        items: ownerItems,
      }
    }
    return {
      title: "Tenant Portal",
      image: "/In-App-Messaging.png",
      items: tenantItems,
    }
  }, [portalView])

  return (
    <div
      style={{
        minHeight: "100vh",
        color: NAVY_DARK,
        background:
          "radial-gradient(circle at 12% 10%, rgba(183, 203, 230, 0.4), transparent 38%), radial-gradient(circle at 88% 18%, rgba(174, 196, 224, 0.35), transparent 35%), linear-gradient(180deg, #d8e4f5 0%, #eaf1fb 26%, #ffffff 100%)",
      }}
    >
      <Header currentPage="home" forceLightTheme />

      <main>
        <section
          style={{
            padding: "10.1rem 1rem 5.4rem",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 18% 38%, rgba(190, 209, 234, 0.4) 0 18%, transparent 18%), radial-gradient(circle at 74% 52%, rgba(179, 201, 229, 0.36) 0 19%, transparent 19%), linear-gradient(135deg, #d7e4f5 0%, #dce8f7 45%, #d3e0f2 100%)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 16% 14%, rgba(255,255,255,0.28), transparent 35%), radial-gradient(circle at 80% 26%, rgba(255,255,255,0.2), transparent 30%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "44%", height: "45%", backgroundColor: "#e7effa", clipPath: "polygon(0 26%, 100% 100%, 0% 100%)" }} />
          <style>{`
            .hero-visual-wrap { min-height: 530px; }
            .hero-desktop-shell {
              width: calc(100% + 14vw);
              margin-right: -14vw;
              border-radius: 24px 0 0 24px;
              overflow: hidden;
              border: 1px solid #b7c5d5;
              box-shadow: 0 26px 60px rgba(21, 42, 61, 0.28);
              background-color: #0f4264;
            }
.hero-fill-btn {
              position: relative;
              overflow: hidden;
              border: 1px solid #b7c5d5;
              color: #1f3f69 !important;
              background: #ffffff !important;
              transition: color 0.2s ease;
            }
            .hero-fill-btn::before {
              content: "";
              position: absolute;
              inset: 0;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.2s ease;
              z-index: 0;
              pointer-events: none;
            }
            .hero-fill-btn > * { position: relative; z-index: 1; }
            .hero-fill-btn .hero-btn-label,
            .hero-fill-btn .hero-btn-icon { color: inherit !important; transition: color 0.2s ease; }
            .hero-fill-btn--primary::before { background: #5d8dd9; }
            .hero-fill-btn--secondary::before { background: #5d8dd9; }
            .hero-fill-btn:hover::before { transform: scaleX(1); }
.hero-fill-btn:hover { color: #ffffff !important; }
            .hero-fill-btn:hover .hero-btn-label,
            .hero-fill-btn:hover .hero-btn-icon { color: #ffffff !important; }
            .hero-property-card {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.8rem;
              border: 1px solid rgba(197, 208, 226, 0.95);
              border-radius: 20px;
              background: #f5f7fb;
              padding: 0.78rem 1rem;
              min-height: 92px;
              box-shadow: 0 8px 20px rgba(29, 52, 82, 0.06);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .hero-property-card:hover { transform: translateY(-3px); box-shadow: 0 14px 26px rgba(29, 52, 82, 0.11); }
            .hero-property-icon {
              width: 54px;
              height: 54px;
              border-radius: 14px;
              border: 1px solid rgba(192, 205, 223, 0.9);
              background: linear-gradient(160deg, #ecf1f8, #dfe8f4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #2b6fd8;
              flex-shrink: 0;
            }
            .faq-card {
              transition: box-shadow 0.22s ease, transform 0.22s ease;
            }
            .faq-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 14px 28px rgba(29,52,82,0.12);
            }
            @media (max-width: 980px) {
              .hero-visual-wrap { min-height: 420px; }
              .hero-desktop-shell { width: 100%; margin-right: 0; border-radius: 20px; }
            }
            @media (max-width: 1080px) {
              .faq-columns { grid-template-columns: 1fr !important; }
            }
            @media (max-width: 760px) { .hero-visual-wrap { min-height: auto; } }
          `}</style>

          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gap: "2rem", alignItems: "center", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ marginTop: "-8.7rem" }}>
                <h1 style={{ fontSize: "clamp(1.8rem, 4.3vw, 3.45rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#182c43", marginBottom: "0.8rem" }}>
                  <span style={{ display: "block", fontWeight: 200, color: "#223a54" }}>
                    {t.heroTitleTop} {t.heroTitleOutline}
                  </span>
                  <span style={{ display: "block", color: "#1b3552" }}>
                    <span style={{ fontWeight: 800 }}>Built for </span>
                    <span style={{ fontWeight: 800 }}>You</span>
                  </span>
                </h1>
                <p style={{ fontSize: "clamp(0.92rem, 1.1vw, 1.03rem)", color: "#314962", lineHeight: 1.58, maxWidth: "560px", marginBottom: "0.95rem" }}>
                  {t.heroSubtitle}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
                  <Button onClick={() => router.push("/auth/signup")} className="hero-fill-btn hero-fill-btn--primary" style={{ height: "46px", paddingInline: "1.4rem", borderRadius: "10px" }}>
                    <span className="hero-btn-label">{t.ctaPrimary}</span>
                    <ArrowRight className="hero-btn-icon" style={{ width: 18, height: 18, marginLeft: 6 }} />
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/home/services")} className="hero-fill-btn hero-fill-btn--secondary" style={{ height: "46px", paddingInline: "1.25rem", borderRadius: "10px" }}>
                    <span className="hero-btn-label">{t.ctaSecondary}</span>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
                <div id="hero-switch-point" style={{ height: 1 }} />
                <HeroDashboardRecreation />
              </motion.div>
            </div>

            <div style={{ marginTop: "2.9rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.8rem" }}>
              {propertyTypes.map((item) => (
                <div key={item.title} className="hero-property-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="hero-property-icon">
                      <item.icon style={{ width: 26, height: 26 }} />
                    </div>
                    <div style={{ fontSize: "1.02rem", fontWeight: 600, color: "#2f3950", lineHeight: 1.16, letterSpacing: "-0.01em", maxWidth: "148px" }}>
                      {item.title}
                    </div>
                  </div>
                  <ChevronRight style={{ width: 24, height: 24, color: "#a5b6cc" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "1rem 1rem 2.75rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ borderRadius: "22px", border: "1px solid #c9d8f0", background: "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(240,246,255,0.92))", padding: "1.2rem", boxShadow: "0 14px 32px rgba(22, 45, 78, 0.08)" }}>
              <p style={{ marginBottom: "0.9rem", fontWeight: 700, color: NAVY_DARK, fontSize: "1.1rem" }}>
                {t.trustTitle}
              </p>
              <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
                {t.trustItems.map((item) => (
                  <div key={item} style={{ border: "1px solid #d2def2", borderRadius: "14px", padding: "0.8rem", backgroundColor: "rgba(255,255,255,0.85)", fontSize: "0.9rem", color: "#314962" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: ACCENT }} />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "2rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: NAVY_DARK, marginBottom: "0.5rem", lineHeight: 1.15 }}>
                <span>Every </span>
                <span style={{ color: ACCENT }}>feature.</span>
                <span> All in </span>
                <span style={{ color: ACCENT }}>one platform.</span>
              </h2>
              <p style={{ color: "#5f6f85", marginBottom: "1.5rem" }}>{t.sectionDesc}</p>
            </motion.div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "0.9rem" }}>
              {modules.map((module, idx) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  style={{ border: "1px solid #dde5f3", backgroundColor: "white", borderRadius: "14px", padding: "1rem", boxShadow: "0 7px 20px rgba(22,36,62,0.06)" }}
                >
                  <module.icon style={{ width: 22, height: 22, color: NAVY, marginBottom: "0.6rem" }} />
                  <h3 style={{ marginBottom: "0.3rem", fontSize: "1.03rem", color: NAVY_DARK }}>{module.title}</h3>
                  <p style={{ fontSize: "0.92rem", color: "#5f6f85", marginBottom: 0 }}>{module.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "0.4rem 1rem 3rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <style>{`
              .learn-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                color: #3d87ff;
                font-weight: 700;
                text-decoration: none;
                transition: transform 0.18s ease, color 0.18s ease;
              }
              .learn-link .learn-arrow { transition: transform 0.18s ease; }
              .learn-link:hover { transform: translateY(-1px); color: #1f6fff; }
              .learn-link:hover .learn-arrow { transform: translateX(4px); }
            `}</style>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(480px,1fr))", gap: "1.8rem", alignItems: "start" }}>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <OwnerPortalIllustration />
                <div style={{ paddingTop: "1.15rem", maxWidth: "560px", width: "100%" }}>
                  <h3 style={{ margin: 0, fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", lineHeight: 1.12, letterSpacing: "-0.03em", color: "#1f2e68", fontWeight: 700 }}>
                    Stay on top of outstanding balances and tenant transactions
                  </h3>
                  <p style={{ margin: "0.8rem 0 0", fontSize: "clamp(0.95rem, 1.45vw, 1.03rem)", lineHeight: 1.55, color: "#2f4375" }}>
                    One connected financial view for your team to track unpaid rent, recent tenant activity, and the exact records operations run on.
                  </p>
                  <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.15rem" }}>
                    {[
                      "Monitor overdue balances across units in real time",
                      "Review recent tenant transactions without switching screens",
                      "Keep collections, tenant activity, and finance visibility connected",
                    ].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#2e416f", fontSize: "clamp(0.92rem, 1.3vw, 1rem)" }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #3d87ff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3d87ff", fontSize: "0.8rem", flexShrink: 0 }}>
                          +
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.25rem", marginBottom: "4rem", fontSize: "clamp(0.98rem, 1.35vw, 1.05rem)" }}>
                    <a className="learn-link" href="/home/services/reporting-analytics">
                      <span>Learn about balances and reporting</span>
                      <span className="learn-arrow">{"->"}</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <LeaseWorkflowIllustration />
                <div style={{ paddingTop: "1.15rem", maxWidth: "560px", width: "100%" }}>
                  <h3 style={{ margin: 0, fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", lineHeight: 1.12, letterSpacing: "-0.03em", color: "#1f2e68", fontWeight: 700 }}>
                    Get paid on time with automatic rent collection.
                  </h3>
                  <p style={{ margin: "0.8rem 0 0", fontSize: "clamp(0.95rem, 1.45vw, 1.03rem)", lineHeight: 1.55, color: "#2f4375" }}>
                    Automate collection across your portfolio so upcoming charges, lease payment methods, and owner actions stay clear and on time.
                  </p>
                  <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.15rem" }}>
                    {[
                      "Collect rent with clear payment actions and charge controls",
                      "Keep lease balances, terms, and linked units visible in one place",
                      "Reduce follow-up work with structured rent collection workflows",
                    ].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#2e416f", fontSize: "clamp(0.92rem, 1.3vw, 1rem)" }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #3d87ff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3d87ff", fontSize: "0.8rem", flexShrink: 0 }}>
                          +
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.25rem", marginBottom: "4rem", fontSize: "clamp(0.98rem, 1.35vw, 1.05rem)" }}>
                    <a className="learn-link" href="/home/services/property-management">
                      <span>Learn about rent collection</span>
                      <span className="learn-arrow">{"->"}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(480px,1fr))", gap: "1.8rem", alignItems: "start", marginTop: "2rem" }}>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <MaintenanceSnapshotCard />
                <div style={{ paddingTop: "1.15rem", maxWidth: "560px", width: "100%" }}>
                  <h3 style={{ margin: 0, fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", lineHeight: 1.12, letterSpacing: "-0.03em", color: "#1f2e68", fontWeight: 700 }}>
                    Manage work orders with clear KPI visibility
                  </h3>
                  <p style={{ margin: "0.8rem 0 0", fontSize: "clamp(0.95rem, 1.45vw, 1.03rem)", lineHeight: 1.55, color: "#2f4375" }}>
                    Track tenant requests with KPI cards, priority queues, and live work-order status in one compact panel.
                  </p>
                  <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.15rem" }}>
                    {[
                      "View all open work orders and status at a glance",
                      "Prioritize urgent issues with clear KPI distribution",
                      "Reduce maintenance delays with structured tracking",
                    ].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#2e416f", fontSize: "clamp(0.92rem, 1.3vw, 1rem)" }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #3d87ff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3d87ff", fontSize: "0.8rem", flexShrink: 0 }}>
                          +
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.8rem", fontSize: "clamp(0.98rem, 1.35vw, 1.05rem)" }}>
                    <a className="learn-link" href="/home/services/maintenance-management">
                      <span>Learn about maintenance management</span>
                      <span className="learn-arrow">{"->"}</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <ApplicantsForUnitsCard />
                <div style={{ paddingTop: "1.15rem", maxWidth: "560px", width: "100%" }}>
                  <h3 style={{ margin: 0, fontSize: "clamp(1.35rem, 2.6vw, 1.9rem)", lineHeight: 1.12, letterSpacing: "-0.03em", color: "#1f2e68", fontWeight: 700 }}>
                    Screen applicants before assigning units
                  </h3>
                  <p style={{ margin: "0.8rem 0 0", fontSize: "clamp(0.95rem, 1.45vw, 1.03rem)", lineHeight: 1.55, color: "#2f4375" }}>
                    Review applicant profile quality, verify required documents, and confirm affordability before lease placement.
                  </p>
                  <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.15rem" }}>
                    {[
                      "Run document verification before final unit assignment",
                      "Check affordability signals before lease approval",
                      "Keep applicant review decisions consistent across teams",
                    ].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#2e416f", fontSize: "clamp(0.92rem, 1.3vw, 1rem)" }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #3d87ff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3d87ff", fontSize: "0.8rem", flexShrink: 0 }}>
                          +
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.8rem", fontSize: "clamp(0.98rem, 1.35vw, 1.05rem)" }}>
                    <a className="learn-link" href="/home/services/tenant-experience">
                      <span>Learn about tenant management</span>
                      <span className="learn-arrow">{"->"}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section style={{ padding: "4rem 1rem", background: "#ffffff", overflow: "hidden" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              style={{ textAlign: "center", marginBottom: "3rem" }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{ height: "2px", width: "24px", background: "linear-gradient(90deg, transparent, " + HERO_BLUE + ")" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: HERO_BLUE, letterSpacing: "0.15em", textTransform: "uppercase" }}>Process Flow</span>
                <div style={{ height: "2px", width: "24px", background: "linear-gradient(90deg, " + HERO_BLUE + ", transparent)" }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: NAVY_DARK, marginBottom: "0.75rem", fontWeight: 800 }}>
                BMS <span style={{ color: HERO_BLUE, position: "relative" }}>
                  Workflow
                </span>
              </h2>
              <p style={{ color: "#5f6f85", fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>{t.workflowDesc}</p>
            </motion.div>

            <style>{`
              .workflow-container {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 1rem;
                position: relative;
                padding: 20px 0;
              }
              .workflow-item {
                position: relative;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .workflow-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #f0f7ff;
                border: 2px solid #e0eaff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1rem;
                position: relative;
                z-index: 2;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                color: ${HERO_BLUE};
              }
              .workflow-item:hover .workflow-circle {
                transform: scale(1.1);
                background: #78a8f0;
                border-color: #78a8f0;
                color: #ffffff;
                box-shadow: 0 8px 20px rgba(120, 168, 240, 0.3);
              }
              .workflow-line {
                position: absolute;
                top: 30px;
                left: calc(50% + 30px);
                right: calc(-50% + 30px);
                height: 2px;
                background: #e0eaff;
                z-index: 1;
              }
              .workflow-pulse-dot {
                position: absolute;
                top: -3px;
                left: 0;
                width: 8px;
                height: 8px;
                background: #78a8f0;
                border-radius: 50%;
                box-shadow: 0 0 12px #78a8f0;
                animation: flowPulseTotal 12s infinite linear;
              }
              @keyframes flowPulseTotal {
                0% { left: 0%; opacity: 0; }
                2% { opacity: 1; }
                98% { opacity: 1; }
                100% { left: 600%; opacity: 0; }
              }
              .step-spark {
                position: absolute;
                inset: -4px;
                border-radius: 50%;
                border: 2px solid #78a8f0;
                opacity: 0;
                pointer-events: none;
              }
              .workflow-item:nth-child(1) .step-spark { animation: sparkAnim 12s infinite linear 0s; }
              .workflow-item:nth-child(2) .step-spark { animation: sparkAnim 12s infinite linear 2s; }
              .workflow-item:nth-child(3) .step-spark { animation: sparkAnim 12s infinite linear 4s; }
              .workflow-item:nth-child(4) .step-spark { animation: sparkAnim 12s infinite linear 6s; }
              .workflow-item:nth-child(5) .step-spark { animation: sparkAnim 12s infinite linear 8s; }
              .workflow-item:nth-child(6) .step-spark { animation: sparkAnim 12s infinite linear 10s; }

              @keyframes sparkAnim {
                0%, 0.5% { opacity: 0; transform: scale(1); }
                1% { opacity: 1; transform: scale(1.2); }
                2%, 100% { opacity: 0; transform: scale(1.4); }
              }

              .workflow-content {
                transition: transform 0.3s ease;
              }
              .workflow-item:hover .workflow-content {
                transform: translateY(-4px);
              }
              @media (max-width: 1200px) {
                .workflow-container { grid-template-columns: repeat(3, 1fr); gap: 3rem; }
                .workflow-line:nth-child(3n) { display: none; }
              }
              @media (max-width: 768px) {
                .workflow-container { grid-template-columns: 1fr; gap: 3rem; }
                .workflow-line { 
                  top: calc(100% + 0.5rem); 
                  left: 50%; 
                  right: auto; 
                  width: 2px; 
                  height: 2rem; 
                  transform: translateX(-50%);
                }
                .workflow-pulse-dot { display: none; }
              }
            `}</style>

            <div className="workflow-container">
              {workflow.map((step, idx) => (
                <div key={step} className="workflow-item">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="workflow-circle"
                  >
                    <div className="step-spark" />
                    <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>0{idx + 1}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="workflow-content"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                  >
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: NAVY_DARK, marginBottom: "0.4rem" }}>
                      {step}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#5f6f85", lineHeight: 1.4, padding: "0 5px" }}>
                      {idx === 0 && "Publish units to our marketplace with high-quality media."}
                      {idx === 1 && "Securely screen applicants and manage digital signings."}
                      {idx === 2 && "Create leases and assign tenants with automated records."}
                      {idx === 3 && "Automate monthly rent invoices and track collections."}
                      {idx === 4 && "Capture and resolve work orders with clear status updates."}
                      {idx === 5 && "Review monthly reports and portfolio performance trends."}
                    </p>
                  </motion.div>

                  {idx < workflow.length - 1 && (
                    <div className="workflow-line">
                      {idx === 0 && <div className="workflow-pulse-dot" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "2.5rem 1rem 3rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1rem" }}>
              <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ borderRadius: "16px", background: "linear-gradient(135deg, #33479a 0%, #304493 100%)", color: "white", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.22)" }}>
              <h3 style={{ fontSize: "1.35rem", marginBottom: "0.6rem", color: "white" }}>{t.diffTitle}</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "0.9rem" }}>{t.diffDesc}</p>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {["Attendance for commercial operations", "Localized workflows and bilingual UX", "Integrated notices, documents, and reports"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: ACCENT }} />
                    <span style={{ color: "rgba(255,255,255,0.94)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ borderRadius: "16px", border: "1px solid #d8e2f1", backgroundColor: "white", padding: "1.25rem" }}>
              <h3 style={{ fontSize: "1.35rem", marginBottom: "0.45rem", color: NAVY_DARK }}>{t.securityTitle}</h3>
              <p style={{ color: "#5f6f85", marginBottom: "0.8rem" }}>{t.securityDesc}</p>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {securityItems.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.92rem", color: "#334155" }}>
                    <ShieldCheck style={{ width: 16, height: 16, color: NAVY }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: "2.5rem 1rem 3rem", background: "linear-gradient(180deg, #f8fbff, #ffffff)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.55rem, 3.8vw, 2.35rem)", color: NAVY_DARK, marginBottom: "0.45rem" }}>
              Two experiences, <span style={{ color: HERO_BLUE }}>one system</span>
            </h2>
            <p style={{ color: "#5f6f85", marginBottom: "1rem" }}>{t.portalDesc}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <Button onClick={() => setPortalView("owner")} style={{ borderRadius: "10px", backgroundColor: portalView === "owner" ? HERO_BLUE : "white", border: "1px solid #d7e0ef", color: portalView === "owner" ? "white" : NAVY_DARK }}>
                Owner View
              </Button>
              <Button onClick={() => setPortalView("tenant")} style={{ borderRadius: "10px", backgroundColor: portalView === "tenant" ? HERO_BLUE : "white", border: "1px solid #d7e0ef", color: portalView === "tenant" ? "white" : NAVY_DARK }}>
                Tenant View
              </Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1rem", alignItems: "center" }}>
              <motion.div key={portalView} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ border: "1px solid #dbe4f2", borderRadius: "16px", background: "white", overflow: "hidden", boxShadow: "0 10px 24px rgba(31,53,73,0.08)" }}>
                  <img src={portalContent.image} alt={portalContent.title} style={{ width: "100%", display: "block" }} />
                </div>
              </motion.div>
              <motion.div key={`${portalView}-list`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h3 style={{ fontSize: "1.25rem", color: NAVY_DARK, marginBottom: "0.7rem" }}>{portalContent.title}</h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {portalContent.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.55rem", color: "#344256" }}>
                      <CheckCircle2 style={{ width: 17, height: 17, color: ACCENT }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section style={{ padding: "4.7rem 1rem 3.2rem", background: "#f5f7fb" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.65rem, 3.4vw, 2.55rem)", fontWeight: 600, letterSpacing: "-0.01em", color: "#1f2b3a", marginBottom: "1.05rem" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ borderBottom: "2px dashed #d7dce4", margin: "2.5rem 0" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.2rem, 5vw, 3.8rem)", marginBottom: "-2px", flexWrap: "wrap" }}>
              {faqTabs.map((tab) => {
                const active = faqTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFaqTab(tab.id)
                      setOpenFaq("")
                    }}
                    style={{
                      border: "none",
                      borderBottom: active ? "4px solid #78a8f0" : "4px solid transparent",
                      backgroundColor: "transparent",
                      color: active ? "#78a8f0" : "#a4acb8",
                      borderRadius: 0,
                      minWidth: "120px",
                      height: "52px",
                      fontSize: "1rem",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
            </div>
            <div className="faq-columns" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
              {[leftFaqItems, rightFaqItems].map((columnItems, colIdx) => (
                <div key={`faq-col-${colIdx}`} style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
                  {columnItems.map((item) => {
                const active = openFaq === item.id
                return (
                  <div key={item.id} className="faq-card" style={{ border: "1px solid #d7dde8", borderRadius: "10px", backgroundColor: "white", boxShadow: active ? "0 10px 24px rgba(29,52,82,0.09)" : "none" }}>
                    <button
                      onClick={() => setOpenFaq(active ? "" : item.id)}
                      style={{ width: "100%", border: "none", background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", padding: active ? "1.55rem 1.6rem 0.9rem" : "1.45rem 1.6rem", fontSize: "clamp(1.02rem,1.45vw,1.25rem)", color: "#1b2e45", fontWeight: 600, textAlign: "left" }}
                    >
                      <span>{item.q}</span>
                      {active ? <ChevronUp style={{ width: 26, height: 26 }} /> : <ChevronDown style={{ width: 26, height: 26 }} />}
                    </button>
                    {active && <p style={{ margin: 0, padding: "0 1.6rem 1.45rem", color: "#304962", fontSize: "1rem", lineHeight: 1.6 }}>{item.a}</p>}
                  </div>
                )
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "4.25rem 1rem 0",
            background: "#ffffff",
          }}
        >
<style>{`
            .cta-form-grid {
              display: grid;
              grid-template-columns: 1.7fr 1fr;
              border-radius: 12px;
              overflow: hidden;
              width: 100%;
            }
            .cta-fill-btn {
              position: relative;
              overflow: hidden;
            }
            .cta-fill-btn::before {
              content: "";
              position: absolute;
              inset: 0;
              background: #5d8dd9;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.25s ease;
              z-index: 0;
              pointer-events: none;
            }
            .cta-fill-btn:hover::before {
              transform: scaleX(1);
            }
            .cta-fill-btn span, .cta-fill-btn {
              position: relative;
              z-index: 1;
            }
            .cta-fill-btn:hover span {
              color: #ffffff !important;
            }
            @media (max-width: 720px) {
              .cta-form-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "42px",
                border: "1px solid #cfe0fb",
                background:
                  "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.35), transparent 46%), radial-gradient(circle at 75% 38%, rgba(255,255,255,0.22), transparent 45%), linear-gradient(135deg, #2c7df2 0%, #256ce8 42%, #1b55d8 100%)",
                boxShadow: "0 26px 70px rgba(16, 44, 92, 0.22)",
                padding: "clamp(2.1rem, 4vw, 3.2rem)",
              }}
            >
              <div style={{ position: "absolute", inset: "-20% auto auto -14%", width: "54%", height: "160%", background: "rgba(255,255,255,0.12)", transform: "skewX(-18deg)" }} />
              <div style={{ position: "absolute", inset: "-10% auto auto 52%", width: "22%", height: "140%", background: "rgba(255,255,255,0.1)", transform: "skewX(-18deg)" }} />

              <div style={{ position: "relative", maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
                <p style={{ margin: "0 auto 1.7rem", color: "rgba(245,248,255,0.95)", maxWidth: "820px", lineHeight: 1.45, fontSize: "clamp(1.04rem, 1.55vw, 1.24rem)", whiteSpace: "pre-line" }}>
                  {t.finalDesc}
                </p>

                <div
                  style={{
                    margin: "0 auto",
                    maxWidth: "860px",
                    borderRadius: "30px",
                    background:
                      "radial-gradient(circle at 70% -10%, rgba(63, 95, 128, 0.28) 0 44%, transparent 44%), linear-gradient(180deg, #223f5c 0%, #1f3851 56%, #1a334a 100%)",
                    boxShadow: "0 18px 44px rgba(12, 26, 43, 0.34)",
                    padding: "clamp(1.4rem, 2.6vw, 2rem)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <div style={{ textAlign: "left", fontSize: "clamp(1.22rem, 2vw, 1.65rem)", lineHeight: 1.22, color: "rgba(255,255,255,0.96)", fontWeight: 500 }}>
                    <span>{typedQuestion || t.finalTitle}</span>
                    <span style={{ display: "inline-block", marginLeft: 6, opacity: 0.9 }}>|</span>
                  </div>

                  <div
                    className="cta-form-grid"
                    style={{
                      marginTop: "1.2rem",
                      boxShadow: "0 10px 24px rgba(6, 12, 30, 0.24)",
                      maxWidth: "700px",
                      marginInline: "auto",
                    }}
                  >
                    <div style={{ background: "#ffffff", color: "#98A0A8", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.2rem", height: "56px", fontSize: "1.05rem", textAlign: "left", flex: 1 }}>
                      <Mail style={{ width: 24, height: 24, color: "#a6adb6", flexShrink: 0 }} />
                      <input
                        type="email"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleScheduleDemo()
                        }}
                        placeholder="Your Email"
                        style={{
                          flex: 1,
                          height: "100%",
                          border: "none",
                          outline: "none",
                          color: "#6b7280",
                          fontSize: "1.05rem",
                          background: "transparent",
                        }}
                        aria-label="Your Email"
                      />
                    </div>
                    <button
                      onClick={() => router.push("/home/register")}
                      className="cta-fill-btn"
                      style={{
                        height: "56px",
                        paddingInline: "2.4rem",
                        borderRadius: "0",
                        backgroundColor: "#78a8f0",
                        color: "#FFFFFF",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span>Register as Owner</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: "6.5rem", background: "#ffffff" }} />
      </main>

      <Footer />
    </div>
  )
}

