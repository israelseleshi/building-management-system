import { NextRequest, NextResponse } from "next/server"
import { processAttendanceRecords } from "@/lib/attendance"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const payload = processAttendanceRecords({
    startDate: body.startDate,
    endDate: body.endDate,
    shopId: body.shopId,
    unit: body.unit,
    location: body.location,
    status: body.status,
    include: body.include,
  })

  return NextResponse.json({
    success: true,
    message: "Attendance processed successfully",
    data: payload,
  })
}
