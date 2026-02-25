"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import { API_BASE_URL } from "@/lib/apiClient"

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const resetPasswordSchema = z.object({
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

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStep?: "email" | "otp" | "reset"
}

export function ForgotPasswordModal({ open, onOpenChange, initialStep }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "otp" | "reset">(initialStep ?? "email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onEmailSubmit(values: ForgotPasswordValues) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || payload?.success === false) {
        setError(payload?.error || payload?.message || "Failed to send OTP. Please try again.")
        return
      }

      setEmail(values.email)
      setStep("otp")
      setSuccess("OTP sent! Check your inbox for the code.")
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onOtpSubmit() {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          type: "password_reset",
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || payload?.success === false) {
        setError(payload?.error || payload?.message || "Invalid OTP. Please try again.")
        return
      }

      setStep("reset")
      setSuccess("OTP verified. Please set a new password.")
    } catch (error) {
      console.error("OTP verification error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onResendOtp() {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "password_reset" }),
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

  async function onResetSubmit(values: ResetPasswordValues) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: values.password,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || payload?.success === false) {
        setError(payload?.error || payload?.message || "Failed to reset password. Please try again.")
        return
      }

      setSuccess("Password reset successfully!")
      setTimeout(() => {
        onOpenChange(false)
        setStep("email")
        emailForm.reset()
        resetForm.reset()
        setOtp("")
        setEmail("")
      }, 2000)
    } catch (error) {
      console.error("Reset password error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setStep(initialStep ?? "email")
      emailForm.reset()
      resetForm.reset()
      setError("")
      setSuccess("")
      setOtp("")
      setEmail("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md border-0"
        style={{ 
          backgroundColor: 'var(--background)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {step === "email" ? "Reset Password" : step === "otp" ? "Verify OTP" : "Create New Password"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "email" 
              ? "Enter your email address and we'll send you instructions to reset your password"
              : step === "otp"
                ? "Enter the OTP sent to your email"
                : "Enter your new password twice to confirm"}
          </DialogDescription>
        </DialogHeader>

        {step === "email" ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
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
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          disabled={isLoading}
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-10 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                style={{ 
                  backgroundColor: '#7D8B6F', 
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                }}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        ) : step === "otp" ? (
          <div className="space-y-4">
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
            <div className="space-y-2">
              <FormLabel>OTP Code</FormLabel>
              <Input
                placeholder="Enter the OTP from your email"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 rounded-xl border-muted-foreground/20"
                onClick={() => setStep("email")}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                type="button" 
                className="flex-1 h-10 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                style={{ 
                  backgroundColor: '#7D8B6F', 
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                }}
                onClick={onOtpSubmit}
                disabled={isLoading || !otp}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-xl border-muted-foreground/20"
              onClick={onResendOtp}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          </div>
        ) : (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
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
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter new password"
                          type="password"
                          disabled={isLoading}
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
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Confirm new password"
                          type="password"
                          disabled={isLoading}
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-muted-foreground/20"
                  onClick={() => {
                    setStep("email")
                    resetForm.reset()
                  }}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-10 text-base font-semibold rounded-xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ 
                    backgroundColor: '#7D8B6F', 
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(125, 139, 111, 0.3)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
