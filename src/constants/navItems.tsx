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
} from "lucide-react"

export interface NavItem {
  icon: React.ReactNode
  name: string
  path: string
  active: boolean
}

/* -------------------------------------------------------------------------- */
/*                                BASE ARRAYS                                */
/* -------------------------------------------------------------------------- */

const landlordBase: Omit<NavItem, "active">[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/dashboard" },
  { icon: <Building2 className="w-5 h-5" />, name: "My Listings", path: "/dashboard/listings" },
  { icon: <PlusCircle className="w-5 h-5" />, name: "Create Listing", path: "/dashboard/create" },
  { icon: <Users className="w-5 h-5" />, name: "Employees", path: "/dashboard/employees" },
  { icon: <FileText className="w-5 h-5" />, name: "Rents", path: "/dashboard/leases" },
  { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/dashboard/documents" },
  { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/dashboard/chat" },
  { icon: <Users className="w-5 h-5" />, name: "Reports", path: "/dashboard/reports" },
  { icon: <CreditCard className="w-5 h-5" />, name: "Payouts", path: "/dashboard/payouts" },
  { icon: <FileText className="w-5 h-5" />, name: "Invoices", path: "/dashboard/invoices" },
  { icon: <TrendingUp className="w-5 h-5" />, name: "Analytics", path: "/dashboard/analytics" },
  { icon: <MessageSquare className="w-5 h-5" />, name: "Manage Notices", path: "/dashboard/notices" },
  { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/dashboard/settings" },
]

const tenantBase: Omit<NavItem, "active">[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/tenant-dashboard" },
  { icon: <Grid className="w-5 h-5" />, name: "Listings", path: "/tenant-dashboard/listings" },
  { icon: <FileText className="w-5 h-5" />, name: "My Rents", path: "/tenant-dashboard/leases" },
  { icon: <FileText className="w-5 h-5" />, name: "Documents", path: "/tenant-dashboard/documents" },
  { icon: <MessageSquare className="w-5 h-5" />, name: "Chat", path: "/tenant-dashboard/chat" },
  { icon: <FileText className="w-5 h-5" />, name: "Reports", path: "/tenant-dashboard/reports" },
  { icon: <Settings className="w-5 h-5" />, name: "Settings", path: "/tenant-dashboard/settings" },
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

export const getLandlordNavItems = (pathname: string): NavItem[] =>
  landlordBase.map((item) => ({ ...item, active: isActive(pathname, item.path) }))

export const getTenantNavItems = (pathname: string): NavItem[] =>
  tenantBase.map((item) => ({ ...item, active: isActive(pathname, item.path) }))
