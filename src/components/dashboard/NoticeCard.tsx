"use client"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Text } from "@/components/ui/typography"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"

interface Notice {
  id: string
  title: string
  message: string
  priority: "urgent" | "normal"
  created_at: string
}

export default function NoticeCard({ notice, onDelete }: { notice: Notice; onDelete?: () => void }) {
  const badgeClasses = notice.priority === "urgent"
    ? "bg-red-100 text-red-800 border-red-200"
    : "bg-blue-100 text-blue-800 border-blue-200"

  const cardBg = notice.priority === "urgent" ? "#FEE2E2" : "var(--card)"

  return (
    <Card className="p-4 flex flex-col gap-2 relative" style={{ backgroundColor: cardBg, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      {onDelete && (
        <button onClick={onDelete} className="absolute top-2 right-2 text-red-600 hover:text-red-800" aria-label="Delete notice">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-foreground text-sm lg:text-base">{notice.title}</h3>
        <Badge variant="secondary" className={`${badgeClasses} text-xs`}>{notice.priority === 'urgent' ? 'Urgent' : 'Notice'}</Badge>
      </div>
      <Text size="sm" className="text-muted-foreground whitespace-pre-wrap">{notice.message}</Text>
      <div className="flex items-center gap-1 mt-auto text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" /> {dayjs(notice.created_at).format('DD MMM YYYY, HH:mm')}
      </div>
    </Card>
  )
}
