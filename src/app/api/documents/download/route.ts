import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      )
    }

    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      )
    }

    // Generate signed URL for download
    const { data, error } = await supabase.storage
      .from("tenant-documents")
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error("Signed URL error:", error)
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
      )
    }

    return NextResponse.json({ signedUrl: data.signedUrl })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
