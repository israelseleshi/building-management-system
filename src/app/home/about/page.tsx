"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { Heading, Text } from "@/components/ui/typography"
import { motion } from "framer-motion"
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Users, 
  Zap, 
  Globe,
  Building2,
  Trophy,
  Heart
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stats = [
  { label: "Active Tenants", value: "10k+", icon: <Users className="w-5 h-5" /> },
  { label: "Verified Buildings", value: "500+", icon: <Building2 className="w-5 h-5" /> },
  { label: "Awards Won", value: "12", icon: <Trophy className="w-5 h-5" /> },
  { label: "Customer Satisfaction", value: "98%", icon: <Heart className="w-5 h-5" /> },
]

const values = [
  {
    title: "Uncompromising Security",
    desc: "We prioritize the safety of your data and transactions above all else.",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "Innovation First",
    desc: "Constantly evolving our platform to bring you the latest in property tech.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "Global Vision",
    desc: "Bridging the gap in the real estate market with international standards.",
    icon: <Globe className="w-6 h-6" />
  }
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8' }}>
      <Header currentPage="about" />
      
      <main>
        {/* Hero Section */}
        <section style={{ 
          position: 'relative', 
          padding: 'clamp(4rem, 10vw, 6rem) 1rem 5rem',
          overflow: 'hidden',
          backgroundColor: '#1F3549',
          color: 'white'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 20% 30%, #152A3D 0%, transparent 50%),
                         radial-gradient(ellipse at 80% 80%, #152A3D 0%, transparent 50%)`,
            opacity: 0.5
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
            <motion.div 
              style={{ maxWidth: '900px' }}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                Our Story
              </div>
              <Heading level={1} style={{ 
                fontSize: 'clamp(2rem, 6vw, 4rem)', 
                fontWeight: 800, 
                marginBottom: '1.5rem', 
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                Redefining the <span style={{ color: 'rgba(255,255,255,0.6)' }}>Future</span> of Real Estate
              </Heading>
              <Text size="lg" style={{ 
                color: 'rgba(255,255,255,0.7)', 
                maxWidth: '700px', 
                marginBottom: '2rem',
                lineHeight: 1.75,
                fontSize: 'clamp(1rem, 2vw, 1.125rem)'
              }}>
                BMS started with a simple idea: property management should be effortless, 
                transparent, and accessible to everyone. Today, we're building the infrastructure 
                for the modern rental economy.
              </Text>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ padding: 'clamp(2rem, 5vw, 3rem) 1rem', borderBottom: '1px solid #e5e5e3', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#f0f4f8',
                    color: '#1F3549',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    {stat.icon}
                  </div>
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#1F3549', marginBottom: '0.25rem' }}>{stat.value}</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 1rem', backgroundColor: '#fafaf8' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#f0f4f8',
                      color: '#1F3549',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Target style={{ width: '24px', height: '24px' }} />
                    </div>
                    <Heading level={2} style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#1F3549' }}>Our Mission</Heading>
                  </div>
                  <Text style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#6b7280', lineHeight: 1.75 }}>
                    To empower property owners and tenants through innovative technology, 
                    creating a seamless, secure, and data-driven ecosystem that maximizes 
                    value and enhances the living experience for all.
                  </Text>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#f0f4f8',
                      color: '#1F3549',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Eye style={{ width: '24px', height: '24px' }} />
                    </div>
                    <Heading level={2} style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#1F3549' }}>Our Vision</Heading>
                  </div>
                  <Text style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#6b7288', lineHeight: 1.75 }}>
                    To be the global standard for property management software, 
                    transforming how people interact with real estate through 
                    intelligence, automation, and unparalleled user experience.
                  </Text>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  aspectRatio: '1',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}>
                  <img 
                    src="/ethiopian-building.jpg" 
                    alt="BMS Vision" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(31, 53, 73, 0.6) 0%, transparent 50%)'
                  }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-1rem',
                  left: '-1rem',
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  maxWidth: '280px',
                  display: 'none'
                }}
                className="md:block"
                >
                  <Text style={{ fontWeight: 600, color: '#1F3549', marginBottom: '0.5rem', fontStyle: 'italic' }}>"Efficiency is our obsession."</Text>
                  <Text size="sm" style={{ color: '#6b7280' }}>— The BMS Product Team</Text>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
              <Heading level={2} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#1F3549', marginBottom: '1rem' }}>Our Core Values</Heading>
              <Text style={{ color: '#6b7280' }}>The principles that guide every decision we make and every line of code we write.</Text>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundColor: '#fafaf8',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #e5e5e3',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#f0f4f8',
                    color: '#1F3549',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    {value.icon}
                  </div>
                  <Heading level={3} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F3549', marginBottom: '0.75rem' }}>{value.title}</Heading>
                  <Text style={{ color: '#6b7280', lineHeight: 1.75 }}>{value.desc}</Text>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


