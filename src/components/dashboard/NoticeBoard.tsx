"use client"
import { useEffect, useState, useTransition } from "react"
import { getGlobalNotices, deleteGlobalNotice, updateGlobalNotice } from "@/lib/actions/notices"
import NoticeCard from "./NoticeCard"
import { Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function NoticeBoard({ editable = false }: { editable?: boolean }) {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Edit state
  const [editingNotice, setEditingNotice] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editMessage, setEditMessage] = useState("")
  const [editPriority, setEditPriority] = useState("normal")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editError, setEditError] = useState<string | null>(null)

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
      await deleteGlobalNotice(id)
      setNotices((prev) => prev.filter((n) => n.id !== id))
    } catch (err: any) {
      setError(err.message)
    } finally {
      /* no-op */
    }
  }

  function handleEditClick(notice: any) {
    setEditingNotice(notice)
    setEditTitle(notice.title)
    setEditMessage(notice.message)
    setEditPriority(notice.priority)
    setEditError(null)
    setIsEditOpen(true)
  }

  function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingNotice) return
    
    setEditError(null)
    const fd = new FormData()
    fd.append("title", editTitle)
    fd.append("message", editMessage)
    fd.append("priority", editPriority)

    startTransition(async () => {
      try {
        await updateGlobalNotice(editingNotice.id, fd)
        
        // Update local state
        setNotices((prev) => 
          prev.map((n) => 
            n.id === editingNotice.id 
              ? { ...n, title: editTitle, message: editMessage, priority: editPriority } 
              : n
          )
        )
        setIsEditOpen(false)
        setEditingNotice(null)
      } catch (err: any) {
        setEditError(err.message || "Failed to update notice")
      }
    })
  }

  return (
    <div className="grid gap-4">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onDelete={editable ? () => handleDelete(notice.id) : undefined}
          onEdit={editable ? () => handleEditClick(notice) : undefined}
        />
      ))}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent style={{ backgroundColor: 'var(--card)' }}>
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={4}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={editPriority} onValueChange={setEditPriority}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--card)' }}>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editError && (
              <Text size="sm" className="text-red-600">{editError}</Text>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} style={{ backgroundColor: "#7D8B6F", color: "#FFF" }}>
                {isPending ? "Updating..." : "Update Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
