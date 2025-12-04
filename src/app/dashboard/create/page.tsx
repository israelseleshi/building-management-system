"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Heading } from "@/components/ui/typography"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Combobox } from "@/components/ui/combobox"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Building2, CheckCircle } from "lucide-react"
import { LayoutDashboard, PlusCircle, MessageSquare, CreditCard, TrendingUp, Settings } from "lucide-react"

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
    businessName: "",
    unitNumber: "",
    type: "Office",
    location: "Bole, Addis Ababa",
    monthlyRevenue: "",
    status: "Active",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!formData.businessName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a business name",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.unitNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a unit number",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.monthlyRevenue) {
      toast({
        title: "Validation Error",
        description: "Please enter monthly revenue",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Listing "${formData.businessName}" has been created successfully!`,
      })
      
      // Reset form
      setFormData({
        businessName: "",
        unitNumber: "",
        type: "Office",
        location: "Bole, Addis Ababa",
        monthlyRevenue: "",
        status: "Active",
        image: "",
      })
      setImagePreview(null)

      // Redirect to listings
      router.push("/dashboard/listings")
      setIsSubmitting(false)
    }, 1000)
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
          subtitle="Add a new unit to your portfolio"
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
                {/* Business Name */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Business Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="businessName"
                    placeholder="e.g., Nano Computing ICT Solutions"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">The name of your business or shop</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Unit Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto" />
                          <p className="text-xs text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Building2 className="w-8 h-8 text-muted-foreground mx-auto" />
                          <p className="text-sm font-medium text-foreground">Click to upload image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Upload a photo of your unit</p>
                </div>

                {/* Unit Number */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Unit Number <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="unitNumber"
                    placeholder="e.g., Unit 101"
                    value={formData.unitNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">The unit identifier in your building</p>
                </div>

                {/* Type and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Type
                    </label>
                    <Combobox
                      options={[
                        { value: "Office", label: "Office" },
                        { value: "Retail", label: "Retail" },
                        { value: "Residential", label: "Residential" },
                        { value: "Commercial", label: "Commercial" },
                        { value: "Industrial", label: "Industrial" },
                        { value: "Warehouse", label: "Warehouse" },
                        { value: "Mixed", label: "Mixed" },
                      ]}
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      placeholder="Select type"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Location
                    </label>
                    <Combobox
                      options={[
                        { value: "Bole, Addis Ababa", label: "Bole, Addis Ababa" },
                        { value: "Kazanchis, Addis Ababa", label: "Kazanchis, Addis Ababa" },
                        { value: "Mexico Square, Addis Ababa", label: "Mexico Square, Addis Ababa" },
                        { value: "Piassa, Addis Ababa", label: "Piassa, Addis Ababa" },
                        { value: "Sar Bet, Addis Ababa", label: "Sar Bet, Addis Ababa" },
                        { value: "Mekane Yesus, Addis Ababa", label: "Mekane Yesus, Addis Ababa" },
                      ]}
                      value={formData.location}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                      placeholder="Select location"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Monthly Revenue and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Monthly Revenue (ETB) <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="number"
                      name="monthlyRevenue"
                      placeholder="e.g., 15000"
                      value={formData.monthlyRevenue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Status
                    </label>
                    <Combobox
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Maintenance", label: "Maintenance" },
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
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      backgroundColor: '#7D8B6F', 
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                    }}
                  >
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div className="mt-8 space-y-4">
              <div 
                className="rounded-2xl p-6 border-0"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
                }}
              >
                <Heading level={3} className="text-lg font-semibold text-foreground mb-4">
                  Tips for Creating a Listing
                </Heading>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Use a clear and descriptive business name that reflects your unit's purpose</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Set a competitive monthly revenue based on market rates in your area</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Keep your unit status updated to reflect its current availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">You can edit your listing details anytime from the My Listings page</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
