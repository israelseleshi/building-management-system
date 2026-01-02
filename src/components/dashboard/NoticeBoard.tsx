"use client"
import { useEffect, useState } from "react"
import { getGlobalNotices, deleteGlobalNotice } from "@/lib/actions/notices"
import NoticeCard from "./NoticeCard"
import { Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NoticeBoard({ editable = false }: { editable?: boolean }) {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getGlobalNotices()
        setNotices(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <Text>Loading notices...</Text>
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <Text size="sm">Failed to load notices</Text>
        <Button variant="outline" size="sm" onClick={() => location.reload()}>Retry</Button>
      </div>
    )
  }
  if (notices.length === 0) {
    return <Text>No notices at the moment.</Text>
  }

  async function handleDelete(id: string) {
    try {
      setDeleting(id)
      await deleteGlobalNotice(id)
      setNotices((prev) => prev.filter((n) => n.id !== id))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid gap-4">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onDelete={editable ? () => handleDelete(notice.id) : undefined}
        />
      ))}
    </div>
  )
}
