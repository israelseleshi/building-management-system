"use client"

import { Header } from "@/components/home/Header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="about" />
      
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            About Us
          </h1>
          <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
            <p className="text-lg text-muted-foreground">
              this is placeholder for the page: About Us
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
