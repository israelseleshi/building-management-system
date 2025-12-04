"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heading, MutedText } from "@/components/ui/typography"
import { Search, Bell } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DashboardHeader({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header
      className="bg-card"
      style={{
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div>
            <Heading level={2} className="text-foreground">
              {title}
            </Heading>
            <MutedText className="text-sm">{subtitle}</MutedText>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-black"
            />
          </div>

          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <Bell className="w-4 h-4" />
          </Button>

          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/landlord.png" alt="Landlord" />
              <AvatarFallback>LL</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
