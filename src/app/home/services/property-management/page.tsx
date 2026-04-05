"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  Building2, 
  CheckCircle2, 
  Home,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const benefits = [
  "Track occupancy status in real-time",
  "Organize unit-level data efficiently",
  "Centralize all operational information",
  "Maintain clear building overview",
  "Easy access to property details",
  "Streamlined administrative tasks"
]

const unitTypes = [
  { type: "Studio", units: 12, occupied: 10, rent: "8,500" },
  { type: "1 Bedroom", units: 24, occupied: 22, rent: "15,000" },
  { type: "2 Bedroom", units: 18, occupied: 16, rent: "22,000" },
  { type: "3 Bedroom", units: 8, occupied: 6, rent: "35,000" },
]

export default function PropertyManagementDetail() {
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
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Property & Unit Management</span>
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
                <Building2 size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Core Capability
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Property and Unit Management
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              Smart BMS provides a structured way to manage all units within a building. Track occupancy status, organize unit-level data, and maintain a clear overview of the building structure.
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
              <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                Manage All Your Units<br />In One Place
              </h2>
              <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px" }}>
                From studio apartments to commercial spaces, Smart BMS gives you complete control over your property portfolio.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
            {benefits.slice(0, 3).map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 20px rgba(31,53,73,0.08)"
                }}
              >
                <CheckCircle2 size={32} color={NAVY} style={{ marginBottom: "1rem" }} />
                <p style={{ fontWeight: 500, color: NAVY }}>{benefit}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {unitTypes.map((unit, i) => (
              <motion.div
                key={unit.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(31,53,73,0.08)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY }}>{unit.type}</h3>
                    <p style={{ fontSize: "0.875rem", color: `${NAVY}77` }}>{unit.occupied}/{unit.units} occupied</p>
                  </div>
                  <Home size={24} color={NAVY} />
                </div>
                <div style={{ 
                  padding: "1rem", 
                  backgroundColor: `${NAVY}08`, 
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, color: NAVY }}>{unit.rent}</span>
                  <span style={{ color: `${NAVY}77` }}>ETB/mo</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "24px", 
            padding: "3rem",
            marginTop: "3rem",
            boxShadow: "0 4px 20px rgba(31,53,73,0.08)"
          }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, color: NAVY, marginBottom: "2rem" }}>Why Property Management Matters</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {benefits.slice(3).map((benefit) => (
                <div key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <CheckCircle2 size={20} color={NAVY} style={{ flexShrink: 0, marginTop: "0.25rem" }} />
                  <p style={{ color: `${NAVY}99` }}>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "white", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "1rem", textAlign: "center" }}>
              Key Benefits
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
              Everything you need to efficiently manage your property portfolio
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "1.5rem",
                    borderRadius: "12px",
                    backgroundColor: BROKEN_WHITE,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem"
                  }}
                >
                  <CheckCircle2 size={24} color={NAVY} style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 500, color: NAVY }}>{benefit}</span>
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
            Ready to Streamline Your Property Management?
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Start using Smart BMS today and take control of your property portfolio
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
              Get Started Free
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
