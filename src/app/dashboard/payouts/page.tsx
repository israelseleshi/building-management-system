"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heading, Text } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Settings,
  Users,
  Plus,
  Eye,
  Trash2,
  DollarSign,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface Payout {
  id: string
  landlord_id: string
  property_id: string
  amount: number
  currency: string
  payment_method: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  transaction_id?: string
  payment_date?: string
  due_date?: string
  description?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface PayoutMetric {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  color: string
}

interface Property {
  id: string
  title: string
}

export default function PayoutsPage() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <PayoutsContent />
    </ProtectedRoute>
  )
}

function PayoutsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [metrics, setMetrics] = useState<PayoutMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [addPayoutModalOpen, setAddPayoutModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [formData, setFormData] = useState({
    property_id: "",
    amount: "",
    payment_method: "bank_transfer",
    due_date: "",
    description: "",
    notes: "",
  })

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false,
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false,
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: true,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false,
    },
  ]

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('No user found')
          return
        }

        console.log('Fetching data for user:', user.id)

        // Fetch properties independently
        const fetchProperties = async () => {
          try {
            const { data: props, error: propsError } = await supabase
              .from('properties')
              .select('id, title')
              .eq('landlord_id', user.id)
            
            if (propsError) {
              console.error('Error fetching properties:', propsError)
            } else {
              console.log('Properties fetched:', props)
              setProperties(props || [])
            }
          } catch (err) {
            console.error('Exception fetching properties:', err)
          }
        }

        // Fetch payouts
        const fetchPayouts = async () => {
          try {
            const { data, error } = await supabase
              .from('payouts')
              .select('*')
              .eq('landlord_id', user.id)
              .order('created_at', { ascending: false })

            if (error) throw error

            setPayouts(data || [])
            calculateMetrics(data || [])
          } catch (err) {
            console.error('Error fetching payouts:', err)
          }
        }

        await Promise.all([fetchProperties(), fetchPayouts()])

      } catch (err) {
        console.error('Error in main fetch:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateMetrics = (data: Payout[]) => {
    const completed = data.filter(p => p.status === 'completed')
    const pending = data.filter(p => p.status === 'pending')
    const processing = data.filter(p => p.status === 'processing')

    const totalPaid = completed.reduce((sum, p) => sum + p.amount, 0)
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0)
    const totalProcessing = processing.reduce((sum, p) => sum + p.amount, 0)

    setMetrics([
      {
        title: "Total Paid",
        value: `ETB ${(totalPaid / 1000).toFixed(1)}K`,
        change: "+12.5%",
        trend: "up",
        color: "text-emerald-600",
      },
      {
        title: "Pending",
        value: `ETB ${(totalPending / 1000).toFixed(1)}K`,
        change: `${pending.length} payouts`,
        trend: "down",
        color: "text-orange-600",
      },
      {
        title: "Processing",
        value: `ETB ${(totalProcessing / 1000).toFixed(1)}K`,
        change: `${processing.length} payouts`,
        trend: "up",
        color: "text-blue-600",
      },
      {
        title: "Success Rate",
        value: `${data.length > 0 ? Math.round((completed.length / data.length) * 100) : 0}%`,
        change: `${completed.length}/${data.length} completed`,
        trend: "up",
        color: "text-purple-600",
      },
    ])
  }

  const handleAddPayout = async () => {
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount')
      return
    }

    if (!formData.property_id || !formData.amount) {
      console.error('Please fill in all required fields')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('payouts')
        .insert([
          {
            landlord_id: user.id,
            property_id: formData.property_id,
            amount: amount,
            currency: 'ETB',
            payment_method: formData.payment_method,
            status: 'pending',
            due_date: formData.due_date || null,
            description: formData.description,
            notes: formData.notes,
          }
        ])

      if (error) throw error

      console.log('Payout request created successfully')

      setFormData({
        property_id: "",
        amount: "",
        payment_method: "bank_transfer",
        due_date: "",
        description: "",
        notes: "",
      })
      setAddPayoutModalOpen(false)

      // Refresh payouts
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        const { data } = await supabase
          .from('payouts')
          .select('*')
          .eq('landlord_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (data) {
          setPayouts(data)
          calculateMetrics(data)
        }
      }
    } catch (err) {
      console.error('Error creating payout:', err)
      console.error('Failed to create payout request')
    }
  }

  const handleDeletePayout = async (payoutId: string) => {
    try {
      const { error } = await supabase
        .from('payouts')
        .delete()
        .eq('id', payoutId)

      if (error) throw error

      setPayouts(payouts.filter(p => p.id !== payoutId))
        console.log('Payout deleted successfully')
    } catch (err) {
      console.error('Error deleting payout:', err)
        console.error('Failed to delete payout')
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    const matchesMethod = methodFilter === "all" || payout.payment_method === methodFilter
    return matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }


  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Payouts"
          subtitle="Manage your payment requests and track payout status"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-2xl p-5 md:p-6 border-0"
                style={{
                  backgroundColor: 'var(--card)',
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Text className="text-sm text-muted-foreground mb-1">
                      {metric.title}
                    </Text>
                    <Heading level={3} className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </Heading>
                    <Text className="text-xs text-muted-foreground mt-2">
                      {metric.change}
                    </Text>
                  </div>
                  <div className={`p-2 rounded-lg ${metric.trend === "up" ? "bg-emerald-100" : "bg-red-100"}`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className={`w-5 h-5 ${metric.color}`} />
                    ) : (
                      <TrendingDown className={`w-5 h-5 ${metric.color}`} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Button
              onClick={() => setAddPayoutModalOpen(true)}
              className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Payout
            </Button>

            <div className="flex gap-2 flex-1">
              <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 w-40 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 w-40 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Methods</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="check">Check</option>
              <option value="cash">Cash</option>
            </select>
            </div>

            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Payouts Table */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7D8B6F]"></div>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="pt-12 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <Heading level={3} className="mb-2">No payouts found</Heading>
                <Text className="text-muted-foreground mb-4">
                  {payouts.length === 0
                    ? "You haven't requested any payouts yet"
                    : "No payouts match your filters"}
                </Text>
                {payouts.length === 0 && (
                  <Button
                    onClick={() => setAddPayoutModalOpen(true)}
                    className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Request Your First Payout
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Method</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Due Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayouts.map((payout) => (
                        <tr key={payout.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <Text className="font-semibold">
                              ETB {payout.amount.toLocaleString()}
                            </Text>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="capitalize">
                              {payout.payment_method.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(payout.status)}>
                              <span className="mr-1">{getStatusIcon(payout.status)}</span>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Text className="text-sm">
                              {payout.due_date
                                ? new Date(payout.due_date).toLocaleDateString()
                                : "-"}
                            </Text>
                          </td>
                          <td className="py-3 px-4">
                            <Text className="text-sm text-muted-foreground">
                              {new Date(payout.created_at).toLocaleDateString()}
                            </Text>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayout(payout)
                                  setViewModalOpen(true)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePayout(payout.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Add Payout Modal */}
      <Dialog open={addPayoutModalOpen} onOpenChange={setAddPayoutModalOpen}>
        <DialogContent
          style={{
            backgroundColor: 'var(--card)',
            boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
          }}
        >
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Create a new payout request for your property earnings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="property">Property</Label>
              <select
                id="property"
                value={formData.property_id}
                onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (ETB)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="method">Payment Method</Label>
              <select
                id="method"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Monthly rent collection"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPayout}
              className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white"
            >
              Create Payout Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payout Modal */}
      {selectedPayout && (
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent
            style={{
              backgroundColor: 'var(--card)',
              boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)'
            }}
          >
            <DialogHeader>
              <DialogTitle>Payout Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-muted-foreground">Amount</Text>
                  <Heading level={3} className="text-xl font-bold">
                    ETB {selectedPayout.amount.toLocaleString()}
                  </Heading>
                </div>
                <div>
                  <Text className="text-sm text-muted-foreground">Status</Text>
                  <Badge className={getStatusColor(selectedPayout.status)}>
                    {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-muted-foreground">Payment Method</Text>
                  <Text className="font-medium capitalize">
                    {selectedPayout.payment_method.replace('_', ' ')}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-muted-foreground">Currency</Text>
                  <Text className="font-medium">{selectedPayout.currency}</Text>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-muted-foreground">Due Date</Text>
                  <Text className="font-medium">
                    {selectedPayout.due_date
                      ? new Date(selectedPayout.due_date).toLocaleDateString()
                      : "-"}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-muted-foreground">Created</Text>
                  <Text className="font-medium">
                    {new Date(selectedPayout.created_at).toLocaleDateString()}
                  </Text>
                </div>
              </div>

              {selectedPayout.description && (
                <div>
                  <Text className="text-sm text-muted-foreground">Description</Text>
                  <Text className="font-medium">{selectedPayout.description}</Text>
                </div>
              )}

              {selectedPayout.notes && (
                <div>
                  <Text className="text-sm text-muted-foreground">Notes</Text>
                  <Text className="font-medium">{selectedPayout.notes}</Text>
                </div>
              )}

              {selectedPayout.transaction_id && (
                <div>
                  <Text className="text-sm text-muted-foreground">Transaction ID</Text>
                  <Text className="font-mono text-sm">{selectedPayout.transaction_id}</Text>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  )
}
