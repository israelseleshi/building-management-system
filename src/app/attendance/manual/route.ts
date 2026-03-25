import { NextRequest, NextResponse } from "next/server"
import { addManualAdjustment, getAttendanceStore } from "@/lib/attendance"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { adjustments: getAttendanceStore().manualAdjustments },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const adjustment = addManualAdjustment({
    shopId: body.shopId,
    date: body.date,
    newStatus: body.newStatus,
    notes: body.notes,
    updatedBy: body.updatedBy,
  })

  return NextResponse.json({
    success: true,
    message: "Manual adjustment saved",
    data: { adjustment },
  })
}
