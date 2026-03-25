"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, X } from "lucide-react"

type DesignOption = {
  id: string
  name: string
  description: string
}

const designs: DesignOption[] = [
  { id: "minimal", name: "Minimal", description: "Clean & Simple" },
  { id: "grid", name: "Grid", description: "Card-based layout" },
  { id: "grid-light", name: "Grid Light", description: "Parallax + Light" },
  { id: "grid-bold", name: "Grid Bold", description: "Bold parallax effects" },
  { id: "grid-modern", name: "Grid Modern", description: "Sleek parallax" },
]

interface DesignSelectorProps {
  currentDesign: string
  onDesignChange: (design: string) => void
}

export function DesignSelector({ currentDesign, onDesignChange }: DesignSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const current = designs.find(d => d.id === currentDesign) || designs[0]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Choose Design
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
              {designs.map((design) => (
                <button
                  key={design.id}
                  onClick={() => {
                    onDesignChange(design.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentDesign === design.id
                      ? "bg-[#7D8B6F] text-white"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentDesign === design.id
                      ? "border-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {currentDesign === design.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{design.name}</div>
                    <div className={`text-xs ${
                      currentDesign === design.id 
                        ? "text-white/80" 
                        : "text-slate-500 dark:text-slate-400"
                    }`}>
                      {design.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-[#7D8B6F] hover:bg-[#6a7a5e] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
          >
            <Palette className="w-5 h-5" />
            <span className="text-sm font-medium">{current.name}</span>
            <div className="ml-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
