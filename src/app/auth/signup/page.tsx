import { SignUpForm } from "@/features/auth/ui/SignUpForm"
import { Header } from "@/components/home/Header"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header currentPage="home" />
      
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Ethiopian Building Image */}
      <div className="relative hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/ethiopian-building.jpg"
          alt="Ethiopian building - Addis Ababa architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="relative flex items-center justify-center h-full px-8">
          <div className="max-w-lg text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <span className="text-white font-bold text-2xl">BMS</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Join BMS Today
              </h1>
              <p className="text-lg text-white/90">
                Start managing your Ethiopian properties with confidence
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Free</div>
                <div className="text-sm text-white/80">Trial</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Local</div>
                <div className="text-sm text-white/80">Expertise</div>
              </div>
            </div>
            
            <div className="text-sm text-white/80">
              <p>Join thousands of Ethiopian property managers</p>
              <p className="mt-2">🏢 Bole • 🏢 Kazanchis • 🏢 Piassa • 🏢 Mexico Square</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Start managing your properties today
            </p>
          </div>
          
          <SignUpForm />
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
