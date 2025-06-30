"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  X,
  File,
  ImageIcon,
  FileText,
  Archive,
  Video,
  Music,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "../notifications/notification-provider"

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  url?: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/*",
    "application/zip",
    "application/x-rar-compressed",
  ],
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-blue-500" />
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5 text-blue-600" />
    if (type.includes("excel") || type.includes("sheet")) return <FileText className="w-5 h-5 text-green-600" />
    if (type.includes("zip") || type.includes("rar")) return <Archive className="w-5 h-5 text-orange-500" />
    if (type.startsWith("video/")) return <Video className="w-5 h-5 text-purple-500" />
    if (type.startsWith("audio/")) return <Music className="w-5 h-5 text-pink-500" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return "File type not supported"
    }

    return null
  }

  const simulateUpload = async (uploadedFile: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Simulate random upload success/failure (90% success rate)
          if (Math.random() > 0.1) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? { ...f, uploadProgress: 100, status: "completed", url: URL.createObjectURL(f.file) }
                  : f,
              ),
            )
            resolve()
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, status: "error", error: "Upload failed. Please try again." } : f,
              ),
            )
            reject(new Error("Upload failed"))
          }
        } else {
          setFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, uploadProgress: progress } : f)))
        }
      }, 200)
    })
  }

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      if (disabled) return

      const newFiles = Array.from(fileList)

      // Check total file count
      if (files.length + newFiles.length > maxFiles) {
        addNotification({
          title: "Too many files",
          message: `Maximum ${maxFiles} files allowed`,
          type: "warning",
        })
        return
      }

      const validFiles: UploadedFile[] = []
      const invalidFiles: string[] = []

      newFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          invalidFiles.push(`${file.name}: ${error}`)
        } else {
          const uploadedFile: UploadedFile = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadProgress: 0,
            status: "uploading",
          }
          validFiles.push(uploadedFile)
        }
      })

      if (invalidFiles.length > 0) {
        addNotification({
          title: "Some files were rejected",
          message: invalidFiles.join(", "),
          type: "error",
        })
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles]
        setFiles(updatedFiles)
        onFilesChange?.(updatedFiles)

        // Start uploads
        validFiles.forEach(async (file) => {
          try {
            await simulateUpload(file)
            addNotification({
              title: "File uploaded",
              message: `${file.name} uploaded successfully`,
              type: "success",
            })
          } catch (error) {
            addNotification({
              title: "Upload failed",
              message: `Failed to upload ${file.name}`,
              type: "error",
            })
          }
        })
      }
    },
    [files, maxFiles, disabled, addNotification, onFilesChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter((f) => f.id !== fileId)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    },
    [files, onFilesChange],
  )

  const retryUpload = useCallback(
    async (fileId: string) => {
      const file = files.find((f) => f.id === fileId)
      if (!file) return

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", uploadProgress: 0, error: undefined } : f)),
      )

      try {
        await simulateUpload(file)
        addNotification({
          title: "File uploaded",
          message: `${file.name} uploaded successfully`,
          type: "success",
        })
      } catch (error) {
        addNotification({
          title: "Upload failed",
          message: `Failed to upload ${file.name}`,
          type: "error",
        })
      }
    },
    [files, addNotification],
  )

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragActive ? "border-leoni-accent bg-leoni-accent/10" : "border-border hover:border-border/70",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center space-y-4">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              dragActive ? "bg-leoni-accent/20" : "bg-muted",
            )}
          >
            <Upload className={cn("w-8 h-8", dragActive ? "text-leoni-accent" : "text-muted-foreground")} />
          </div>

          <div>
            <p className="text-foreground font-medium mb-2">
              {dragActive ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-leoni-accent hover:underline font-medium"
                disabled={disabled}
              >
                browse files
              </button>
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Maximum {maxFiles} files, {maxFileSize}MB each
              </p>
              <p>Supported: Images, PDFs, Documents, Archives</p>
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>

          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="glass-panel border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* File Icon */}
                    <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <div className="flex items-center space-x-2">
                          {file.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {file.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                          {file.status === "uploading" && (
                            <Loader2 className="w-4 h-4 text-leoni-accent animate-spin" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                          {file.status === "error" && file.error && (
                            <span className="text-xs text-red-500">{file.error}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {file.status === "error" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => retryUpload(file.id)}
                              className="text-xs text-leoni-accent hover:bg-leoni-accent/10"
                            >
                              Retry
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(file.uploadProgress)}% uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
