"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Heading, Text } from "@/components/ui/typography"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/apiClient"

const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<"details" | "otp">("details")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: SignUpValues) {
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      if (step === "details") {
        const response = await fetch(`${API_BASE_URL}/auth/register/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        })

        const payload = await response.json().catch(() => ({}))

        if (!response.ok || payload?.success === false) {
          setError(payload?.error || payload?.message || "Failed to send OTP. Please try again.")
          return
        }

        setSuccess("OTP sent! Check your inbox.")
        setStep("otp")
        return
      }

      const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          otp,
          type: "registration",
        }),
      })

      const verifyPayload = await verifyResponse.json().catch(() => ({}))

      if (!verifyResponse.ok || verifyPayload?.success === false) {
        setError(verifyPayload?.error || verifyPayload?.message || "Invalid OTP. Please try again.")
        return
      }

      const completeResponse = await fetch(`${API_BASE_URL}/auth/register/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: values.username,
          role: "tenant",
          full_name: values.name,
        }),
      })

      const completePayload = await completeResponse.json().catch(() => ({}))

      if (!completeResponse.ok || completePayload?.success === false) {
        setError(
          completePayload?.error ||
            completePayload?.message ||
            "Registration failed. Please try again."
        )
        return
      }

      alert("Account created! You can now sign in.")
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign up error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function resendOtp(email: string) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "registration" }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || payload?.success === false) {
        setError(payload?.error || payload?.message || "Failed to resend OTP. Please try again.")
        return
      }

      setSuccess("New OTP sent! Check your inbox.")
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="w-full max-w-md mx-auto rounded-2xl p-6 md:p-8 border-0"
      style={{ 
        backgroundColor: 'var(--card)', 
        boxShadow: '0 4px 12px rgba(107, 90, 70, 0.25)' 
      }}
    >
      <div className="space-y-1 mb-6">
        <Heading level={2} className="text-2xl font-bold text-center text-foreground">Create Account</Heading>
        <Text className="text-muted-foreground text-center">Enter your information to get started</Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
              {success}
            </div>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your full name"
                      disabled={isLoading || step === "otp"}
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Choose a username"
                      disabled={isLoading || step === "otp"}
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      disabled={isLoading || step === "otp"}
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading || step === "otp"}
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isLoading || step === "otp"}
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {step === "otp" && (
            <FormItem>
              <FormLabel>OTP Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the OTP from your email"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
          {step === "otp" && (
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-xl border-muted-foreground/20"
              onClick={() => resendOtp(form.getValues("email"))}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          )}
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
            style={{ 
              backgroundColor: '#7D8B6F', 
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {step === "details" ? "Sending OTP..." : "Creating account..."}
              </>
            ) : (
              step === "details" ? "Send OTP" : "Verify & Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
