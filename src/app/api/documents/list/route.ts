import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const userRole = searchParams.get("userRole")
    const userId = searchParams.get("userId")

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    let query = supabase
      .from("tenant_documents")
      .select("*, document_type:document_types(*), tenant:profiles(full_name)")

    if (userRole === "tenant") {
      query = query.eq("tenant_id", userId)
    } else if (userRole === "landlord") {
      query = query.eq("landlord_id", userId)
    } else {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 400 }
      )
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents: data || [] })
  } catch (error) {
    console.error("List error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
