"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { mockInvoices, Invoice } from "@/lib/mockInvoices"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Download } from "lucide-react"
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"
import InvoiceTemplate from "@/components/dashboard/InvoiceTemplate"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useRouter } from "next/navigation"

export default function LandlordInvoicesPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <InvoicesContent />
    </ProtectedRoute>
  )
}

function InvoicesContent() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const handleSidebarNavigation = (isCurrentlyCollapsed: boolean) => {
    if (!isCurrentlyCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => <span className="font-medium">{row.getValue("invoiceNumber")}</span>,
    },
    {
      accessorKey: "billTo.name",
      header: "Tenant",
      cell: ({ row }) => <span className="font-medium">{row.original.billTo.name}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"))
        return <span className="font-medium">ETB {amount.toLocaleString('en-ET', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        let className = ""
        
        if (status === "Paid") className = "bg-emerald-500 hover:bg-emerald-600 text-white border-0"
        if (status === "Pending") className = "bg-amber-500 hover:bg-amber-600 text-white border-0"
        if (status === "Overdue") className = "bg-red-500 hover:bg-red-600 text-white border-0"

        return (
            <Badge variant="outline" className={className}>
                {status}
            </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedInvoice(invoice)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            
            <PDFDownloadLink
              document={<InvoiceTemplate invoice={invoice} />}
              fileName={`${invoice.invoiceNumber}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading} className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )
      },
    },
  ]

  // Filter invoices based on search query
  const filteredInvoices = mockInvoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.billTo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={handleSidebarNavigation}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="All Invoices"
          subtitle="Manage tenant invoices"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-6">
          <DataTable columns={columns} data={filteredInvoices} />
        </main>
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-4xl h-[90vh] bg-white flex flex-col p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Invoice Preview: {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full overflow-hidden bg-gray-100">
            {selectedInvoice && (
              <PDFViewer width="100%" height="100%" className="w-full h-full border-none">
                <InvoiceTemplate invoice={selectedInvoice} />
              </PDFViewer>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
