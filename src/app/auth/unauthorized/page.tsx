"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { ShieldX, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>
        
        <Heading level={1} className="text-2xl font-bold text-foreground mb-4">
          Access Denied
        </Heading>
        
        <Text className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Text>

        <div className="space-y-3">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}
