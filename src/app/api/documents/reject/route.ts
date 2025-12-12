import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(request: NextRequest) {
  try {
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
