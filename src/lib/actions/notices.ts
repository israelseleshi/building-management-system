"use server"
import { createServerSupabase } from "@/lib/supabaseServer"

export interface NoticePayload {
  title: string
  message: string
  priority: "urgent" | "normal"
}

export async function getGlobalNotices() {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from("notifications")
    .select("id,title,message,priority,created_at")
    .eq("is_global", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as any[]
}

import { cookies } from "next/headers"

export async function createGlobalNotice(formData: FormData) {
  'use server'
  console.log('--- DEBUG: Inside createGlobalNotice ---');
  let role: string | undefined;
  try {
    const cookieStore = await cookies();
    console.log('cookieStore type:', typeof cookieStore);
    console.log('cookieStore value:', cookieStore);
    role = cookieStore.get('userRole')?.value;
  } catch (error) {
    console.error('--- DEBUG: Error in createGlobalNotice ---', error);
    throw error; // Re-throw the error to see it in the UI
  }

  if (role !== 'owner' && role !== 'landlord') throw new Error('Not authorized');

  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  if (!user) {
    throw new Error('Auth session missing – please sign in again.')
  }

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const priority = (formData.get('priority') as string) || 'normal'

  const { error } = await supabase.from('notifications').insert({
    user_id: user?.id,
    title,
    message,
    priority,
    is_global: true,
  })
  if (error) throw error
}
