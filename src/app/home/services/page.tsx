"use client"

import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"
import { Heading, Text } from "@/components/ui/typography"
import { FeatureCard } from "@/components/FeatureCard"
import { motion } from "framer-motion"
import { 
  Building2, 
  Users2, 
  Settings2, 
  ShieldCheck, 
  CreditCard, 
  Search, 
  MessageSquare, 
  FileCheck,
  BarChart3,
  CalendarDays,
  Wrench,
  Bell
} from "lucide-react"

const landlordServices = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Financial Analytics",
    desc: "Track ROI, occupancy rates, and revenue trends with real-time dashboards."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Tenant Screening",
    desc: "Verify potential tenants with comprehensive background and credit checks."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Automated Payouts",
    desc: "Receive rent payments directly to your bank account with zero manual effort."
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Legal Compliance",
    desc: "Stay updated with local housing laws and automated tax documentation."
  }
]

const tenantServices = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Smart Property Search",
    desc: "Find verified listings that match your lifestyle and budget perfectly."
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Virtual Tours",
    desc: "Explore properties from anywhere with high-quality 3D virtual walkthroughs."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Direct Messaging",
    desc: "Communicate securely with landlords without sharing personal contact info."
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Maintenance Portal",
    desc: "Submit and track repair requests with photo attachments and status updates."
  }
]

const managerServices = [
  {
    icon: <Settings2 className="w-6 h-6" />,
    title: "Portfolio Management",
    desc: "Oversee multiple buildings and units from a single, intuitive interface."
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Staff Coordination",
    desc: "Assign tasks to maintenance and security teams with performance tracking."
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Notifications",
    desc: "Automated alerts for lease renewals, overdue payments, and system health."
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Asset Optimization",
    desc: "Maintenance schedules and energy tracking to prolong property value."
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="services" />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading level={1} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Solutions for Every <span className="text-emerald-600">Stakeholder</span>
              </Heading>
              <Text size="lg" className="text-muted-foreground max-w-2xl mb-6 text-base md:text-lg">
                Our comprehensive platform bridges the gap between ownership, management, and living.
              </Text>
            </motion.div>
          </div>
        </section>

        {/* Landlords Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center mb-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                  For Property Owners
                </div>
                <Heading level={2} className="text-3xl md:text-4xl font-bold">Maximize Your Investment</Heading>
                <Text className="text-lg text-muted-foreground leading-relaxed">
                  Turn your property into a hands-off revenue stream. We handle the complexity of 
                  billing, tenant management, and financial reporting so you can focus on growth.
                </Text>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {landlordServices.map((service, index) => (
                  <FeatureCard 
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    desc={service.desc}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tenants Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                  For Modern Tenants
                </div>
                <Heading level={2} className="text-3xl md:text-4xl font-bold text-foreground">A Better Way to Live</Heading>
                <Text className="text-lg text-muted-foreground leading-relaxed">
                  Experience a frictionless rental journey. From discovering your dream home to 
                  digital lease signing and instant maintenance support.
                </Text>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tenantServices.map((service, index) => (
                  <FeatureCard 
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    desc={service.desc}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Property Managers Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-100">
                  For Management Teams
                </div>
                <Heading level={2} className="text-3xl md:text-4xl font-bold">Command Center for Efficiency</Heading>
                <Text className="text-lg text-muted-foreground leading-relaxed">
                  Empower your staff with tools that automate routine tasks. Track every 
                  interaction, maintenance request, and payment in one centralized hub.
                </Text>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {managerServices.map((service, index) => (
                  <FeatureCard 
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    desc={service.desc}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

