import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const notConfiguredError = { message: "Supabase is not configured" };
    const noop = async () => ({ data: null, error: notConfiguredError });
    return {
      auth: {
        getUser: noop,
        signOut: noop,
      },
      from: () => ({
        select: noop,
        insert: noop,
        update: noop,
        delete: noop,
        eq: () => ({
          select: noop,
          update: noop,
          delete: noop,
          order: noop,
          in: noop,
          maybeSingle: noop,
          single: noop,
        }),
        order: noop,
        in: noop,
        maybeSingle: noop,
        single: noop,
      }),
      storage: {
        from: () => ({
          upload: noop,
          remove: noop,
          createSignedUrl: noop,
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
      channel: () => ({
        on: () => ({
          subscribe: () => ({}),
        }),
      }),
      removeChannel: () => {},
    } as unknown as SupabaseClient;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
