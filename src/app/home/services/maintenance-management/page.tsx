"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  Wrench, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Clock,
  Users,
  Home,
  MessageSquare,
  Calendar,
  Shield,
  ArrowRight,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const features = [
  {
    icon: AlertCircle,
    title: "Easy Request Submission",
    desc: "Tenants can submit maintenance requests in seconds with photos and detailed descriptions. No more phone calls or paper forms.",
    details: ["Photo attachments", "Category selection", "Priority marking"]
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Automatically assign requests to available maintenance staff based on expertise and location. Optimize routes and minimize travel time.",
    details: ["Auto-assignment", "Calendar integration", "Route optimization"]
  },
  {
    icon: MessageSquare,
    title: "Real-Time Communication",
    desc: "Keep everyone informed with built-in messaging. Tenants can ask questions, staff can provide updates, and managers can oversee all communications.",
    details: ["Status updates", "Photo sharing", "Resolution notes"]
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    desc: "Track the complete lifecycle of every request. Verify completed work, gather tenant feedback, and maintain detailed service history.",
    details: ["Completion verification", "Tenant approval", "Warranty tracking"]
  }
]

const categories = [
  { name: "Plumbing", color: "#3b82f6", icon: Wrench },
  { name: "Electrical", color: "#f59e0b", icon: AlertCircle },
  { name: "HVAC", color: "#10b981", icon: Clock },
  { name: "Structural", color: "#8b5cf6", icon: Home },
  { name: "Appliances", color: "#ec4899", icon: Wrench },
  { name: "General", color: "#6b7280", icon: FileText },
]

const benefits = [
  "Faster response times to maintenance issues",
  "Complete transparency for tenants on request status",
  "Better tracking of maintenance costs and patterns",
  "Reduced tenant complaints and frustration",
  "Improved property value through timely maintenance",
  "Detailed records for warranty claims",
  "Accountability for maintenance staff",
  "Data-driven preventive maintenance scheduling"
]

const workflow = [
  { step: 1, title: "Request", desc: "Tenant submits request with details and photos" },
  { step: 2, title: "Review", desc: "Manager reviews and prioritizes the request" },
  { step: 3, title: "Assign", desc: "Request assigned to appropriate staff member" },
  { step: 4, title: "Complete", desc: "Work performed and verified by tenant" },
]

export default function MaintenanceManagementDetail() {
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
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Maintenance Management</span>
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
                <Wrench size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Property Maintenance
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Maintenance Management
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              Streamline maintenance operations from request to resolution. Keep tenants happy with quick responses and transparent communication throughout the process.
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
                <Wrench size={40} color="white" />
              </div>
              <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                From Request to Resolution
              </h2>
              <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto" }}>
                Our complete maintenance management system ensures every issue gets handled quickly and professionally.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", textAlign: "center" }}>
              Complete Maintenance Solution
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              Everything you need to manage property maintenance efficiently
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
              Maintenance Workflow
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {workflow.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(31,53,73,0.08)",
                    position: "relative"
                  }}
                >
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    backgroundColor: NAVY,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "1.25rem",
                    fontWeight: 700
                  }}>
                    {item.step}
                  </div>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: NAVY, marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ color: `${NAVY}77`, fontSize: "0.875rem", lineHeight: 1.5 }}>{item.desc}</p>
                  {i < workflow.length - 1 && (
                    <ArrowRight size={20} color={NAVY} style={{ position: "absolute", right: "-12px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, marginBottom: "2rem", textAlign: "center" }}>
              Request Categories
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 20px rgba(31,53,73,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                >
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    backgroundColor: `${cat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <cat.icon size={24} color={cat.color} />
                  </div>
                  <span style={{ fontSize: "1.125rem", fontWeight: 600, color: NAVY }}>{cat.name}</span>
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
                  Happy Tenants, Better Retention
                </h3>
                <p style={{ fontSize: "1.1rem", color: `${NAVY}88`, lineHeight: 1.7, marginBottom: "2rem" }}>
                  When maintenance issues are handled quickly and professionally, tenants feel valued and respected. This leads to longer lease renewals and positive word-of-mouth referrals.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Real-time status updates for tenants",
                    "Quick and easy request submission",
                    "Professional service from qualified staff",
                    "Follow-up surveys to ensure satisfaction"
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
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "10px", 
                      backgroundColor: "#10b98115",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <CheckCircle2 size={20} color="#10b981" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: NAVY, fontSize: "0.875rem" }}>Request Completed</p>
                      <p style={{ color: `${NAVY}77`, fontSize: "0.75rem" }}>Plumbing - Bathroom Leak</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: `${NAVY}05`, borderRadius: "8px", marginBottom: "1rem" }}>
                    <span style={{ color: `${NAVY}77`, fontSize: "0.875rem" }}>Submitted</span>
                    <span style={{ color: NAVY, fontSize: "0.875rem", fontWeight: 500 }}>Mar 15, 2026</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: `${NAVY}05`, borderRadius: "8px", marginBottom: "1rem" }}>
                    <span style={{ color: `${NAVY}77`, fontSize: "0.875rem" }}>Assigned</span>
                    <span style={{ color: NAVY, fontSize: "0.875rem", fontWeight: 500 }}>Mar 15, 2026</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#10b98115", borderRadius: "8px" }}>
                    <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 500 }}>Completed</span>
                    <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 500 }}>Mar 16, 2026</span>
                  </div>
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
              Benefits for Property Managers
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
                { icon: Clock, title: "Faster Response", desc: "Handle requests in hours, not days" },
                { icon: MessageSquare, title: "Better Communication", desc: "Keep everyone informed at all times" },
                { icon: Users, title: "Accountability", desc: "Track who does what and when" },
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
            Transform Your Maintenance Operations
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Keep your properties in top condition with efficient, transparent maintenance management
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
              See Demo
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
