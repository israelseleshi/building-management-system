"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Text, Heading } from "@/components/ui/typography"
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface DocumentType {
  id: string
  name: string
  description: string
  is_required: boolean
}

interface TenantDocumentUploadProps {
  documentTypes: DocumentType[]
  onUploadSuccess?: () => void
  tenantId: string
}

export function TenantDocumentUpload({
  documentTypes,
  onUploadSuccess,
  tenantId,
}: TenantDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      setSelectedFile(null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setError("Please select both a document type and a file")
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("documentTypeId", selectedDocumentType)
      formData.append("tenantId", tenantId)

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session?.access_token) {
        setError("Unauthorized. Please sign in again.")
        setUploading(false)
        return
      }

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(Math.round(percentComplete))
        }
      })

      xhr.addEventListener("load", () => {
        // Helpful diagnostics
        const ok = xhr.status >= 200 && xhr.status < 300
        if (!ok) {
          console.error("[documents/upload] failed", {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
          })
        }

        if (ok) {
          setSuccess(true)
          setSelectedFile(null)
          setSelectedDocumentType("")
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
          onUploadSuccess?.()
          
          // Reset success message after 3 seconds
          setTimeout(() => setSuccess(false), 3000)
        } else {
          let message = "Upload failed"
          try {
            const response = JSON.parse(xhr.responseText || "{}")
            message = response.error || message
            if (response.debug) {
              console.error("[documents/upload] server debug:", response.debug)
            }
          } catch {
            // keep fallback
          }
          setError(message)
        }
        setUploading(false)
      })

      xhr.addEventListener("error", () => {
        console.error("[documents/upload] network error")
        setError("Upload failed. Please try again.")
        setUploading(false)
      })

      xhr.open("POST", "/api/documents/upload")
      xhr.setRequestHeader("Authorization", `Bearer ${sessionData.session.access_token}`)
      xhr.send(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const event = {
        target: {
          files: [file],
        },
      } as any
      handleFileSelect(event)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl p-6 border border-border" style={{ backgroundColor: "var(--card)" }}>
        <Heading level={3} className="mb-6">
          Upload Document
        </Heading>

        {/* Document Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-semibold mb-2 block">Document Type *</Label>
          {documentTypes.length === 0 ? (
            <div className="w-full px-4 py-2 border border-border rounded-lg bg-red-50 text-red-700 text-sm">
              Loading document types...
            </div>
          ) : (
            <select
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
            >
              <option value="">Select a document type...</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} {type.is_required ? "(Required)" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="mb-6 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <Text className="font-semibold mb-1">
              {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              PDF files only, max 10MB
            </Text>
          </button>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Text className="font-semibold text-blue-900">{selectedFile.name}</Text>
                <Text className="text-sm text-blue-700">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                disabled={uploading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <Text className="font-semibold text-red-900">Upload Error</Text>
              <Text className="text-sm text-red-700">{error}</Text>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <Text className="font-semibold text-green-900">Upload Successful</Text>
              <Text className="text-sm text-green-700">Your document has been uploaded and is pending review</Text>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm font-semibold">Uploading...</Text>
              <Text className="text-sm text-muted-foreground">{uploadProgress}%</Text>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedDocumentType || uploading}
          className="w-full bg-[#7D8B6F] hover:bg-[#6a7a5f] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>

        {/* Info Text */}
        <Text className="text-xs text-muted-foreground mt-4 text-center">
          Your document will be reviewed by the property owner. You'll be notified once it's approved or if changes are needed.
        </Text>
      </div>
    </div>
  )
}
