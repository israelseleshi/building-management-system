"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  PieChart, 
  CheckCircle2, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const reportTypes = [
  {
    icon: DollarSign,
    title: "Financial Reports",
    desc: "Comprehensive profit and loss statements, cash flow analysis, and revenue breakdowns by property, unit type, or time period.",
    features: ["Income statements", "Expense tracking", "Cash flow reports", "Tax preparation support"]
  },
  {
    icon: Building2,
    title: "Occupancy Reports",
    desc: "Track occupancy rates across your entire portfolio. Identify trends, vacancy periods, and opportunities for optimization.",
    features: ["Vacancy rates by property", "Lease expiration alerts", "Turnover analysis", "Historical comparisons"]
  },
  {
    icon: Users,
    title: "Tenant Analytics",
    desc: "Deep insights into tenant behavior, payment patterns, and lease performance to improve your tenant retention strategies.",
    features: ["Payment history analysis", "Tenant scoring", "Retention metrics", "Demographic insights"]
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    desc: "Compare your performance against market averages. Understand rental trends and pricing opportunities in your area.",
    features: ["Market comparisons", "Pricing optimization", "Demand indicators", "Competitive analysis"]
  }
]

const benefits = [
  "Real-time data updates across all properties",
  "Customizable dashboards for your needs",
  "Export reports in multiple formats",
  "Automated scheduled reports via email",
  "Visual charts and graphs for easy understanding",
  "Compare performance across multiple properties",
  "Identify trends before they become issues",
  "Make data-driven decisions with confidence"
]

const kpis = [
  { label: "Monthly Revenue", value: "Track", trend: "+12%", positive: true },
  { label: "Occupancy Rate", value: "Monitor", trend: "94%", positive: true },
  { label: "Avg. Days to Fill", value: "Measure", trend: "-3 days", positive: true },
  { label: "Collection Rate", value: "Optimize", trend: "98.5%", positive: true },
]

export default function ReportingAnalyticsDetail() {
  return (
    <div style={{ backgroundColor: BROKEN_WHITE, color: NAVY, minHeight: "100vh" }}>
      <Header currentPage="services" />
      
      <main>
        <section style={{ 
          backgroundColor: NAVY, 
          padding: "6rem 2rem 4rem",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ 
            position: "absolute", 
            top: "-100px", 
            right: "-100px", 
            width: "400px", 
            height: "400px", 
            backgroundColor: "rgba(255,255,255,0.03)", 
            borderRadius: "50%" 
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-150px", 
            left: "-150px", 
            width: "500px", 
            height: "500px", 
            backgroundColor: "rgba(255,255,255,0.02)", 
            borderRadius: "50%" 
          }} />
          
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontSize: "0.875rem" }}>
              <a href="/home/services" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Services <ChevronRight size={16} />
              </a>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Reporting & Analytics</span>
            </nav>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ 
                width: "72px", 
                height: "72px", 
                borderRadius: "18px", 
                backgroundColor: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <PieChart size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Data-Driven Insights
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Reporting & Analytics
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              Transform your property data into actionable insights. Comprehensive reports and analytics help you make informed decisions and maximize your investment returns.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ 
            backgroundColor: NAVY, 
            borderRadius: "24px", 
            padding: "4rem",
            marginBottom: "3rem",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "400px", height: "400px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Target size={28} color="white" />
                <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Key Performance Indicators</span>
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                Monitor What Matters Most
              </h2>
              <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px", marginBottom: "2rem" }}>
                Track essential metrics that drive your property management success. Get real-time visibility into your portfolio performance.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                {kpis.map((kpi) => (
                  <div key={kpi.label} style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "1.5rem"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>{kpi.label}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "white" }}>{kpi.value}</span>
                      <span style={{ 
                        fontSize: "0.875rem", 
                        fontWeight: 600,
                        color: kpi.positive ? "#4ade80" : "#f87171",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}>
                        {kpi.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", textAlign: "center" }}>
              Comprehensive Reporting Suite
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              From financial summaries to detailed operational insights, we have everything you need to understand your portfolio
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
              {reportTypes.map((report, i) => (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "2rem",
                    boxShadow: "0 4px 24px rgba(31,53,73,0.08)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ 
                      width: "56px", 
                      height: "56px", 
                      borderRadius: "14px", 
                      backgroundColor: `${NAVY}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <report.icon size={28} color={NAVY} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: "0.5rem" }}>{report.title}</h3>
                      <p style={{ color: `${NAVY}88`, lineHeight: 1.6 }}>{report.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {report.features.map((feature) => (
                      <span key={feature} style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: `${NAVY}08`,
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        color: NAVY,
                        fontWeight: 500
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "24px", 
            padding: "3rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 24px rgba(31,53,73,0.08)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, color: NAVY, marginBottom: "1.5rem" }}>
                  Beautiful Visualizations
                </h3>
                <p style={{ fontSize: "1.1rem", color: `${NAVY}88`, lineHeight: 1.7, marginBottom: "2rem" }}>
                  Complex data made simple. Our interactive charts and graphs help you understand your portfolio at a glance. Drill down into details when you need them.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Interactive dashboards with real-time updates",
                    "Export to PDF, Excel, or CSV formats",
                    "Scheduled reports delivered to your email",
                    "Custom date ranges and comparisons"
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle2 size={20} color={NAVY} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ color: NAVY }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ 
                backgroundColor: `${NAVY}05`, 
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
              }}>
                {[
                  { label: "Revenue This Month", value: "2.4M ETB", change: "+8%" },
                  { label: "Expenses This Month", value: "890K ETB", change: "-3%" },
                  { label: "Net Income", value: "1.5M ETB", change: "+12%" },
                  { label: "Outstanding Payments", value: "125K ETB", change: "-15%" },
                ].map((item) => (
                  <div key={item.label} style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: `${NAVY}77` }}>{item.label}</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY }}>{item.value}</p>
                    </div>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 600,
                      color: item.change.startsWith("+") ? "#22c55e" : "#ef4444",
                      backgroundColor: item.change.startsWith("+") ? "#22c55e15" : "#ef444415",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "6px"
                    }}>
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "24px", 
            padding: "3rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 24px rgba(31,53,73,0.08)"
          }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, color: NAVY, marginBottom: "2rem", textAlign: "center" }}>
              Why Reporting & Analytics Matter
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {benefits.map((benefit) => (
                <div key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <CheckCircle2 size={24} color={NAVY} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <p style={{ color: `${NAVY}99`, lineHeight: 1.6 }}>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "white", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "1rem", textAlign: "center" }}>
              Make Data-Driven Decisions
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              Don't guess. Know. Our reporting tools give you the confidence to make smart property management decisions.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {[
                { title: "Save Time", desc: "Automated reports save hours of manual work every month", icon: Calendar },
                { title: "Stay Informed", desc: "Real-time dashboards keep you updated on portfolio health", icon: BarChart3 },
                { title: "Grow Smarter", desc: "Use insights to identify opportunities and optimize performance", icon: TrendingUp },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "2rem",
                    borderRadius: "16px",
                    backgroundColor: BROKEN_WHITE,
                    textAlign: "center"
                  }}
                >
                  <div style={{ 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "16px", 
                    backgroundColor: `${NAVY}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem"
                  }}>
                    <item.icon size={28} color={NAVY} />
                  </div>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY, marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ color: `${NAVY}77`, fontSize: "0.95rem" }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ 
          backgroundColor: NAVY, 
          padding: "4rem 2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
            Ready to Unlock Your Data?
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Get comprehensive reporting and analytics for your entire property portfolio
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={{
              padding: "1rem 2rem",
              backgroundColor: "white",
              color: NAVY,
              borderRadius: "12px",
              border: "none",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer"
            }}>
              Start Free Trial
            </button>
            <button style={{
              padding: "1rem 2rem",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.3)",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer"
            }}>
              Schedule Demo
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
