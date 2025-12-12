import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }

    // Update document status to approved
    const { data, error } = await supabase
      .from("tenant_documents")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select()
      .single()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to approve document" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, document: data })
  } catch (error) {
    console.error("Approve error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
