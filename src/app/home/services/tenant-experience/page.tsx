"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { 
  Smartphone, 
  CheckCircle2, 
  Home,
  FileText,
  MessageSquare,
  Bell,
  Wrench,
  CreditCard,
  Eye,
  Calendar,
  User,
  ChevronRight
} from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const features = [
  {
    icon: FileText,
    title: "Invoice Management",
    desc: "View and download professional invoices anytime. Track all your payment history with detailed breakdowns of rent, utilities, and other charges."
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    desc: "Monitor your payment history with real-time updates. Know exactly what's paid, what's pending, and upcoming due dates."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Receive instant alerts for payment reminders, maintenance updates, lease renewals, and important announcements from management."
  },
  {
    icon: Home,
    title: "Browse Listings",
    desc: "Explore available units that match your preferences. View detailed information, photos, and pricing to find your next home."
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    desc: "Submit and track maintenance requests easily. Get status updates and communicate directly with the maintenance team."
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    desc: "Connect with property management seamlessly. Get responses faster through the built-in messaging system."
  }
]

const benefits = [
  "Access your dashboard from any device",
  "Real-time updates on your account status",
  "Secure and private tenant portal",
  "Easy-to-use interface for all ages",
  "Transparent communication with management",
  "24/7 access to your information"
]

export default function TenantExperienceDetail() {
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
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Tenant Experience</span>
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
                <Smartphone size={36} color="white" />
              </div>
              <span style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Enhanced Tenant Portal
              </span>
            </div>
            
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Tenant Experience
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", lineHeight: 1.6 }}>
              A dedicated tenant portal designed to improve transparency and convenience. Manage everything related to your rental from one place.
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
            overflow: "hidden",
            textAlign: "center"
          }}>
            <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "400px", height: "400px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
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
                <User size={40} color="white" />
              </div>
              <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
                Your Home,<br />Your Dashboard
              </h2>
              <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto" }}>
                Everything you need as a tenant, all in one place. Stay informed, make payments, and communicate with ease.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", textAlign: "center" }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              A comprehensive tenant portal that puts you in control of your rental experience
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
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
                    <feature.icon size={28} color={NAVY} />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY, marginBottom: "0.75rem" }}>{feature.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: `${NAVY}88`, lineHeight: 1.6 }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "24px", 
            padding: "3rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 20px rgba(31,53,73,0.08)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, color: NAVY, marginBottom: "1.5rem" }}>
                  Designed for<br />Your Convenience
                </h3>
                <p style={{ fontSize: "1.1rem", color: `${NAVY}88`, lineHeight: 1.7, marginBottom: "2rem" }}>
                  Our tenant portal is built with you in mind. Whether you're checking your balance on your phone or downloading invoices on your computer, the experience is seamless and intuitive.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {benefits.slice(0, 3).map((benefit) => (
                    <div key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle2 size={20} color={NAVY} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ color: NAVY }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ 
                backgroundColor: `${NAVY}08`, 
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
              }}>
                {[
                  { icon: Eye, label: "View invoices anytime" },
                  { icon: Bell, label: "Get instant notifications" },
                  { icon: Calendar, label: "Track payment schedule" },
                  { icon: MessageSquare, label: "Message management" },
                  { icon: Home, label: "Browse available units" },
                  { icon: Wrench, label: "Submit maintenance requests" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "44px", 
                      height: "44px", 
                      borderRadius: "12px", 
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(31,53,73,0.08)"
                    }}>
                      <item.icon size={20} color={NAVY} />
                    </div>
                    <span style={{ fontWeight: 500, color: NAVY }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "24px", 
            padding: "3rem",
            boxShadow: "0 4px 20px rgba(31,53,73,0.08)"
          }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, color: NAVY, marginBottom: "2rem", textAlign: "center" }}>
              Why Tenants Love This Portal
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
              Transparent & User-Friendly
            </h2>
            <p style={{ fontSize: "1.125rem", color: `${NAVY}77`, textAlign: "center", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto" }}>
              No hidden fees, no confusion. Everything is clear and accessible when you need it
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {[
                { title: "Clear Invoices", desc: "Detailed breakdowns of all charges" },
                { title: "Easy Payments", desc: "Multiple payment options available" },
                { title: "Quick Support", desc: "Direct line to property management" },
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
                  <CheckCircle2 size={32} color={NAVY} style={{ marginBottom: "1rem" }} />
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, color: NAVY, marginBottom: "0.5rem" }}>{item.title}</h4>
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
            Experience the Difference
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Join thousands of satisfied tenants who manage their rental with ease
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
              Get Started
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
