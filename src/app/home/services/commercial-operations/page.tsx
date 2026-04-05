"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  Clock, 
  CheckCircle2, 
  Building2,
  Fingerprint,
  Users,
  AlertTriangle,
  Calendar,
  Shield,
  Bell,
  BarChart3,
  MapPin,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const features = [
  {
    icon: Fingerprint,
    title: "Biometric Attendance",
    desc: "Advanced fingerprint and facial recognition systems for accurate employee time tracking. Eliminate buddy punching and ensure fair payroll calculations.",
    details: ["99.9% accuracy rate", "Anti-spoofing technology", "Multi-modal verification"]
  },
  {
    icon: Clock,
    title: "Shift Management",
    desc: "Comprehensive scheduling tools for security guards, cleaning staff, and maintenance workers. Ensure proper coverage across all operating hours.",
    details: ["Automated scheduling", "Shift swap requests", "Coverage alerts"]
  },
  {
    icon: AlertTriangle,
    title: "Irregularity Detection",
    desc: "AI-powered system identifies unusual patterns like late arrivals, early departures, and missed shifts. Get instant notifications for compliance issues.",
    details: ["Pattern analysis", "Custom threshold alerts", "Detailed incident reports"]
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track employee productivity and punctuality with detailed reports. Identify top performers and address training needs proactively.",
    details: ["Productivity scores", "Attendance trends", "Comparative analysis"]
  }
]

const benefits = [
  "Ensure compliance with opening and closing hours",
  "Reduce payroll errors with accurate time data",
  "Improve security with verified staff presence",
  "Track employee punctuality and attendance patterns",
  "Generate payroll-ready timesheets automatically",
  "Maintain audit trail for labor law compliance",
  "Reduce disputes with transparent time records",
  "Enhance overall operational efficiency"
]

const useCases = [
  {
    icon: Building2,
    title: "Retail Shopping Centers",
    desc: "Monitor opening times for all shop units. Track security guard shifts and cleaning schedules. Get alerts for late openings that affect foot traffic."
  },
  {
    icon: MapPin,
    title: "Office Buildings",
    desc: "Ensure proper coverage during business hours. Track cleaning and maintenance staff. Monitor access control compliance across tenants."
  },
  {
    icon: Users,
    title: "Mixed-Use Properties",
    desc: "Manage diverse schedules for residential and commercial sections. Handle different operating hours and shift requirements seamlessly."
  }
]

export default function CommercialOperationsDetail() {
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
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Commercial Operations</span>
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
                <Clock size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Commercial Property Tools
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Commercial Operations
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              Advanced attendance tracking and operational tools designed for commercial properties. Monitor opening times, track employee presence, and ensure smooth business operations.
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
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                borderRadius: "20px", 
                backgroundColor: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem"
              }}>
                <Fingerprint size={40} color="white" />
              </div>
              <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                Professional Attendance<br />Tracking System
              </h2>
              <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto" }}>
                Using cutting-edge biometric technology, we help commercial properties maintain accountability and operational excellence.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", textAlign: "center" }}>
              Complete Operational Suite
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              Everything you need to manage commercial property operations effectively
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
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
                      <feature.icon size={28} color={NAVY} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: "0.5rem" }}>{feature.title}</h3>
                      <p style={{ color: `${NAVY}88`, lineHeight: 1.6 }}>{feature.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {feature.details.map((detail) => (
                      <span key={detail} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: `${NAVY}08`,
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        color: NAVY,
                        fontWeight: 500
                      }}>
                        <CheckCircle2 size={14} />
                        {detail}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, marginBottom: "2rem", textAlign: "center" }}>
              Built for Commercial Properties
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {useCases.map((useCase, i) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 4px 20px rgba(31,53,73,0.08)",
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
                    <useCase.icon size={28} color={NAVY} />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY, marginBottom: "0.75rem" }}>{useCase.title}</h3>
                  <p style={{ color: `${NAVY}88`, lineHeight: 1.6, fontSize: "0.95rem" }}>{useCase.desc}</p>
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
                  Real-Time Monitoring
                </h3>
                <p style={{ fontSize: "1.1rem", color: `${NAVY}88`, lineHeight: 1.7, marginBottom: "2rem" }}>
                  Know exactly what's happening in your commercial property at any moment. Our real-time dashboard shows current attendance, upcoming shifts, and any irregularities that need attention.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Live attendance dashboard for all employees",
                    "Instant alerts for schedule deviations",
                    "GPS-verified check-in and check-out",
                    "Mobile app for on-the-go monitoring"
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
                padding: "2rem"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { name: "Security Guards", present: 24, total: 26, status: "On Duty" },
                    { name: "Cleaning Staff", present: 12, total: 15, status: "On Duty" },
                    { name: "Maintenance", present: 8, total: 10, status: "On Duty" },
                    { name: "Front Desk", present: 6, total: 6, status: "Complete" },
                  ].map((item) => (
                    <div key={item.name} style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 600, color: NAVY }}>{item.name}</span>
                        <span style={{ 
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#22c55e",
                          backgroundColor: "#22c55e15",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px"
                        }}>
                          {item.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ flex: 1, height: "6px", backgroundColor: `${NAVY}15`, borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ 
                            width: `${(item.present / item.total) * 100}%`, 
                            height: "100%", 
                            backgroundColor: NAVY, 
                            borderRadius: "3px" 
                          }} />
                        </div>
                        <span style={{ fontSize: "0.875rem", color: `${NAVY}77`, fontWeight: 500 }}>
                          {item.present}/{item.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
              Key Benefits for Property Managers
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

          <div style={{ 
            backgroundColor: NAVY, 
            borderRadius: "24px", 
            padding: "3rem",
            boxShadow: "0 4px 24px rgba(31,53,73,0.15)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              {[
                { icon: Shield, title: "Enhanced Security", desc: "Verify staff identity with biometrics" },
                { icon: Bell, title: "Instant Alerts", desc: "Get notified of irregularities immediately" },
                { icon: Calendar, title: "Easy Scheduling", desc: "Manage shifts with intuitive tools" },
              ].map((item) => (
                <div key={item.title} style={{ textAlign: "center" }}>
                  <div style={{ 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "16px", 
                    backgroundColor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem"
                  }}>
                    <item.icon size={28} color="white" />
                  </div>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{item.desc}</p>
                </div>
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
            Optimize Your Commercial Operations
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Get started with our comprehensive commercial operations tools today
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
              Contact Sales
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
