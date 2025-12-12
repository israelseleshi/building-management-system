"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Download, CheckCircle, XCircle, FileText, Clock, AlertCircle } from "lucide-react"
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
  tenant_id: string
  document_type?: {
    id: string
    name: string
  }
  tenant_name?: string
}

interface LandlordDocumentReviewProps {
  documents: Document[]
  isLoading?: boolean
  onApprove?: (documentId: string) => Promise<void>
  onReject?: (documentId: string, reason: string) => Promise<void>
  onDownload?: (filePath: string) => Promise<void>
  filterStatus?: "all" | "pending" | "approved" | "rejected"
}

export function LandlordDocumentReview({
  documents,
  isLoading = false,
  onApprove,
  onReject,
  onDownload,
  filterStatus = "pending",
}: LandlordDocumentReviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  const filteredDocuments = documents.filter((doc) => {
    if (filterStatus === "all") return true
    return doc.status === filterStatus
  })

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

  const handleApprove = async () => {
    if (!selectedDocument || !onApprove) return

    setApproving(true)
    try {
      await onApprove(selectedDocument.id)
      setReviewModalOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error("Approval failed:", error)
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedDocument || !onReject || !rejectionReason.trim()) return

    setRejecting(true)
    try {
      await onReject(selectedDocument.id, rejectionReason)
      setReviewModalOpen(false)
      setSelectedDocument(null)
      setRejectionReason("")
    } catch (error) {
      console.error("Rejection failed:", error)
    } finally {
      setRejecting(false)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <Heading level={3} className="mb-2">
          No documents to review
        </Heading>
        <Text className="text-muted-foreground">
          {filterStatus === "pending"
            ? "All documents have been reviewed"
            : `No ${filterStatus} documents at this time`}
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredDocuments.map((document) => (
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
                  <Text className="text-sm font-medium text-primary mt-1">
                    Tenant: {document.tenant_name || "Unknown"}
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

              {/* Rejection Reason Display */}
              {document.status === "rejected" && document.rejection_reason && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <Text className="text-xs font-semibold text-red-900 mb-1">Your Rejection Reason:</Text>
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

              {document.status === "pending" && (
                <Button
                  onClick={() => {
                    setSelectedDocument(document)
                    setRejectionReason("")
                    setReviewModalOpen(true)
                  }}
                  size="sm"
                  className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
                >
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Review Modal */}
      {selectedDocument && (
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
          <DialogContent className="max-w-2xl" style={{ backgroundColor: "var(--card)" }}>
            <DialogHeader>
              <DialogTitle>Review Document</DialogTitle>
              <DialogDescription>
                Review and approve or reject this document submission
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Document Info */}
              <div className="space-y-4">
                <div>
                  <Text className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Document Details
                  </Text>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium">File Name</Text>
                      <Text className="text-sm text-muted-foreground">{selectedDocument.file_name}</Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium">Document Type</Text>
                      <Text className="text-sm text-muted-foreground">
                        {selectedDocument.document_type?.name}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium">File Size</Text>
                      <Text className="text-sm text-muted-foreground">
                        {formatFileSize(selectedDocument.file_size)}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium">Uploaded</Text>
                      <Text className="text-sm text-muted-foreground">
                        {formatDate(selectedDocument.created_at)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  onClick={() => handleDownload(selectedDocument)}
                  disabled={downloading === selectedDocument.id}
                  variant="outline"
                  className="w-full rounded-lg"
                >
                  {downloading === selectedDocument.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Document
                    </>
                  )}
                </Button>
              </div>

              {/* Rejection Reason Input (only show if rejecting) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  placeholder="Explain why you're rejecting this document. Be specific so the tenant knows what to fix."
                  value={rejectionReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                  className="w-full min-h-24 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <Text className="text-xs text-muted-foreground">
                  Provide clear feedback to help the tenant resubmit a correct document
                </Text>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setReviewModalOpen(false)}
                disabled={approving || rejecting}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={approving || rejecting || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                {rejecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={approving || rejecting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                {approving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
