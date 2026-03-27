import { SignUpForm } from "@/features/auth/ui/SignUpForm"
import { Header } from "@/components/home/Header"
import Link from "next/link"
import { Sparkles, Globe } from "lucide-react"

const NAVY = "#1F3549"
const BROKEN_WHITE = "#fafaf8"

export default function SignUpPage() {
  return (
    <div style={{ backgroundColor: BROKEN_WHITE }} className="min-h-screen flex flex-col">
      <Header currentPage="home" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full pt-[80px]">
        
        {/* Left side - Ethiopian Building Image */}
        <div className="relative hidden lg:flex lg:w-[45%] items-center justify-center bg-[#1F3549] overflow-hidden rounded-tr-[3rem]">
          {/* Background Image with overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: 'url(/ethiopian-building.jpg)' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F3549] via-[#1F3549]/80 to-transparent z-10" />
          
          <div className="relative z-20 max-w-lg text-center text-white px-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-xl">
                <span className="text-white font-bold text-2xl tracking-tighter">BMS</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
                Join BMS Today
              </h1>
              <p className="text-lg text-white/80 font-medium">
                Start managing your Ethiopian properties with absolute confidence and clarity.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8 border-y border-white/10 py-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Support</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="flex justify-center text-white mb-2">
                  <Sparkles strokeWidth={2.5} size={36} />
                </div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Free Trial</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center text-white mb-2">
                  <Globe strokeWidth={2.5} size={36} />
                </div>
                <div className="text-xs font-bold tracking-widest text-white/50 uppercase">Local Exp.</div>
              </div>
            </div>

            <div className="text-sm font-medium">
              <p className="text-white/60 mb-2">Join thousands of Ethiopian property managers</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90">
                Bole • Kazanchis • Piassa • Mexico Square
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1F3549]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(31,53,73,0.1)] border border-[#1F3549]/5 p-8 sm:p-10 relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: NAVY }}>
                Create Account
              </h2>
              <p className="text-[#1F3549]/60 text-sm font-medium">
                Start managing your properties today.
              </p>
            </div>

            <SignUpForm />

            <div className="mt-8 text-center border-t border-[#1F3549]/5 pt-6">
              <p className="text-sm font-medium text-[#1F3549]/60">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-bold hover:underline transition-all"
                  style={{ color: NAVY }}
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
