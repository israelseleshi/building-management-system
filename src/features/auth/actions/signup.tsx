"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function signUpAction(formData: FormData) {
  const supabase = createServerSupabase();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, 
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Account created! Check your email to verify.",
  };
}
