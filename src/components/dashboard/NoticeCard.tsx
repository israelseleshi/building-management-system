"use client"
import { Card } from "@/components/ui/card"
import { Trash2, Pencil } from "lucide-react"
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

export default function NoticeCard({ notice, onDelete, onEdit }: { notice: Notice; onDelete?: () => void; onEdit?: () => void }) {
  const isUrgent = notice.priority === "urgent"

  const badgeClasses = isUrgent
    ? "bg-white text-red-600 border-white/20"
    : "bg-blue-100 text-blue-800 border-blue-200"

  const cardBg = isUrgent ? "#dc2626" : "var(--card)" // red-600 for pure red look
  
  const textColor = isUrgent ? "text-white" : "text-foreground"
  const mutedTextColor = isUrgent ? "text-white/90" : "text-muted-foreground"
  const dateColor = isUrgent ? "text-white/80" : "text-muted-foreground"

  return (
    <Card className="p-4 flex flex-col gap-2 relative" style={{ backgroundColor: cardBg, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      <div className="absolute top-2 right-2 flex gap-1">
        {onEdit && (
          <button onClick={onEdit} className={`${isUrgent ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`} aria-label="Edit notice">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className={`${isUrgent ? 'text-white/80 hover:text-white' : 'text-red-600 hover:text-red-800'}`} aria-label="Delete notice">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mb-1 pr-12">
        <h3 className={`font-semibold text-sm lg:text-base ${textColor}`}>{notice.title}</h3>
        <Badge variant="secondary" className={`${badgeClasses} text-xs`}>{notice.priority === 'urgent' ? 'Urgent' : 'Notice'}</Badge>
      </div>
      <Text size="sm" className={`${mutedTextColor} whitespace-pre-wrap`}>{notice.message}</Text>
      <div className={`flex items-center gap-1 mt-auto text-xs ${dateColor}`}>
        <Calendar className="w-3 h-3" /> {dayjs(notice.created_at).format('DD MMM YYYY, HH:mm')}
      </div>
    </Card>
  )
}
