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

  if (error?.message === "Supabase is not configured") {
    return []
  }
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  return data as any[]
}

import { cookies } from "next/headers"

// Delete a notice by id (owner only)
export async function deleteGlobalNotice(id: string) {
  'use server'
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error?.message === "Supabase is not configured") return
  if (error) throw new Error(JSON.stringify(error))
}

export async function createGlobalNotice(formData: FormData): Promise<void> {
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

  if (role !== 'owner' && role !== 'landlord') {
    throw new Error(JSON.stringify({ code: 'NOT_AUTHORIZED', message: 'Only owner/landlord can post notices' }));
  }

  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr?.message === "Supabase is not configured") {
    throw new Error(JSON.stringify({ code: 'NOT_CONFIGURED', message: 'Notices are not available.' }));
  }
  if (userErr) throw new Error(JSON.stringify(userErr));
  if (!user) {
    throw new Error(JSON.stringify({ code: 'NO_USER', message: 'Auth session missing – please sign in again.' }));
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
  if (error?.message === "Supabase is not configured") {
    throw new Error(JSON.stringify({ code: 'NOT_CONFIGURED', message: 'Notices are not available.' }));
  }
  if (error) throw new Error(JSON.stringify(error));
}

export async function updateGlobalNotice(id: string, formData: FormData): Promise<void> {
  'use server'
  let role: string | undefined;
  try {
    const cookieStore = await cookies();
    role = cookieStore.get('userRole')?.value;
  } catch (error) {
    throw error;
  }

  if (role !== 'owner' && role !== 'landlord') {
    throw new Error(JSON.stringify({ code: 'NOT_AUTHORIZED', message: 'Only owner/landlord can update notices' }));
  }

  const supabase = await createServerSupabase()
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const priority = (formData.get('priority') as string) || 'normal'

  const { error } = await supabase
    .from('notifications')
    .update({ title, message, priority })
    .eq('id', id)

  if (error?.message === "Supabase is not configured") {
    throw new Error(JSON.stringify({ code: 'NOT_CONFIGURED', message: 'Notices are not available.' }));
  }
  if (error) throw new Error(JSON.stringify(error));
}
