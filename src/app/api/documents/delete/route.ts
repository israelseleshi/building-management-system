import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function DELETE(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }

    // Get document details
    const { data: document, error: fetchError } = await supabase
      .from("tenant_documents")
      .select("*")
      .eq("id", documentId)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("tenant-documents")
      .remove([document.file_path])

    if (storageError) {
      console.error("Storage deletion error:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("tenant_documents")
      .delete()
      .eq("id", documentId)

    if (dbError) {
      console.error("Database deletion error:", dbError)
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
