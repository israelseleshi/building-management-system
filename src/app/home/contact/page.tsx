"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { ContactForm } from "@/components/home/ContactForm"
import { Heading, Text } from "@/components/ui/typography"
import { motion } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email Us",
    value: "support@bms.et",
    href: "mailto:support@bms.et"
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Call Us",
    value: "+251 911 223 344",
    href: "tel:+251911223344"
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Visit Us",
    value: "Kazanchis, Addis Ababa, Ethiopia",
    href: "#"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Working Hours",
    value: "Mon - Sat: 8:00 AM - 6:00 PM",
    href: "#"
  }
]

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: "#", color: "hover:text-blue-600" },
  { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:text-sky-500" },
  { icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:text-pink-600" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#", color: "hover:text-blue-700" },
]

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8' }}>
      <Header currentPage="contact" />
      
      <main>
        {/* Hero Section */}
        <section style={{ 
          padding: 'clamp(4rem, 10vw, 5rem) 1rem 3rem',
          backgroundColor: '#fafaf8'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading level={1} style={{ 
                fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
                fontWeight: 800, 
                marginBottom: '1rem',
                color: '#152A3D'
              }}>
                Get in <span style={{ color: '#1F3549' }}>Touch</span>
              </Heading>
              <Text size="lg" style={{ 
                color: '#6b7280', 
                maxWidth: '700px', 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: 1.75
              }}>
                Have questions about our platform? Our team is here to help you 
                optimize your property management experience.
              </Text>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 1rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'start'
            }}>
              {/* Left Column: Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
              >
                <div>
                  <Heading level={2} style={{ 
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                    fontWeight: 700, 
                    color: '#1F3549',
                    marginBottom: '1.5rem'
                  }}>Contact Information</Heading>
                  <Text style={{ 
                    color: '#6b7280', 
                    marginBottom: '2.5rem',
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    lineHeight: 1.75
                  }}>
                    Fill out the form and our team will get back to you within 24 hours. 
                    Alternatively, you can reach us through any of these channels.
                  </Text>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {contactInfo.map((info) => (
                      <a 
                        key={info.label}
                        href={info.href}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1rem',
                          borderRadius: '1rem',
                          transition: 'all 0.2s',
                          border: '1px solid transparent'
                        }}
                        className="contact-info-item"
                      >
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '0.75rem',
                          backgroundColor: '#f0f4f8',
                          color: '#1F3549',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        className="contact-icon"
                        >
                          {info.icon}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F3549', marginBottom: '0.25rem' }}>{info.label}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{info.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <Heading level={3} style={{ 
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                    fontWeight: 700, 
                    color: '#1F3549',
                    marginBottom: '1.5rem'
                  }}>Follow Our Journey</Heading>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        whileHover={{ y: -4 }}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #e5e5e3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280',
                          transition: 'all 0.2s'
                        }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div style={{
                  position: 'relative',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  aspectRatio: '16/9',
                  border: '1px solid #e5e5e3'
                }}>
                  <img 
                    src="/ethiopian-building.jpg" 
                    alt="Office Location" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%)',
                      transition: 'filter 0.7s'
                    }}
                    className="map-image"
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(31, 53, 73, 0.05)'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '9999px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <MapPin style={{ color: '#1F3549', width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Find us in Addis Ababa</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


