"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Download, ExternalLink, FileText, Calendar, HardDrive } from "lucide-react"

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

interface DocumentViewerProps {
  document: Document
  onDownload?: (filePath: string) => Promise<void>
}

export function DocumentViewer({ document, onDownload }: DocumentViewerProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!onDownload) return

    setDownloading(true)
    try {
      await onDownload(document.file_path)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloading(false)
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50"
      case "pending":
        return "bg-yellow-50"
      case "rejected":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        {/* PDF Preview Area */}
        <div className={`p-8 ${getStatusBgColor(document.status)} border-b border-border flex flex-col items-center justify-center min-h-64`}>
          <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <Text className="font-semibold mb-2 text-center">{document.file_name}</Text>
          <Text className="text-sm text-muted-foreground text-center mb-6">
            PDF Document • {formatFileSize(document.file_size)}
          </Text>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        {/* Document Details */}
        <div className="p-6">
          <Heading level={3} className="mb-6">
            Document Details
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Document Type */}
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase">Document Type</Text>
              <Text className="font-medium">{document.document_type?.name || "Unknown"}</Text>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase">Status</Text>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(document.status)}`}>
                <span className="capitalize">{document.status}</span>
              </div>
            </div>

            {/* Upload Date */}
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upload Date
              </Text>
              <Text className="font-medium">{formatDate(document.created_at)}</Text>
            </div>

            {/* File Size */}
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                File Size
              </Text>
              <Text className="font-medium">{formatFileSize(document.file_size)}</Text>
            </div>
          </div>

          {/* Rejection Reason */}
          {document.status === "rejected" && document.rejection_reason && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
              <Text className="text-sm font-semibold text-red-900 mb-2">Rejection Reason:</Text>
              <Text className="text-sm text-red-800">{document.rejection_reason}</Text>
              <Text className="text-xs text-red-700 mt-3">
                Please review the feedback above and upload a corrected version if needed.
              </Text>
            </div>
          )}

          {/* Approval Message */}
          {document.status === "approved" && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 mb-6">
              <Text className="text-sm font-semibold text-emerald-900 mb-1">✓ Document Approved</Text>
              <Text className="text-sm text-emerald-800">
                This document has been reviewed and approved by the property owner.
              </Text>
            </div>
          )}

          {/* Pending Message */}
          {document.status === "pending" && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-6">
              <Text className="text-sm font-semibold text-yellow-900 mb-1">⏳ Pending Review</Text>
              <Text className="text-sm text-yellow-800">
                Your document is awaiting review from the property owner. You'll be notified once it's been reviewed.
              </Text>
            </div>
          )}

          {/* Download Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-lg"
              onClick={() => window.open(document.file_path, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View in New Tab
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
