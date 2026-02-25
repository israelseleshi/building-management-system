"use server";

import { API_BASE_URL } from "@/lib/apiClient";

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const username = (formData.get("username") as string) || email?.split("@")[0];

  const response = await fetch(`${API_BASE_URL}/auth/register/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      username,
      role: "tenant",
      full_name: name,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.success === false) {
    return { success: false, message: payload?.error || payload?.message || "Registration failed." };
  }

  return {
    success: true,
    message: "Account created! Check your email to verify.",
  };
}
