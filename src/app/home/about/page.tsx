"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/Footer"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

const sections = [
  { title: "Our Mission", text: "To empower property owners and tenants through innovative technology, creating a seamless, secure, and data-driven ecosystem that maximizes value." },
  { title: "Our Vision", text: "To be the global standard for property management software, transforming how people interact with real estate through intelligence, automation, and unparalleled user experience." },
  { title: "The Gap", text: "Building owners face manual tracking, scattered records, and lack of true financial visibility. We turn chaos into clarity." },
  { title: "Our Approach", text: "A single centralized platform combining tenant management, multi-property listing, and deep double-entry accounting in one system." },
  { title: "Built For Ethiopia", text: "Engineered specifically for the Ethiopian market, integrating with FAYDA and adhering to localized banking and compliance standards." },
  { title: "Core Values", text: "Security first, unyielding transparency, and a commitment to creating enterprise-grade tools that are easy for anyone to use." },
  { title: "The Future", text: "Our roadmap involves predictive maintenance, deep IoT integrations, and smart-contract leasing to elevate management further." }
]

function Card({ sec, i, progress, range, targetScale }: any) {
  const container = useRef(null)
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div ref={container} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0 }}>
      <motion.div 
        style={{ 
          backgroundColor: i % 2 === 0 ? NAVY : BROKEN_WHITE, 
          color: i % 2 === 0 ? BROKEN_WHITE : NAVY,
          width: '90%', 
          maxWidth: '1000px', 
          height: '60vh', 
          borderRadius: '24px', 
          padding: '4rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: `1px solid ${i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(31,53,73,0.1)'}`,
          scale,
          top: `calc(-5vh + ${i * 25}px)`
        }}
      >
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>{sec.title}</h2>
        <p style={{ fontSize: '1.5rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '800px' }}>{sec.text}</p>
      </motion.div>
    </div>
  )
}

export default function AboutPage() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })

  return (
    <div style={{ backgroundColor: BROKEN_WHITE, minHeight: '100vh' }}>
      <Header currentPage="about" />
      
      <header style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: BROKEN_WHITE }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 800, color: NAVY, letterSpacing: '-0.03em' }}>About Us</h1>
      </header>
      
      <main ref={container} style={{ position: 'relative' }}>
        {sections.map((sec, i) => {
          const targetScale = 1 - ( (sections.length - i) * 0.05 )
          return <Card key={i} i={i} sec={sec} progress={scrollYProgress} range={[i * .15, 1]} targetScale={targetScale} />
        })}
      </main>

      <div style={{ position: 'relative', zIndex: 10, backgroundColor: BROKEN_WHITE }}>
        <Footer />
      </div>
    </div>
  )
}


