"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/typography"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { 
  Building2,
  MessageSquare,
  BarChart3,
  CheckCircle,
  ArrowRight,
  FileText,
  DollarSign,
  Users2,
  Settings2,
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Clock,
  Wrench
} from "lucide-react"

const NAVY = "#1F3549"
const NAVY_DARK = "#152A3D"
const BROKEN_WHITE = "#fafaf8"

function OrbitingFeature({ feature, index, x, y }: { feature: any; index: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px - 45px)`,
        top: `calc(50% + ${y}px - 45px)`,
        width: '90px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.15, y: -5 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '0.875rem',
          backgroundColor: 'white',
          border: `2px solid ${NAVY}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 24px ${NAVY}15`,
        }}
      >
        <feature.icon style={{ width: '20px', height: '20px', color: NAVY }} />
      </motion.div>
      <span style={{ 
        fontSize: '0.625rem', 
        fontWeight: 600, 
        color: NAVY_DARK,
        textAlign: 'center',
      }}>
        {feature.label}
      </span>
    </motion.div>
  );
}

function FloatingParticles() {
  const particles = [
    { width: 6, height: 6, left: 15, top: 20, delay: 0, duration: 8 },
    { width: 5, height: 5, left: 45, top: 35, delay: 1, duration: 10 },
    { width: 7, height: 7, left: 75, top: 10, delay: 2, duration: 7 },
    { width: 4, height: 4, left: 25, top: 60, delay: 3, duration: 9 },
    { width: 6, height: 6, left: 85, top: 45, delay: 1.5, duration: 11 },
    { width: 5, height: 5, left: 55, top: 75, delay: 4, duration: 8 },
    { width: 7, height: 7, left: 10, top: 85, delay: 2.5, duration: 10 },
    { width: 4, height: 4, left: 65, top: 25, delay: 0.5, duration: 7 },
    { width: 6, height: 6, left: 35, top: 50, delay: 3.5, duration: 9 },
    { width: 5, height: 5, left: 90, top: 70, delay: 1, duration: 12 },
    { width: 7, height: 7, left: 5, top: 40, delay: 4.5, duration: 8 },
    { width: 4, height: 4, left: 50, top: 90, delay: 2, duration: 10 },
    { width: 6, height: 6, left: 80, top: 5, delay: 3, duration: 7 },
    { width: 5, height: 5, left: 20, top: 15, delay: 0, duration: 11 },
    { width: 7, height: 7, left: 60, top: 55, delay: 2, duration: 9 },
    { width: 4, height: 4, left: 40, top: 80, delay: 4, duration: 8 },
    { width: 6, height: 6, left: 95, top: 30, delay: 1, duration: 10 },
    { width: 5, height: 5, left: 30, top: 65, delay: 3, duration: 7 },
    { width: 7, height: 7, left: 70, top: 95, delay: 0.5, duration: 9 },
    { width: 4, height: 4, left: 10, top: 5, delay: 2.5, duration: 11 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: p.width,
            height: p.height,
            borderRadius: '50%',
            backgroundColor: NAVY,
            opacity: 0.1,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -100],
            opacity: [0.1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function CircularOrbitHero() {
  const heroFeatures = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Building2, label: "Properties" },
    { icon: FileText, label: "Listings" },
    { icon: Users2, label: "Tenants" },
    { icon: CalendarDays, label: "Leases" },
    { icon: DollarSign, label: "Payments" },
    { icon: BarChart3, label: "Reports" },
    { icon: MessageSquare, label: "SMS" },
    { icon: CreditCard, label: "Late Fees" },
    { icon: Wrench, label: "Maintenance" },
    { icon: ShieldCheck, label: "Documents" },
    { icon: Clock, label: "Attendance" },
  ]
  const radius = 220;
  const totalFeatures = heroFeatures.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{ 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '600px',
        width: '100%',
        maxWidth: '650px',
        margin: '0 auto'
      }}
    >
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${NAVY}08 0%, transparent 70%)`,
        animation: 'orbitPulse 4s ease-in-out infinite',
      }} />
      
      <style>{`
        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', delay: 0.3 }}
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: NAVY,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: `0 25px 50px ${NAVY}40, 0 0 60px ${NAVY}20`,
        }}
      >
        <LayoutDashboard style={{ width: '28px', height: '28px', color: 'white', marginBottom: '0.25rem' }} />
        <span style={{ color: 'white', fontSize: '0.6875rem', fontWeight: 700 }}>Smart BMS</span>
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: `${radius * 2 + 140}px`,
          height: `${radius * 2 + 140}px`,
          borderRadius: '50%',
          border: `1px dashed ${NAVY}20`,
        }}
      />
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: `${radius * 2 + 60}px`,
          height: `${radius * 2 + 60}px`,
          borderRadius: '50%',
          border: `1px dashed ${NAVY}15`,
        }}
      />

      {heroFeatures.map((feature, index) => {
        const baseAngle = (index / totalFeatures) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(baseAngle) * radius;
        const y = Math.sin(baseAngle) * radius;
        
        return (
          <OrbitingFeature
            key={feature.label}
            feature={feature}
            index={index}
            x={x}
            y={y}
          />
        )
      })}
    </motion.div>
  )
}

function HeroDesign5({ router }: { router: any }) {
  return (
    <section style={{ 
      position: 'relative', 
      minHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: BROKEN_WHITE,
      paddingTop: '4rem'
    }}>
      <FloatingParticles />
      
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `
          radial-gradient(ellipse at 20% 30%, ${NAVY}15 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, ${NAVY}10 0%, transparent 40%),
          radial-gradient(ellipse at 40% 80%, ${NAVY}08 0%, transparent 45%),
          radial-gradient(ellipse at 90% 90%, ${NAVY}12 0%, transparent 35%)
        `,
        animation: 'gradientMove 20s ease-in-out infinite',
      }} />
      
      <style>{`
        @keyframes gradientMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(2%, 2%) rotate(1deg); }
          66% { transform: translate(-1%, 1%) rotate(-1deg); }
        }
      `}</style>
      
      <div style={{ 
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: 'calc(100vh - 6rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading level={1} style={{ 
              fontSize: 'clamp(2rem, 6vw, 4rem)', 
              fontWeight: 800, 
              marginBottom: '1.5rem', 
              lineHeight: 1.1,
              letterSpacing: '-0.03em'
            }}>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', color: NAVY_DARK }}
              >
                Property Management
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', color: NAVY }}
              >
                Reimagined
              </motion.span>
            </Heading>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
                color: '#6b7280', 
                marginBottom: '2.5rem',
                lineHeight: 1.75
              }}
            >
              Stop juggling multiple apps and spreadsheets. BMS brings everything together — 
              <span style={{ fontWeight: 600, color: NAVY_DARK }}> tenants, finances, maintenance, and communications</span> — 
              in one beautiful platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ 
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <Button 
                onClick={() => router.push("/auth/signup")}
                style={{
                  backgroundColor: NAVY,
                  color: 'white',
                  padding: '1.125rem 2rem',
                  borderRadius: '1rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(31, 53, 73, 0.3)',
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
                onClick={() => router.push("/home/services")}
                style={{
                  backgroundColor: 'white',
                  color: NAVY_DARK,
                  padding: '1.125rem 2rem',
                  borderRadius: '1rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '2px solid #e5e5e3',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                }}
              >
                View Features
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CircularOrbitHero />
          </motion.div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}

export function Design1Minimal() {
  const router = useRouter()

  const features = [
    { 
      icon: LayoutDashboard, 
      title: "Centralized Dashboard", 
      subtitle: "Manage Everything From One Place",
      desc: "Get complete visibility of your property portfolio. Track buildings, units, tenants, and finances all from a single, intuitive dashboard designed for Ethiopian property managers.",
      tags: ['Real-time data', 'Custom reports', 'Mobile friendly'],
      image: "/Centralized-Dashboard.png",
      imageAlt: "Centralized Dashboard",
      badge: "Most Popular Feature",
      imageLeft: true
    },
    { 
      icon: Building2, 
      title: "Multi-Property Support", 
      subtitle: "Oversee All Your Buildings",
      desc: "Manage multiple properties from a single platform. Whether you have 2 buildings or 200, our system scales with your portfolio.",
      tags: ['Unlimited buildings', 'Portfolio overview', 'Bulk actions'],
      image: "/Multi-Property-Support.png",
      imageAlt: "Multi-Property Management",
      imageLeft: false
    },
    { 
      icon: MessageSquare, 
      title: "In-App Messaging", 
      subtitle: "Communicate Instantly",
      desc: "Stay connected with tenants and staff through built-in messaging. Share updates, resolve issues, and build relationships without exchanging personal contact information.",
      tags: ['Real-time chat', 'File sharing', 'Read receipts'],
      image: "/In-App-Messaging.png",
      imageAlt: "In-App Messaging",
      imageLeft: true
    },
    { 
      icon: FileText, 
      title: "Digital Documents", 
      subtitle: "Go Paperless",
      desc: "Store all your leases, contracts, and important documents digitally. Sign agreements electronically and never worry about losing paperwork again.",
      tags: ['E-signatures', 'Cloud storage', 'Auto-expiry alerts'],
      image: "/Digital-Documents.png",
      imageAlt: "Digital Documents",
      imageLeft: false
    },
    { 
      icon: BarChart3, 
      title: "Attendance Tracking", 
      subtitle: "Monitor Staff & Security",
      desc: "Track employee hours, security guard shifts, and maintenance staff schedules. Generate payroll reports and ensure proper coverage across all your properties.",
      tags: ['Shift scheduling', 'Payroll integration', 'GPS check-in'],
      image: "/Attendance-Tracking.png",
      imageAlt: "Attendance Tracking",
      imageLeft: true
    },
    { 
      icon: Settings2, 
      title: "Smart Notifications", 
      subtitle: "Stay Updated Always",
      desc: "Receive automated alerts for rent payments, lease renewals, maintenance requests, and more. Never miss an important update again.",
      tags: ['Payment alerts', 'Renewal reminders', 'Customizable'],
      image: "/Smart-Notifications.png",
      imageAlt: "Smart Notifications",
      imageLeft: false
    },
  ]

  const ownerBenefits = [
    { icon: BarChart3, title: "Real-time Analytics", desc: "Track occupancy, revenue, and expenses with visual dashboards" },
    { icon: DollarSign, title: "Automated Rent Collection", desc: "Collect payments on time with automated reminders" },
    { icon: Users2, title: "Tenant Management", desc: "Screen, onboard, and manage all tenants from one dashboard" },
    { icon: FileText, title: "Legal Compliance", desc: "Stay compliant with automated document generation" },
  ]

  const ownerChecklist = [
    "Automated rent collection with instant notifications",
    "Real-time financial reports and analytics",
    "Occupancy tracking across all properties",
    "Legal compliance and document management",
    "Tenant screening and background checks",
    "Maintenance request tracking system"
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8', color: '#1f2937' }}>
      <style>{`
        .feature-grid-0,
        .feature-grid-1,
        .feature-grid-2,
        .feature-grid-3,
        .feature-grid-4,
        .feature-grid-5 {
          grid-template-columns: 1fr !important;
        }
        
        @media (min-width: 640px) {
          .feature-grid-0,
          .feature-grid-1,
          .feature-grid-2,
          .feature-grid-3,
          .feature-grid-4,
          .feature-grid-5 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 639px) {
          .feature-grid-0 [style*="order: 1"],
          .feature-grid-2,
          .feature-grid-4 {
            order: 2 !important;
          }
          .feature-grid-0 [style*="order: 2"],
          .feature-grid-1 [style*="order: 1"],
          .feature-grid-1 [style*="order: 2"],
          .feature-grid-3 [style*="order: 1"],
          .feature-grid-3 [style*="order: 2"],
          .feature-grid-5 [style*="order: 1"],
          .feature-grid-5 [style*="order: 2"] {
            order: 1 !important;
          }
        }

        .design-selector {
          position: fixed;
          top: 5rem;
          right: 1rem;
          z-index: 1000;
          backgroundColor: 'white',
          borderRadius: 1rem,
          padding: 0.5rem,
          box-shadow: 0 10px 40px rgba(0,0,0,0.15),
          border: 1px solid #e5e5e3,
        }
        
        .design-btn {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          text-align: left;
          transition: all 0.2s;
        }
        
        .design-btn:hover {
          backgroundColor: #f3f4f6;
          color: #1f2937;
        }
        
        .design-btn.active {
          backgroundColor: #1F3549;
          color: white;
        }
        
        @media (max-width: 768px) {
          .design-selector {
            position: static;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 1rem;
            margin: 1rem;
            border-radius: 1rem;
          }
          .design-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
      
      <Header currentPage="home" />

      <HeroDesign5 router={router} />

      <section style={{ 
        padding: 'clamp(3rem, 8vw, 5rem) 1rem', 
        backgroundColor: '#ffffff',
        borderTop: `3px solid ${NAVY}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}
          >
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 2rem',
              backgroundColor: NAVY,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '0 0 1rem 1rem',
              marginBottom: '1.5rem'
            }}>
              Features
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', 
              fontWeight: 800, 
              color: NAVY_DARK, 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Everything You Need to <span style={{ color: NAVY }}>Succeed</span>
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.75
            }}>
              Purpose-built tools designed for modern property management
            </p>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 'clamp(1.5rem, 4vw, 3rem)',
                marginBottom: 'clamp(3rem, 8vw, 6rem)',
                alignItems: 'center'
              }}
              className={`feature-grid-${index}`}
            >
              <div style={{ 
                position: 'relative',
                order: feature.imageLeft ? 1 : 2
              }}>
                <img 
                  src={feature.image} 
                  alt={feature.imageAlt} 
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    transform: feature.imageLeft ? 'rotate(-2deg)' : 'rotate(2deg)'
                  }}
                />
                {feature.badge && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-0.75rem',
                    right: feature.imageLeft ? '-0.75rem' : 'auto',
                    left: feature.imageLeft ? 'auto' : '-0.75rem',
                    backgroundColor: NAVY,
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                    {feature.badge}
                  </div>
                )}
              </div>
              
              <div style={{ order: feature.imageLeft ? 2 : 1 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: `${NAVY}10`,
                  marginBottom: '1rem'
                }}>
                  <feature.icon style={{ width: '20px', height: '20px', color: NAVY }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: NAVY }}>{feature.title}</span>
                </div>
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
                  fontWeight: 700, 
                  marginBottom: '1rem', 
                  color: NAVY_DARK, 
                  lineHeight: 1.2 
                }}>
                  {feature.subtitle}
                </h3>
                <p style={{ 
                  fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
                  color: '#6b7280', 
                  lineHeight: 1.75, 
                  marginBottom: '1.5rem' 
                }}>
                  {feature.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {feature.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e5e3',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      color: '#4b5563'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(3rem, 8vw, 6rem) 1rem', 
        backgroundColor: NAVY 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)' }}
          >
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '0.5rem 1.5rem',
              borderRadius: '0 0 1rem 1rem',
              marginBottom: '1rem'
            }}>
              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                For Property Owners
              </span>
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', 
              fontWeight: 800, 
              color: 'white', 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Maximize Your <span style={{ opacity: 0.7 }}>Investment Returns</span>
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
              color: 'rgba(255,255,255,0.7)', 
              maxWidth: '600px', 
              lineHeight: 1.75
            }}>
              Stop managing spreadsheets and multiple apps. Get complete visibility of your property portfolio with automated workflows that save hours every week.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {ownerBenefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <benefit.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                  </div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white' }}>{benefit.title}</h4>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {ownerChecklist.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '0.75rem'
                }}
              >
                <CheckCircle style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >
            <Button 
              onClick={() => router.push("/auth/signup?role=landlord")}
              style={{
                backgroundColor: 'white',
                color: NAVY,
                padding: '1rem 2.5rem',
                borderRadius: '1rem',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Start Managing
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
