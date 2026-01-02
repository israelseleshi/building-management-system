"use client"
import { useState, useTransition } from "react"
import { createGlobalNotice } from "@/lib/actions/notices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Text } from "@/components/ui/typography"

export default function NoticeManager() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("normal")
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const fd = new FormData()
    fd.append("title", title)
    fd.append("message", message)
    fd.append("priority", priority)
    startTransition(async () => {
      try {
        await createGlobalNotice(fd)
        setSuccess("Notice posted")
        setTitle("")
        setMessage("")
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <Input
        placeholder="Notice title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        required
      />
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent style={{ backgroundColor: 'var(--card)' }}>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
      {error && <Text size="sm" className="text-red-600">{error}</Text>}
      {success && <Text size="sm" className="text-green-600">{success}</Text>}
      <Button type="submit" disabled={pending} style={{ backgroundColor: "#7D8B6F", color: "#FFF" }}>
        {pending ? "Posting..." : "Post Notice"}
      </Button>
    </form>
  )
}
