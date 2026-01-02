"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Download, Trash2, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Document {
  id: string
  file_name: string
  file_path: string
  file_size: number
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  created_at: string
  document_type?: {
    id: string
    name: string
  }
}

interface DocumentListProps {
  documents: Document[]
  isLoading?: boolean
  onDelete?: (documentId: string) => Promise<void>
  onDownload?: (filePath: string) => Promise<void>
  userRole?: "tenant" | "landlord"
}

export function DocumentList({
  documents,
  isLoading = false,
  onDelete,
  onDownload,
  userRole = "tenant",
}: DocumentListProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleDelete = async () => {
    if (!selectedDocument || !onDelete) return

    setDeleting(true)
    try {
      await onDelete(selectedDocument.id)
      setDeleteConfirmOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = async (document: Document) => {
    if (!onDownload) return

    setDownloading(document.id)
    try {
      await onDownload(document.file_path)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloading(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canDelete = (doc: Document) => {
    return userRole === "tenant" && (doc.status === "pending" || doc.status === "rejected")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <Heading level={3} className="mb-2">
          No documents yet
        </Heading>
        <Text className="text-muted-foreground">
          {userRole === "tenant"
            ? "Upload your documents to get started"
            : "No documents to review at this time"}
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <Text className="font-semibold truncate">{document.file_name}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {document.document_type?.name} • {formatFileSize(document.file_size)}
                  </Text>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${getStatusColor(document.status)}`}>
                  {getStatusIcon(document.status)}
                  <span className="capitalize">{document.status}</span>
                </div>
                <Text className="text-xs text-muted-foreground">
                  {formatDate(document.created_at)}
                </Text>
              </div>

              {/* Rejection Reason */}
              {document.status === "rejected" && document.rejection_reason && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-3">
                  <Text className="text-xs font-semibold text-red-900 mb-1">Rejection Reason:</Text>
                  <Text className="text-sm text-red-800">{document.rejection_reason}</Text>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => handleDownload(document)}
                disabled={downloading === document.id}
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                {downloading === document.id ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>

              {canDelete(document) && (
                <Button
                  onClick={() => {
                    setSelectedDocument(document)
                    setDeleteConfirmOpen(true)
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Dialog */}
      {selectedDocument && (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent style={{ backgroundColor: "var(--card)" }}>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedDocument.file_name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
