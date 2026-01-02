import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
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
