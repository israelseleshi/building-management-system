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
  Clock3,
  Bell,
  Receipt,
  PieChart,
  Calendar,
  ShieldCheck,
  ClipboardList,
  Send,
  FileInput,
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
      { icon: <PieChart className="w-5 h-5" />, name: "Dashboard", path: "/dashboard" },
    ],
    defaultOpen: true,
  },
  {
    title: "Calendar",
    icon: <Calendar className="w-5 h-5" />,
    items: [
      { icon: <Calendar className="w-5 h-5" />, name: "Calendar", path: "/dashboard/calendar" },
    ],
  },
  {
    title: "Rentals",
    icon: <Building className="w-5 h-5" />,
    items: [
      { icon: <Building2 className="w-5 h-5" />, name: "My Units", path: "/dashboard/listings" },
      { icon: <PlusCircle className="w-5 h-5" />, name: "Create Units", path: "/dashboard/create" },
      { icon: <Calendar className="w-5 h-5" />, name: "Rents", path: "/dashboard/leases" },
    ],
    defaultOpen: true,
  },
  {
    title: "Applications",
    icon: <Grid className="w-5 h-5" />,
    items: [
      { icon: <ClipboardList className="w-5 h-5" />, name: "Applicant's", path: "/dashboard/applications/applicants" },
      { icon: <FileInput className="w-5 h-5" />, name: "Forms", path: "/dashboard/applications/forms" },
      { icon: <Send className="w-5 h-5" />, name: "Requests Sent", path: "/dashboard/applications/requests" },
    ],
  },
  {
    title: "People",
    icon: <Users className="w-5 h-5" />,
    items: [
      { icon: <Users className="w-5 h-5" />, name: "Employees", path: "/dashboard/employees" },
      { icon: <Clock3 className="w-5 h-5" />, name: "Attendance", path: "/dashboard/attendance" },
    ],
  },
  {
    title: "Messaging",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat" },
      { icon: <Bell className="w-5 h-5" />, name: "NOTICE", path: "/dashboard/notices" },
    ],
  },
  {
    title: "Accounting",
    icon: <DollarSign className="w-5 h-5" />,
    items: [
      { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts" },
      { icon: <Receipt className="w-5 h-5" />, name: "Invoices", path: "/dashboard/invoices" },
    ],
  },
  {
    title: "Files",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/dashboard/documents" },
    ],
  },
  {
    title: "Insights",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { icon: <ShieldCheck className="w-5 h-5" />, name: "Reports", path: "/dashboard/reports" },
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
      { icon: <PieChart className="w-5 h-5" />, name: "Dashboard", path: "/tenant-dashboard" },
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
    icon: <Grid className="w-5 h-5" />,
    items: [
      { icon: <Calendar className="w-5 h-5" />, name: "My Rents", path: "/tenant-dashboard/leases" },
      { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/tenant-dashboard/documents" },
    ],
  },
  {
    title: "Messaging",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/tenant-dashboard/chat" },
    ],
  },
  {
    title: "Insights",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { icon: <ShieldCheck className="w-5 h-5" />, name: "Reports", path: "/tenant-dashboard/reports" },
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

const stripLocalePrefix = (pathname: string) =>
  pathname.replace(/^\/(en|am)(?=\/|$)/, "")

const isActive = (pathname: string, itemPath: string) => {
  const normalizedPathname = stripLocalePrefix(pathname)
  if (itemPath === "/dashboard" || itemPath === "/tenant-dashboard") {
    return normalizedPathname === itemPath
  }
  return (
    normalizedPathname === itemPath ||
    normalizedPathname.startsWith(itemPath + "/")
  )
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
