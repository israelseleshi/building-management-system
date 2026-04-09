"use client"

import { useMemo, useState } from "react"
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
const ACCENT = "#42D3BB"
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
    finalCta: "Schedule a Demo",
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
    finalCta: "Schedule a Demo",
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
  { id: "general", label: "General" },
  { id: "product", label: "Product" },
  { id: "support", label: "Support" },
] as const

type FaqTab = (typeof faqTabs)[number]["id"]
type FaqItem = { id: string; q: string; a: string }

const faqByTab: Record<FaqTab, FaqItem[]> = {
  general: [
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
  product: [
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

export function Design1Minimal() {
  const router = useRouter()
  const locale = useLocale() as "en" | "am"
  const t = copy[locale]
  const [portalView, setPortalView] = useState<"owner" | "tenant">("owner")
  const [faqTab, setFaqTab] = useState<FaqTab>("general")
  const [openFaq, setOpenFaq] = useState("")
  const [demoEmail, setDemoEmail] = useState("")
  const faqItems = faqByTab[faqTab]
  const leftFaqItems = faqItems.filter((_, idx) => idx % 2 === 0)
  const rightFaqItems = faqItems.filter((_, idx) => idx % 2 === 1)

  const handleScheduleDemo = () => {
    const trimmed = demoEmail.trim()
    const target = trimmed
      ? `/home/contact?email=${encodeURIComponent(trimmed)}`
      : "/home/contact"
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
          "radial-gradient(circle at 12% 10%, rgba(122, 87, 255, 0.18), transparent 38%), radial-gradient(circle at 88% 18%, rgba(77, 121, 255, 0.2), transparent 35%), linear-gradient(180deg, #eff4ff 0%, #f8fbff 26%, #ffffff 100%)",
      }}
    >
      <Header currentPage="home" />

      <main>
        <section
          style={{
            padding: "10.1rem 1rem 5.4rem",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 18% 38%, rgba(84,107,205,0.22) 0 18%, transparent 18%), radial-gradient(circle at 74% 52%, rgba(56,80,178,0.24) 0 19%, transparent 19%), linear-gradient(135deg, #33479a 0%, #364a9f 45%, #304493 100%)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 16% 14%, rgba(255,255,255,0.16), transparent 35%), radial-gradient(circle at 80% 26%, rgba(255,255,255,0.09), transparent 30%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "44%", height: "45%", backgroundColor: "#f2f4f7", clipPath: "polygon(0 26%, 100% 100%, 0% 100%)" }} />
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
              border: 1px solid rgba(255,255,255,0.44);
              color: #ffffff !important;
              background: rgba(255,255,255,0.14) !important;
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
            }
            .hero-fill-btn > * { position: relative; z-index: 1; }
            .hero-fill-btn .hero-btn-label,
            .hero-fill-btn .hero-btn-icon { color: inherit !important; transition: color 0.2s ease; }
            .hero-fill-btn--primary::before { background: #42D3BB; }
            .hero-fill-btn--secondary::before { background: #1F3549; }
            .hero-fill-btn:hover::before { transform: scaleX(1); }
            .hero-fill-btn:hover { color: white !important; }
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ marginTop: "-4.9rem" }}>
                <h1 style={{ fontSize: "clamp(1.8rem, 4.3vw, 3.45rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "white", marginBottom: "0.8rem" }}>
                  <span style={{ display: "block", fontWeight: 200, color: "rgba(255,255,255,0.98)" }}>
                    {t.heroTitleTop} {t.heroTitleOutline}
                  </span>
                  <span style={{ display: "block", color: "rgba(255,255,255,0.98)" }}>
                    <span style={{ fontWeight: 800 }}>Built for </span>
                    <span style={{ fontWeight: 800 }}>You</span>
                  </span>
                </h1>
                <p style={{ fontSize: "clamp(0.92rem, 1.1vw, 1.03rem)", color: "rgba(255,255,255,0.94)", lineHeight: 1.58, maxWidth: "560px", marginBottom: "0.95rem" }}>
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

        <section style={{ padding: "2rem 1rem 3rem", background: "linear-gradient(180deg, #ffffff, #f8fbff)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.55rem, 3.8vw, 2.35rem)", color: NAVY_DARK, marginBottom: "0.5rem" }}>
              {t.workflowTitle}
            </h2>
            <p style={{ color: "#5f6f85", marginBottom: "1.25rem" }}>{t.workflowDesc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.75rem" }}>
              {workflow.map((step, idx) => (
                <motion.div key={step} whileHover={{ y: -4 }} style={{ borderRadius: "12px", border: "1px solid #dbe4f2", backgroundColor: "white", padding: "0.9rem" }}>
                  <div style={{ color: ACCENT, fontWeight: 700, marginBottom: "0.4rem" }}>0{idx + 1}</div>
                  <div style={{ color: NAVY_DARK, fontSize: "0.93rem" }}>{step}</div>
                </motion.div>
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
                    <CheckCircle2 style={{ width: 16, height: 16, color: "#42D3BB" }} />
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

        <section style={{ padding: "1.7rem 1rem 3.2rem", background: "#f5f7fb" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.65rem, 3.4vw, 2.55rem)", fontWeight: 500, letterSpacing: "-0.01em", color: "#1f2b3a", marginBottom: "0.95rem" }}>
              Your questions, answered
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.95rem", marginBottom: "1.65rem", flexWrap: "wrap" }}>
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
                      border: "1px solid #d5dce8",
                      backgroundColor: active ? HERO_BLUE : "#eceff3",
                      color: active ? "white" : "#7f8a9c",
                      borderRadius: "10px",
                      minWidth: "104px",
                      height: "48px",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
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
            padding: "5rem 1rem 5.6rem",
            background:
              "radial-gradient(circle at 18% 38%, rgba(84,107,205,0.22) 0 18%, transparent 18%), radial-gradient(circle at 74% 52%, rgba(56,80,178,0.24) 0 19%, transparent 19%), linear-gradient(135deg, #33479a 0%, #364a9f 45%, #304493 100%)",
            color: "white",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4.3vw, 3.1rem)", marginBottom: "0.9rem", fontWeight: 500, letterSpacing: "-0.01em" }}>
              {t.finalTitle}
            </h2>
            <p style={{ margin: "0 auto 1.8rem", color: "rgba(245,248,255,0.95)", maxWidth: "720px", lineHeight: 1.45, fontSize: "clamp(1.06rem, 1.6vw, 1.38rem)", whiteSpace: "pre-line" }}>
              {t.finalDesc}
            </p>

            <div style={{ margin: "0 auto", maxWidth: "710px", display: "grid", gridTemplateColumns: "1.45fr 0.9fr", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 24px rgba(16,30,76,0.28)" }}>
              <div style={{ background: "#ffffff", color: "#98A0A8", display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.05rem 1.2rem", fontSize: "1.1rem", textAlign: "left" }}>
                <Mail style={{ width: 27, height: 27, color: "#a6adb6", flexShrink: 0 }} />
                <input
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleScheduleDemo()
                  }}
                  placeholder="Your Email"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    color: "#6b7280",
                    fontSize: "1.1rem",
                    background: "transparent",
                  }}
                  aria-label="Your Email"
                />
              </div>
              <button
                onClick={handleScheduleDemo}
                style={{
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#42d3bb",
                  color: "white",
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  padding: "1rem 1.25rem",
                }}
              >
                {t.finalCta}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
