"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Combobox } from "@/components/ui/combobox"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Building2, Loader2 } from "lucide-react"
import { LayoutDashboard, PlusCircle, MessageSquare, CreditCard, TrendingUp, Settings, Users } from "lucide-react"
import { API_BASE_URL, getAuthToken } from "@/lib/apiClient"

export default function CreateListing() {
  return (
    <ProtectedRoute requiredRole="landlord">
      <CreateListingContent />
    </ProtectedRoute>
  )
}

function CreateListingContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    unitNumber: "1",
    floorNumber: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    monthlyRent: "",
    status: "vacant",
  })
  const [buildings, setBuildings] = useState<any[]>([])
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("")
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true)

  useEffect(() => {
    const fetchBuildings = async () => {
      const token = getAuthToken()
      if (!token) return

      try {
        const res = await fetch(`${API_BASE_URL}/buildings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = await res.json()
        if (res.ok && payload.success) {
          const buildingsList = payload.data.buildings || []
          setBuildings(buildingsList)
          if (buildingsList.length > 0) {
            setSelectedBuildingId((buildingsList[0].building_id || buildingsList[0].id).toString())
          }
        }
      } catch (error) {
        console.error("Failed to fetch buildings:", error)
      } finally {
        setIsLoadingBuildings(false)
      }
    }

    fetchBuildings()
  }, [])

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      path: "/dashboard",
      active: false
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      name: "My Listings",
      path: "/dashboard/listings",
      active: false
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      name: "Create Listing",
      path: "/dashboard/create",
      active: true
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "Employees",
      path: "/dashboard/employees",
      active: false
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      name: "Chat",
      path: "/dashboard/chat",
      active: false
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      name: "Payouts",
      path: "/dashboard/payouts",
      active: false
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      name: "Analytics",
      path: "/dashboard/analytics",
      active: false
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      path: "/dashboard/settings",
      active: false
    }
  ]

  const handleLogout = () => {
    const token = getAuthToken()
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBuildingId) {
      toast({
        title: "Selection Error",
        description: "Please select a building first",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.monthlyRent) {
        toast({
          title: "Validation Error",
          description: "Please enter monthly rent",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const unitData = {
        unit_number: formData.unitNumber || "1",
        floor_number: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        size_sqm: formData.sizeSqm ? parseFloat(formData.sizeSqm) : undefined,
        rent_amount: parseFloat(formData.monthlyRent),
        status: formData.status,
      }

      const unitRes = await fetch(`${API_BASE_URL}/buildings/${selectedBuildingId}/units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unitData),
      })
      
      const unitPayload = await unitRes.json().catch(() => ({}))
      
      if (!unitRes.ok) {
        throw new Error(unitPayload.error || unitPayload.message || "Failed to create unit")
      }

      toast({
        title: "Success",
        description: "Unit created successfully!",
      });

      router.push("/dashboard/listings")
    } catch (error: any) {
      console.error("handleSubmit error:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        navItems={navItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <DashboardHeader
          title="Create Listing"
          subtitle="Create a unit with essential details"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content */}
        <main className="p-6 flex justify-center">
          <div className="w-full max-w-md">
            {/* Form Card */}
            <div 
              className="rounded-2xl p-8 border-0"
              style={{ 
                backgroundColor: 'var(--card)', 
                boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Building Selection Section */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Select Building <span className="text-red-600">*</span>
                  </label>
                  <Combobox
                    options={buildings.map(b => ({
                      value: (b.building_id || b.id).toString(),
                      label: b.name
                    }))}
                    value={selectedBuildingId}
                    onValueChange={setSelectedBuildingId}
                    placeholder={isLoadingBuildings ? "Loading buildings..." : "Select a building"}
                    className="w-full"
                    disabled={isSubmitting || isLoadingBuildings}
                  />
                  {buildings.length === 0 && !isLoadingBuildings && (
                    <p className="text-xs text-red-500 mt-1">No buildings found. Please create a building first.</p>
                  )}
                </div>

                {/* Unit Details Section */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-bold text-foreground mb-4">Unit Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Unit Number <span className="text-red-600">*</span>
                      </label>
                      <Input
                        type="text"
                        name="unitNumber"
                        placeholder="e.g., 101"
                        value={formData.unitNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Floor Number
                      </label>
                      <Input
                        type="number"
                        name="floorNumber"
                        placeholder="e.g., 1"
                        value={formData.floorNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, floorNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1">
                        Bedrooms
                      </label>
                      <Input
                        type="number"
                        name="bedrooms"
                        placeholder="0"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1">
                        Bathrooms
                      </label>
                      <Input
                        type="number"
                        name="bathrooms"
                        placeholder="0"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1">
                        Size (sqm)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        name="sizeSqm"
                        placeholder="0.0"
                        value={formData.sizeSqm}
                        onChange={(e) => setFormData(prev => ({ ...prev, sizeSqm: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Monthly Rent and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Monthly Rent (ETB) <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="number"
                      name="monthlyRent"
                      placeholder="e.g., 15000"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Status
                    </label>
                    <Combobox
                      options={[
                        { value: "vacant", label: "Vacant" },
                        { value: "occupied", label: "Occupied" },
                        { value: "maintenance", label: "Maintenance" },
                      ]}
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      placeholder="Select status"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/listings")}
                    className="flex-1 h-12 rounded-xl border-border"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: '#7D8B6F', 
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                    }}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-8" />
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
