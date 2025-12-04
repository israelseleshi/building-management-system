"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SearchItem {
  id: string
  title: string
  description?: string
  category: string
  path: string
  icon?: React.ReactNode
}

interface SearchCommandProps {
  items?: SearchItem[]
  placeholder?: string
}

export function SearchCommand({ 
  items = [],
  placeholder = "Search pages and content..."
}: SearchCommandProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  // Default searchable items
  const defaultItems: SearchItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View your main dashboard",
      category: "Navigation",
      path: "/dashboard",
    },
    {
      id: "listings",
      title: "My Listings",
      description: "Manage your property listings",
      category: "Navigation",
      path: "/dashboard/listings",
    },
    {
      id: "create",
      title: "Create Listing",
      description: "Add a new property listing",
      category: "Navigation",
      path: "/dashboard/create",
    },
    {
      id: "chat",
      title: "Chat",
      description: "Message with tenants",
      category: "Navigation",
      path: "/dashboard/chat",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Manage account settings",
      category: "Navigation",
      path: "/dashboard/settings",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View analytics and reports",
      category: "Navigation",
      path: "/dashboard/analytics",
    },
    {
      id: "payouts",
      title: "Payouts",
      description: "Manage payment information",
      category: "Navigation",
      path: "/dashboard/payouts",
    },
  ]

  const searchItems = items.length > 0 ? items : defaultItems

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  // Group items by category
  const groupedItems = searchItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, SearchItem[]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">{placeholder}</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 sm:w-[300px] md:w-[400px]" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item.path)}
                    className="cursor-pointer"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
