import { NextRequest, NextResponse } from "next/server"
import { getAttendanceStore, updateAttendanceConfig } from "@/lib/attendance"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { config: getAttendanceStore().config },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const config = updateAttendanceConfig(body)

  return NextResponse.json({
    success: true,
    message: "Attendance configuration updated",
    data: { config },
  })
}
