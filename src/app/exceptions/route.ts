import { NextRequest, NextResponse } from "next/server"
import { processExceptions } from "@/lib/attendance"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const exceptions = processExceptions({
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    severity: searchParams.get("severity") || undefined,
  })

  return NextResponse.json({
    success: true,
    data: { exceptions },
  })
}
