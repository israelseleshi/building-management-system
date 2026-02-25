"use client"

import { useRouter } from "next/navigation"
import { ForgotPasswordModal } from "@/features/auth/ui/ForgotPasswordModal"

export default function ResetPasswordPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ForgotPasswordModal open={true} onOpenChange={handleClose} initialStep="email" />
    </div>
  )
}
