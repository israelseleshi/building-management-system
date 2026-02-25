import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      )
    }

    const { documentId, rejectionReason } = await request.json()

    if (!documentId || !rejectionReason) {
      return NextResponse.json(
        { error: "Document ID and rejection reason are required" },
        { status: 400 }
      )
    }

    // Update document status to rejected with reason
    const { data, error } = await supabase
      .from("tenant_documents")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select()
      .single()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to reject document" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, document: data })
  } catch (error) {
    console.error("Reject error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
