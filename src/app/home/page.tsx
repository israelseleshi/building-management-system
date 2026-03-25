"use client"

import { useState, useEffect } from "react"
import { DesignSelector } from "@/components/home/DesignSelector"
import { Design1Minimal } from "@/components/home/designs/Design1Minimal"
import { Design2Grid } from "@/components/home/designs/Design2Grid"
import { Design3GridLight } from "@/components/home/designs/Design3GridLight"
import { Design4GridBold } from "@/components/home/designs/Design4GridBold"
import { Design5GridModern } from "@/components/home/designs/Design5GridModern"

type DesignType = "minimal" | "grid" | "grid-light" | "grid-bold" | "grid-modern"

const DESIGN_STORAGE_KEY = "bms-landing-design"

export default function LandingPage() {
  const [currentDesign, setCurrentDesign] = useState<DesignType>("grid")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(DESIGN_STORAGE_KEY) as DesignType | null
    if (stored && ["minimal", "grid", "grid-light", "grid-bold", "grid-modern"].includes(stored)) {
      setCurrentDesign(stored)
    }
  }, [])

  const handleDesignChange = (design: string) => {
    setCurrentDesign(design as DesignType)
    localStorage.setItem(DESIGN_STORAGE_KEY, design)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#7D8B6F]">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {currentDesign === "minimal" && <Design1Minimal />}
      {currentDesign === "grid" && <Design2Grid />}
      {currentDesign === "grid-light" && <Design3GridLight />}
      {currentDesign === "grid-bold" && <Design4GridBold />}
      {currentDesign === "grid-modern" && <Design5GridModern />}
      
      <DesignSelector 
        currentDesign={currentDesign} 
        onDesignChange={handleDesignChange} 
      />
    </>
  )
}
