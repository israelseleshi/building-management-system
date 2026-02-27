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
    <div className="min-h-screen bg-background">
      <Header currentPage="contact" />
      
      <main>
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading level={1} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Get in <span className="text-emerald-600">Touch</span>
              </Heading>
              <Text size="lg" className="text-muted-foreground max-w-2xl text-base md:text-lg">
                Have questions about our platform? Our team is here to help you 
                optimize your property management experience.
              </Text>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column: Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div>
                  <Heading level={2} className="text-3xl font-bold mb-6">Contact Information</Heading>
                  <Text className="text-muted-foreground mb-10 text-lg">
                    Fill out the form and our team will get back to you within 24 hours. 
                    Alternatively, you can reach us through any of these channels.
                  </Text>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {contactInfo.map((info) => (
                      <a 
                        key={info.label}
                        href={info.href}
                        className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-border"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">{info.label}</p>
                          <p className="text-sm text-muted-foreground">{info.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <Heading level={3} className="text-xl font-bold mb-6">Follow Our Journey</Heading>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        whileHover={{ y: -4 }}
                        className={`w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-colors ${social.color}`}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Styled Map Placeholder */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-100 aspect-video border border-border group">
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/5 group-hover:bg-emerald-950/0 transition-all">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                      <MapPin className="text-emerald-600 w-5 h-5" />
                      <span className="font-semibold text-sm">Find us in Addis Ababa</span>
                    </div>
                  </div>
                  <img 
                    src="/ethiopian-building.jpg" 
                    alt="Office Location" 
                    className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                  />
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

