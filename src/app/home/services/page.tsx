"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { Heading, Text } from "@/components/ui/typography"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Users2, 
  FileText,
  DollarSign,
  MessageSquare,
  Wrench,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Clock,
  CheckCircle,
  ArrowRight,
  CalendarDays
} from "lucide-react"

const NAVY = "#1F3549"
const NAVY_DARK = "#152A3D"

const features = [
  {
    icon: Building2,
    title: "Property Management",
    tags: ["Units", "Buildings"]
  },
  {
    icon: FileText,
    title: "Listings",
    tags: ["Vacancies", "Search"]
  },
  {
    icon: Users2,
    title: "Tenant Management",
    tags: ["FAYDA", "Records"]
  },
  {
    icon: CalendarDays,
    title: "Lease Management",
    tags: ["Lifecycle", "Terms"]
  },
  {
    icon: DollarSign,
    title: "Payment Tracking",
    tags: ["Invoices", "Rent"]
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    tags: ["Accounting", "Audit"]
  },
  {
    icon: MessageSquare,
    title: "SMS & Messaging",
    tags: ["Notifications", "Alerts"]
  },
  {
    icon: CreditCard,
    title: "Late Fee Control",
    tags: ["Automation", "Compliance"]
  },
  {
    icon: Wrench,
    title: "Maintenance",
    tags: ["Requests", "Tasks"]
  },
  {
    icon: ShieldCheck,
    title: "Document Management",
    tags: ["Storage", "Invoices"]
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    tags: ["Fingerprint", "Commercial"]
  }
]

function AnimatedOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div 
        style={{ 
          position: 'absolute', 
          width: '600px', 
          height: '600px', 
          borderRadius: '50%', 
          opacity: 0.03,
          backgroundColor: NAVY, 
          top: '-20%', 
          right: '-10%' 
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        style={{ 
          position: 'absolute', 
          width: '400px', 
          height: '400px', 
          borderRadius: '50%', 
          opacity: 0.04,
          backgroundColor: NAVY, 
          bottom: '10%', 
          left: '5%' 
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

export default function ServicesPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', color: '#1f2937' }}>

      <Header currentPage="services" />

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(5rem, 12vw, 8rem) 1rem 4rem',
        overflow: 'hidden',
        backgroundColor: NAVY,
      }}>
        <AnimatedOrbs />
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, ${NAVY_DARK} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${NAVY_DARK} 0%, transparent 50%)
          `,
          opacity: 0.5
        }} />
        
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              borderRadius: '0 0 1rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '1.5rem'
            }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.8)'
              }}>
                Smart BMS Features
              </span>
            </div>
            
            <Heading level={1} style={{ 
              fontSize: 'clamp(2rem, 6vw, 4rem)', 
              fontWeight: 800, 
              marginBottom: '1.5rem', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              Everything You Need to <br/>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Manage Properties</span> <br/>
              Like a Pro
            </Heading>
            
            <Text size="lg" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              maxWidth: '700px', 
              margin: '0 auto 2rem',
              lineHeight: 1.75,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)'
            }}>
              A comprehensive platform designed specifically for Ethiopian property management. 
              Replace manual processes with structured digital workflows.
            </Text>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                onClick={() => window.location.href = '/auth/signup'}
                style={{
                  backgroundColor: 'white',
                  color: NAVY,
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Get Started Free
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/home/contact'}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                }}
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: 'clamp(4rem, 10vw, 6rem) 1rem',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 4rem)' }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: NAVY_DARK, 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Complete <span style={{ color: NAVY }}>Property Management</span> Suite
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.75
            }}>
              From tenant management to financial reporting, Smart BMS covers every aspect of building operations
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: 'clamp(2rem, 5vw, 4rem)'
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  border: `1px solid #e5e5e3`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                  cursor: 'default'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '1rem',
                  backgroundColor: NAVY,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: `0 8px 20px ${NAVY}30`
                }}>
                  <feature.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                
                <h3 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: NAVY_DARK,
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {feature.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: `${NAVY}08`,
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      color: NAVY,
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section style={{ 
        padding: 'clamp(4rem, 10vw, 6rem) 1rem',
        backgroundColor: NAVY
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ order: 2 }}
            >
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '0 0 1rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                marginBottom: '1.5rem'
              }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  Why Smart BMS
                </span>
              </div>
              
              <h2 style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                fontWeight: 800, 
                color: 'white', 
                marginBottom: '1.5rem',
                lineHeight: 1.2
              }}>
                Built for the <span style={{ opacity: 0.6 }}>Ethiopian Market</span>
              </h2>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: 1.75,
                marginBottom: '2rem',
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)'
              }}>
                Smart BMS was created to address the challenges of Ethiopian property management. 
                We understand local needs and have built a system that works for you.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Replaces manual, error-prone processes",
                  "Centralizes all property data in one place",
                  "Improves rent collection and financial control",
                  "Designed specifically for Ethiopian operations"
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <CheckCircle style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9375rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                order: 1
              }}
            >
              {[
                { value: "100%", label: "Digital Operations" },
                { value: "₤0", label: "Manual Spreadsheets" },
                { value: "24/7", label: "System Access" },
                { value: "1", label: "Unified Platform" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ 
                    fontSize: 'clamp(2rem, 5vw, 3rem)', 
                    fontWeight: 800, 
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgba(255,255,255,0.6)' 
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: 'clamp(4rem, 10vw, 6rem) 1rem',
        backgroundColor: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: NAVY_DARK, 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Ready to Transform Your <br/>
              <span style={{ color: NAVY }}>Property Management?</span>
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto 2rem',
              lineHeight: 1.75
            }}>
              Join hundreds of Ethiopian property owners and managers who have already 
              digitized their operations with Smart BMS.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                onClick={() => window.location.href = '/auth/signup'}
                style={{
                  backgroundColor: NAVY,
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px rgba(31, 53, 73, 0.3)',
                }}
              >
                Start Free Trial
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/home/contact'}
                style={{
                  backgroundColor: 'white',
                  color: NAVY,
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: `2px solid ${NAVY}`,
                  cursor: 'pointer',
                }}
              >
                Contact Sales
              </Button>
            </div>
            
            <div style={{ 
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              <span>No credit card required</span>
              <span style={{ opacity: 0.3 }}>•</span>
              <span>14-day free trial</span>
              <span style={{ opacity: 0.3 }}>•</span>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
