"use client"

import React from "react"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Grid,
  DollarSign,
  BarChart3,
  Building,
} from "lucide-react"

export interface NavItemBase {
  icon: React.ReactNode
  name: string
  path: string
}

export interface NavItem extends NavItemBase {
  active: boolean
}


export interface NavGroupBase {
  title: string
  icon: React.ReactNode
  items: NavItemBase[]
  defaultOpen?: boolean
}

export interface NavGroup extends NavGroupBase {
  items: NavItem[]
}

/* -------------------------------------------------------------------------- */
/*                                BASE ARRAYS                                */
/* -------------------------------------------------------------------------- */

const landlordGroups: NavGroupBase[] = [
  {
    title: "Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
    items: [
      { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard" },
    ],
    defaultOpen: true,
  },
  {
    title: "Properties",
    icon: <Building className="w-5 h-5" />,
    items: [
      { icon: <Building2 className="w-5 h-5" />, name: "My Listings", path: "/dashboard/listings" },
      { icon: <PlusCircle className="w-5 h-5" />, name: "Create Listing", path: "/dashboard/create" },
    ],
    defaultOpen: true,
  },
  {
    title: "Management",
    icon: <Users className="w-5 h-5" />,
    items: [
      { icon: <Users className="w-5 h-5" />, name: "Employees", path: "/dashboard/employees" },
      { icon: <FileText className="w-5 h-5" />, name: "Rents", path: "/dashboard/leases" },
      { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/dashboard/documents" },
    ],
  },
  {
    title: "Communication",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat" },
      { icon: <MessageSquare className="w-5 h-5" />, name: "Manage Notices", path: "/dashboard/notices" },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign className="w-5 h-5" />,
    items: [
      { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts" },
      { icon: <FileText className="w-5 h-5" />, name: "Invoices", path: "/dashboard/invoices" },
    ],
  },
  {
    title: "Insights",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { icon: <Users className="w-5 h-5" />, name: "Reports", path: "/dashboard/reports" },
      { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    items: [
      { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings" },
    ],
  },
]

const tenantGroups: NavGroupBase[] = [
  {
    title: "Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
    items: [
      { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/tenant-dashboard" },
    ],
    defaultOpen: true,
  },
  {
    title: "Properties",
    icon: <Building className="w-5 h-5" />,
    items: [
      { icon: <Grid className="w-5 h-5" />, name: "Listings", path: "/tenant-dashboard/listings" },
    ],
  },
  {
    title: "Management",
    icon: <Users className="w-5 h-5" />,
    items: [
      { icon: <FileText className="w-5 h-5" />, name: "My Rents", path: "/tenant-dashboard/leases" },
      { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/tenant-dashboard/documents" },
    ],
  },
  {
    title: "Communication",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/tenant-dashboard/chat" },
    ],
  },
  {
    title: "Insights",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { icon: <FileText className="w-5 h-5" />, name: "Reports", path: "/tenant-dashboard/reports" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    items: [
      { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/tenant-dashboard/settings" },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                             HELPER FUNCTIONS                               */
/* -------------------------------------------------------------------------- */

const isActive = (pathname: string, itemPath: string) => {
  if (itemPath === "/dashboard" || itemPath === "/tenant-dashboard") {
    return pathname === itemPath
  }
  return pathname === itemPath || pathname.startsWith(itemPath + "/")
}

export const getLandlordNavGroups = (pathname: string): NavGroup[] =>
  landlordGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, active: isActive(pathname, item.path) })),
  })) as NavGroup[]

export const getTenantNavGroups = (pathname: string): NavGroup[] =>
  tenantGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, active: isActive(pathname, item.path) })),
  })) as NavGroup[]

// Keep old functions for backward compatibility
export const getLandlordNavItems = (pathname: string): NavItem[] => {
  const groups = getLandlordNavGroups(pathname)
  return groups.flatMap((group) => group.items) as NavItem[]
}

export const getTenantNavItems = (pathname: string): NavItem[] => {
  const groups = getTenantNavGroups(pathname)
  return groups.flatMap((group) => group.items) as NavItem[]
}
