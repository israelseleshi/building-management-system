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
    <div className="min-h-screen bg-background">
      <Header currentPage="about" />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-4">
                Our Story
              </span>
              <Heading level={1} className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Redefining the <span className="text-emerald-400">Future</span> of Real Estate
              </Heading>
              <Text size="lg" className="text-slate-400 max-w-2xl mb-8 text-base md:text-lg leading-relaxed">
                BMS started with a simple idea: property management should be effortless, 
                transparent, and accessible to everyone. Today, we're building the infrastructure 
                for the modern rental economy.
              </Text>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <span className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</span>
                  <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Target className="w-6 h-6" />
                    </div>
                    <Heading level={2} className="text-3xl font-bold">Our Mission</Heading>
                  </div>
                  <Text className="text-lg text-muted-foreground leading-relaxed">
                    To empower property owners and tenants through innovative technology, 
                    creating a seamless, secure, and data-driven ecosystem that maximizes 
                    value and enhances the living experience for all.
                  </Text>
                </div>

                <div className="group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Eye className="w-6 h-6" />
                    </div>
                    <Heading level={2} className="text-3xl font-bold">Our Vision</Heading>
                  </div>
                  <Text className="text-lg text-muted-foreground leading-relaxed">
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
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/ethiopian-building.jpg" 
                    alt="BMS Vision" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl hidden md:block max-w-[280px]">
                  <Text className="font-semibold text-emerald-600 mb-2 italic">"Efficiency is our obsession."</Text>
                  <Text size="sm" className="text-muted-foreground">— The BMS Product Team</Text>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Heading level={2} className="text-3xl md:text-4xl font-bold mb-6">Our Core Values</Heading>
              <Text className="text-muted-foreground">The principles that guide every decision we make and every line of code we write.</Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    {value.icon}
                  </div>
                  <Heading level={3} className="text-xl font-bold mb-4">{value.title}</Heading>
                  <Text className="text-muted-foreground leading-relaxed">{value.desc}</Text>
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

