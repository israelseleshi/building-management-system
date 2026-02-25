import { createBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const notConfiguredError = { message: "Supabase is not configured" }
const noop = async () => ({ data: null, error: notConfiguredError })

export const supabase: SupabaseClient = (supabaseUrl && supabaseKey
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : ({
      auth: {
        getUser: noop,
        signOut: noop,
        getSession: noop,
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
    } as any)) as SupabaseClient
