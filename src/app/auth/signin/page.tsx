import { SignInForm } from "@/features/auth/ui/SignInForm"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

export default function SignInPage() {
  return (
    <div style={{ backgroundColor: BROKEN_WHITE }} className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        
        {/* Left side - Ethiopian Building Image */}
        <div className="relative hidden lg:flex lg:w-[45%] items-center justify-center bg-[#1F3549] overflow-hidden rounded-tr-[3rem]">
          {/* Background Image with overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: 'url(/building-image_1.jpg)' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F3549] via-[#1F3549]/80 to-transparent z-10" />
          
          <div className="relative z-20 max-w-lg text-center text-white px-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-xl">
                <span className="text-white font-bold text-2xl tracking-tighter">BMS</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
                Welcome to BMS
              </h1>
              <p className="text-lg text-white/80 font-medium">
                Your complete property management solution for Ethiopian real estate.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8 border-y border-white/10 py-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Properties</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-4xl font-bold text-white mb-1">1k+</div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Tenants</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center text-white mb-2">
                  <CheckCircle2 strokeWidth={2.5} size={36} />
                </div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Addis Based</div>
              </div>
            </div>

            <div className="text-sm font-medium">
              <p className="text-white/60 mb-2">Trusted by property managers across Ethiopia</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90">
                Bole • Kazanchis • Piassa • Mexico Square
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1F3549]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(31,53,73,0.1)] border border-[#1F3549]/5 p-8 sm:p-10 relative z-10">
            {/* Logo at top */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#1F3549] flex items-center justify-center">
                  <span className="text-white font-bold text-lg tracking-tight">BMS</span>
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
                Welcome back
              </h2>
              <p className="text-sm font-medium" style={{ color: NAVY, opacity: 0.6 }}>
                Please enter your details to continue
              </p>
            </div>

            <SignInForm />

            <div className="mt-8 text-center border-t border-[#1F3549]/5 pt-6">
              <p className="text-sm" style={{ color: NAVY, opacity: 0.6 }}>
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold transition-all"
                  style={{ color: NAVY }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
