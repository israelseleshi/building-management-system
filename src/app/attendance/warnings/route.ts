import { NextRequest, NextResponse } from "next/server"
import { addWarningAction, getAttendanceStore } from "@/lib/attendance"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { warnings: getAttendanceStore().warningActions },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const warning = addWarningAction({
    shopId: body.shopId,
    shopName: body.shopName,
    unit: body.unit,
    date: body.date,
    templateId: body.templateId,
    templateName: body.templateName,
    channel: body.channel,
    recipient: body.recipient,
    message: body.message,
    sentBy: body.sentBy,
  })

  return NextResponse.json({
    success: true,
    message: "Warning sent successfully",
    data: { warning },
  })
}
