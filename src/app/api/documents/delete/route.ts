import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      )
    }

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
