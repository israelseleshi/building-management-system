import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentTypeId = formData.get("documentTypeId") as string
    const tenantId = formData.get("tenantId") as string

    // Validate inputs
    if (!file || !documentTypeId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Run as the authenticated user so RLS works
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Optional safety: ensure token user matches tenantId
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      console.error("[api/documents/upload] auth.getUser failed", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (userData.user.id !== tenantId) {
      console.error("[api/documents/upload] tenantId mismatch", {
        tokenUserId: userData.user.id,
        tenantId,
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Derive landlord_id from tenant's most recent lease (do not trust client input)
    const { data: leaseData, error: leaseError } = await supabase
      .from("leases")
      .select("landlord_id")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (leaseError || !leaseData?.landlord_id) {
      console.error("[api/documents/upload] Could not derive landlord_id from leases", {
        leaseError,
        tenantId,
      })
      return NextResponse.json(
        {
          error:
            "Cannot upload: no landlord found for this tenant. Please make sure you have an active lease.",
          debug:
            process.env.NODE_ENV !== "production"
              ? { stage: "derive.landlord", leaseError }
              : undefined,
        },
        { status: 400 }
      )
    }

    const landlordId = leaseData.landlord_id as string

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Generate file path: {tenant_id}/{document_type_id}/{filename}
    const timestamp = Date.now()
    const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}.pdf`
    const filePath = `${tenantId}/${documentTypeId}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("tenant-documents")
      .upload(filePath, uint8Array, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("[api/documents/upload] Storage upload error:", {
        message: uploadError.message,
        name: uploadError.name,
        cause: (uploadError as any).cause,
      })
      return NextResponse.json(
        {
          error: "Failed to upload file",
          debug: process.env.NODE_ENV !== "production" ? {
            stage: "storage.upload",
            filePath,
            uploadError,
          } : undefined,
        },
        { status: 500 }
      )
    }

    // Create database record
    const { data: docData, error: dbError } = await supabase
      .from("tenant_documents")
      .insert({
        tenant_id: tenantId,
        landlord_id: landlordId,
        document_type_id: documentTypeId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[api/documents/upload] Database insert error:", {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code,
      })
      // Try to delete the uploaded file if database insert fails
      await supabase.storage
        .from("tenant-documents")
        .remove([filePath])
      
      return NextResponse.json(
        {
          error: "Failed to save document record",
          debug: process.env.NODE_ENV !== "production" ? {
            stage: "db.insert",
            filePath,
            dbError,
          } : undefined,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        document: docData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[api/documents/upload] Unhandled error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: process.env.NODE_ENV !== "production" ? { error } : undefined,
      },
      { status: 500 }
    )
  }
}
