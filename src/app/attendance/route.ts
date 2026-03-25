import { NextRequest, NextResponse } from "next/server"
import { getAttendanceStore, processAttendanceRecords } from "@/lib/attendance"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const payload = processAttendanceRecords({
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    shopId: searchParams.get("shopId") || undefined,
    unit: searchParams.get("unit") || undefined,
    location: searchParams.get("location") || undefined,
    status: searchParams.get("status") || undefined,
    include: (searchParams.get("include") as "all" | "active" | null) || undefined,
  })

  return NextResponse.json({
    success: true,
    data: {
      ...payload,
      shops: getAttendanceStore().shops,
      config: getAttendanceStore().config,
    },
  })
}
