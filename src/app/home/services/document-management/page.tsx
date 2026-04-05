"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Upload,
  Download,
  Search,
  Lock,
  Folder,
  File,
  Share2,
  Clock,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    desc: "Upload documents instantly from your computer or mobile device. Support for all major file formats including PDF, images, and scanned documents.",
    details: ["Drag and drop support", "Bulk upload capability", "Auto-format detection"]
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Find any document in seconds with our powerful search functionality. Search by name, date, type, or even content within documents.",
    details: ["Full-text search", "Filter by type and date", "Recent files quick access"]
  },
  {
    icon: Lock,
    title: "Secure Storage",
    desc: "Bank-level encryption keeps your sensitive documents safe. Role-based access ensures only authorized people can view confidential files.",
    details: ["AES-256 encryption", "Access controls", "Audit trail logging"]
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    desc: "Share documents with tenants, contractors, or other stakeholders securely. Generate temporary links or set permanent access permissions.",
    details: ["Secure sharing links", "Permission management", "Share via email"]
  }
]

const documentTypes = [
  { type: "Lease Agreements", count: "All lease contracts", icon: FileText },
  { type: "Tenant Documents", count: "ID, contracts, records", icon: File },
  { type: "Financial Records", count: "Invoices, receipts, reports", icon: Folder },
  { type: "Property Documents", count: "Titles, permits, insurance", icon: ShieldCheck },
  { type: "Maintenance Records", count: "Work orders, warranties", icon: FileText },
  { type: "Communications", count: "Notices, letters, emails", icon: File },
]

const benefits = [
  "Never lose an important document again",
  "Access files from anywhere, anytime",
  "Reduce physical storage requirements",
  "Share documents securely with one click",
  "Maintain compliance with organized records",
  "Quickly respond to audits and inquiries",
  "Automatic backup ensures data safety",
  "Save time on document retrieval"
]

export default function DocumentManagementDetail() {
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
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Document Management</span>
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
                <ShieldCheck size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Paperless Management
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Document Management
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              Go completely paperless with our comprehensive document management system. Store, organize, and share all your property documents securely in the cloud.
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
                <Folder size={40} color="white" />
              </div>
              <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                All Your Documents,<br />One Secure Location
              </h2>
              <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto" }}>
                From lease agreements to maintenance records, keep everything organized, accessible, and secure.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", textAlign: "center" }}>
              Powerful Document Tools
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              Everything you need to manage your property documents efficiently
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
              Document Types We Handle
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {documentTypes.map((doc, i) => (
                <motion.div
                  key={doc.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 20px rgba(31,53,73,0.08)",
                    textAlign: "center"
                  }}
                >
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "14px", 
                    backgroundColor: `${NAVY}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem"
                  }}>
                    <doc.icon size={24} color={NAVY} />
                  </div>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: NAVY, marginBottom: "0.25rem" }}>{doc.type}</h4>
                  <p style={{ color: `${NAVY}77`, fontSize: "0.875rem" }}>{doc.count}</p>
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
                  Professional Invoice Generation
                </h3>
                <p style={{ fontSize: "1.1rem", color: `${NAVY}88`, lineHeight: 1.7, marginBottom: "2rem" }}>
                  Create and send professional invoices with just a few clicks. Our templates are designed to look professional and include all the necessary details for your tenants.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Customizable invoice templates",
                    "Automatic rent calculations",
                    "Send invoices via email",
                    "Track payment status automatically"
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
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(31,53,73,0.1)" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "10px", 
                      backgroundColor: NAVY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FileText size={20} color="white" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: NAVY, fontSize: "0.875rem" }}>Invoice</p>
                      <p style={{ color: `${NAVY}77`, fontSize: "0.75rem" }}>Monthly Rent</p>
                    </div>
                  </div>
                  {[
                    { label: "Property", value: "Bole Building A" },
                    { label: "Unit", value: "Unit 205" },
                    { label: "Period", value: "April 2026" },
                    { label: "Amount", value: "15,000 ETB" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ color: `${NAVY}77`, fontSize: "0.875rem" }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: NAVY, fontSize: "0.875rem" }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid rgba(31,53,73,0.1)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, color: NAVY }}>Total</span>
                    <span style={{ fontWeight: 700, color: NAVY, fontSize: "1.25rem" }}>15,000 ETB</span>
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
              Why Go Paperless?
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
                { icon: Lock, title: "Bank-Level Security", desc: "Your documents are encrypted and protected" },
                { icon: Clock, title: "24/7 Access", desc: "Access files anytime from any device" },
                { icon: Download, title: "Always Available", desc: "Never lose a document again" },
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
            Start Managing Documents Digitally
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Eliminate paperwork and organize all your property documents in one secure place
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
              Learn More
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
