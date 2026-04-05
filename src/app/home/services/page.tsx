"use client"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Building2, 
  Users2, 
  FileText, 
  CalendarDays, 
  DollarSign, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  Wrench, 
  ShieldCheck, 
  Clock,
  PieChart,
  Smartphone,
  ArrowRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const features = [
  { 
    id: 1,
    icon: Building2, 
    title: "Property and Unit Management", 
    desc: "Smart BMS provides a structured way to manage all units within a building. Administrators can track occupancy status, organize unit-level data, and maintain a clear overview of the building's structure. This ensures that all operational information is centralized and easily accessible.",
    image: "/Multi-Property-Support.png",
    hasDetail: true
  },
  { 
    id: 2,
    icon: FileText, 
    title: "Property Listings", 
    desc: "A built-in listing system that allows building owners to showcase available units. Vacant units can be published with key details such as pricing, features, and specifications, making it easier to present opportunities to potential tenants with structured browsing.",
    image: "/ethiopian-building.jpg"
  },
  { 
    id: 3,
    icon: Users2, 
    title: "Tenant Management", 
    desc: "Comprehensive tenant registration and management. With integration support for identity verification systems such as FAYDA, tenant records are accurate, secure, and well-organized. Each tenant profile includes relevant details and historical data.",
    image: "/Centralized-Dashboard.png"
  },
  { 
    id: 4,
    icon: CalendarDays, 
    title: "Lease Management", 
    desc: "A complete module to create, manage, and monitor lease agreements. Each lease is linked to a specific unit and tenant, tracking the lifecycle from initiation to expiration or termination—ensuring agreements are properly documented.",
    image: "/Digital-Documents.png"
  },
  { 
    id: 5,
    icon: DollarSign, 
    title: "Rent & Payment Management", 
    desc: "Structured rent tracking through invoice generation and payment monitoring. View the status of all tenants, those who have paid, and outstanding balances. Real-time visibility improves financial control.",
    image: "/Centralized-Dashboard.png"
  },
  { 
    id: 6,
    icon: BarChart3, 
    title: "Financial Management", 
    desc: "Unlike basic tools, this incorporates double-entry accounting that automatically records all financial transactions, including rent, expenses, and payouts. Generate professional profit and loss statements and cash flow summaries.",
    image: "/Centralized-Dashboard.png"
  },
  { 
    id: 7,
    icon: MessageSquare, 
    title: "SMS & Communication", 
    desc: "Built-in communication tools enhance interaction between landlords and tenants. Real-time messaging and SMS notifications ensure important updates reach users quickly, including rent reminders and overdue alerts.",
    image: "/In-App-Messaging.png"
  },
  { 
    id: 8,
    icon: CreditCard, 
    title: "Late Fee Control", 
    desc: "Supports structured payment enforcement through automatic late fee calculation and detailed payment history tracking. Ensures consistency in financial operations and encourages timely payments.",
    image: "/Centralized-Dashboard.png"
  },
  { 
    id: 9,
    icon: Wrench, 
    title: "Maintenance Management", 
    desc: "Tenants can submit maintenance requests and complaints directly. Administrators can assign tasks to employees and track progress from submission to completion, improving response time and accountability.",
    image: "/building-image_1.jpg",
    hasDetail: true
  },
  { 
    id: 10,
    icon: ShieldCheck, 
    title: "Document Management", 
    desc: "Generation of professional invoices, storage, and review of tenant documents. Documents like identification, proof of income, and rental records are securely managed, reducing paperwork.",
    image: "/Digital-Documents.png",
    hasDetail: true
  },
  { 
    id: 11,
    icon: Clock, 
    title: "Commercial Operations", 
    desc: "For commercial properties, attendance tracking capabilities using fingerprint-based systems allow administrators to monitor opening times of business units and identify delays or irregularities.",
    image: "/Attendance-Tracking.png",
    hasDetail: true
  },
  { 
    id: 12,
    icon: PieChart, 
    title: "Reporting & Analytics", 
    desc: "Access structured reports and analytics, including monthly income summaries, occupancy trends, and automated financial performance metrics. Enable informed decision-making.",
    image: "/Centralized-Dashboard.png",
    hasDetail: true
  },
  { 
    id: 13,
    icon: Smartphone, 
    title: "Tenant Experience", 
    desc: "A dedicated tenant interface to improve transparency. Tenants can view invoices, track payment history, receive notifications, browse listings, and submit requests, creating a professional interaction.",
    image: "/In-App-Messaging.png",
    hasDetail: true
  }
]

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1
    }

    const callbacks = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"))
          setActiveIndex(index)
        }
      })
    }

    const observer = new IntersectionObserver(callbacks, options)
    const elements = document.querySelectorAll(".feature-item")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div style={{ backgroundColor: BROKEN_WHITE, color: NAVY, minHeight: "100vh" }}>
      <Header currentPage="services" />
      
      <main style={{ padding: "4rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
        
        <header style={{ textAlign: "center", marginBottom: "6rem", marginTop: "2rem" }}>
          <span style={{ 
            fontSize: "0.875rem", 
            fontWeight: 700, 
            letterSpacing: "0.1em", 
            textTransform: "uppercase", 
            backgroundColor: "rgba(31,53,73,0.1)", 
            padding: "0.5rem 1rem", 
            borderRadius: "2rem",
            color: NAVY
          }}>
            Smart BMS Capabilities
          </span>
          <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: NAVY, marginTop: "1.5rem" }}>
            Comprehensive Property Management
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.8, maxWidth: "700px", margin: "1rem auto 0", lineHeight: 1.6 }}>
            A centralized, modern system tailored specifically to the Ethiopian property management environment. Manage buildings, tenants, and finances smarter.
          </p>
        </header>

        <div style={{ display: "flex", position: "relative", gap: "6rem" }}>
          
          {/* Left Column - Scrolling Text */}
          <div style={{ flex: 1, paddingBottom: "30vh", position: "relative" }}>
            {features.map((feat, i) => {
              const isActive = activeIndex === i
              return (
                <div 
                  key={feat.id} 
                  className="feature-item" 
                  data-index={i}
                  style={{ 
                    minHeight: "60vh", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? "scale(1)" : "scale(0.98)"
                  }}
                >
                  <feat.icon size={48} style={{ color: NAVY, marginBottom: "1.5rem" }} strokeWidth={1.5} />
                  <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1.5rem", color: NAVY }}>
                    {feat.title}
                  </h2>
                  <p style={{ fontSize: "1.25rem", lineHeight: 1.8, opacity: 0.85, color: NAVY }}>
                    {feat.desc}
                  </p>
                  {feat.hasDetail && (
                    <Link 
                      href={(() => {
                        const routes: Record<number, string> = {
                          0: "/home/services/property-management",
                          1: "/home/services/tenant-experience",
                          8: "/home/services/maintenance-management",
                          9: "/home/services/document-management",
                          10: "/home/services/commercial-operations",
                          11: "/home/services/reporting-analytics"
                        }
                        return routes[activeIndex] || "/home/services"
                      })()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "1.5rem",
                        padding: "0.875rem 1.5rem",
                        backgroundColor: NAVY,
                        color: "white",
                        fontWeight: 600,
                        textDecoration: "none",
                        borderRadius: "12px",
                        fontSize: "1rem"
                      }}
                    >
                      View Details <ArrowRight size={18} />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right Column - Sticky Visual */}
          <div style={{ 
            flex: 1, 
            position: "sticky", 
            top: "120px", 
            height: "calc(100vh - 160px)", 
            display: "none", 
            alignItems: "center", 
            justifyContent: "center" 
          }} className="lg-flex">
            
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 1024px) {
                .lg-flex { display: flex !important; }
              }
            `}} />

            <div style={{ 
              width: "100%", 
              height: "100%", 
              backgroundColor: NAVY, 
              borderRadius: "24px", 
              position: "relative", 
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(31,53,73,0.25)"
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Image 
                    src={features[activeIndex].image} 
                    alt={features[activeIndex].title}
                    fill
                    style={{ objectFit: "cover", opacity: 0.9 }}
                    priority
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(31,53,73,0.9), rgba(31,53,73,0.3))" }} />
                  
                  <div style={{ position: "absolute", bottom: "3rem", left: "3rem", right: "3rem", color: BROKEN_WHITE }}>
                    <div style={{ fontSize: "4rem", fontWeight: 800, opacity: 0.3, marginBottom: "-1rem" }}>
                      {String(activeIndex + 1).padStart(2, "0")}
                    </div>
                    <h3 style={{ fontSize: "2rem", fontWeight: 600 }}>{features[activeIndex].title}</h3>
                    {features[activeIndex].hasDetail && (
                      <Link 
                        href={(() => {
                          const routes: Record<number, string> = {
                            0: "/home/services/property-management",
                            1: "/home/services/tenant-experience",
                            8: "/home/services/maintenance-management",
                            9: "/home/services/document-management",
                            10: "/home/services/commercial-operations",
                            11: "/home/services/reporting-analytics"
                          }
                          return routes[activeIndex] || "/home/services"
                        })()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "1rem",
                          padding: "0.75rem 1.25rem",
                          backgroundColor: "white",
                          color: NAVY,
                          fontWeight: 600,
                          textDecoration: "none",
                          borderRadius: "10px",
                          fontSize: "0.875rem"
                        }}
                      >
                        View Details <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
