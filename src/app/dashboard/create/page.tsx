"use client"

import { useState, useEffect } from "react"
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
import { Building2, CheckCircle, Loader2 } from "lucide-react"
import { LayoutDashboard, PlusCircle, MessageSquare, CreditCard, TrendingUp, Settings, Users } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    addressLine1: "",
    city: "Addis Ababa",
    country: "Ethiopia",
    monthlyRent: "",
    status: "draft",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)
    }
    getUser()
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
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/signin")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 10MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a property title",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.addressLine1.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter an address",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.monthlyRent) {
        toast({
          title: "Validation Error",
          description: "Please enter monthly rent",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!currentUserId) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      let imageUrl: string | null = null

      // Upload image to Supabase Storage if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `properties/${currentUserId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          toast({
            title: "Upload Error",
            description: "Failed to upload image",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        // Get public URL
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }

      // Insert property into database
      const { error } = await supabase
        .from('properties')
        .insert([
          {
            landlord_id: currentUserId,
            title: formData.title,
            description: formData.description,
            address_line1: formData.addressLine1,
            city: formData.city,
            country: formData.country,
            monthly_rent: parseFloat(formData.monthlyRent),
            status: formData.status,
            is_active: true,
            image_url: imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])

      if (error) {
        console.error('Database error:', error)
        toast({
          title: "Error",
          description: "Failed to create listing",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      toast({
        title: "Success",
        description: `Property "${formData.title}" has been created successfully!`,
      })
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        addressLine1: "",
        city: "Addis Ababa",
        country: "Ethiopia",
        monthlyRent: "",
        status: "draft",
      })
      setImagePreview(null)
      setImageFile(null)

      // Redirect to listings
      router.push("/dashboard/listings")
    } catch (error) {
      console.error('Submit error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
          subtitle="Add a new property to your portfolio"
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
                {/* Property Title */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Property Title <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="e.g., Nano Computing ICT Solutions"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">The name of your property or business</p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Add details about your property</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Property Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      disabled={isSubmitting}
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
                  <p className="text-xs text-muted-foreground mt-1">Upload a photo of your property (optional)</p>
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="addressLine1"
                    placeholder="e.g., Bole Road, Building A"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Street address of your property</p>
                </div>

                {/* City and Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="e.g., Addis Ababa"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Country
                    </label>
                    <Input
                      type="text"
                      name="country"
                      placeholder="e.g., Ethiopia"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={isSubmitting}
                    />
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
                        { value: "draft", label: "Draft" },
                        { value: "listed", label: "Listed" },
                        { value: "occupied", label: "Occupied" },
                        { value: "inactive", label: "Inactive" },
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
                  Tips for Creating a Property Listing
                </Heading>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Use a clear and descriptive property title that reflects your property's purpose</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Upload a high-quality image of your property for better visibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Set a competitive monthly rent based on market rates in your area</span>
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
