"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, Trash2, File, ImageIcon, FileText } from "lucide-react"
import type { UploadedFile } from "./file-upload"

interface FilePreviewProps {
  files: UploadedFile[]
  onRemove?: (fileId: string) => void
  onDownload?: (file: UploadedFile) => void
  showActions?: boolean
}

export function FilePreview({ files, onRemove, onDownload, showActions = true }: FilePreviewProps) {
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-blue-500" />
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const canPreview = (file: UploadedFile) => {
    return file.type.startsWith("image/") || file.type === "application/pdf"
  }

  const renderPreview = (file: UploadedFile) => {
    if (file.type.startsWith("image/") && file.url) {
      return (
        <div className="max-w-full max-h-96 overflow-hidden rounded-lg">
          <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-auto object-contain" />
        </div>
      )
    }

    if (file.type === "application/pdf" && file.url) {
      return (
        <div className="w-full h-96">
          <iframe src={file.url} className="w-full h-full border rounded-lg" title={file.name} />
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {getFileIcon(file.type)}
        <p className="text-muted-foreground mt-2">Preview not available</p>
        <p className="text-sm text-muted-foreground">File type: {file.type}</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <File className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-muted-foreground">No files attached</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Attached Files ({files.length})</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="glass-panel border-border hover:border-leoni-accent/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getFileIcon(file.type)}</div>

                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-foreground truncate" title={file.name}>
                    {file.name}
                  </h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                    {file.status === "completed" && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Uploaded</Badge>
                    )}
                  </div>

                  {showActions && (
                    <div className="flex items-center space-x-1 mt-3">
                      {canPreview(file) && file.status === "completed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setPreviewFile(file)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-card/95 backdrop-blur-md border-border">
                            <DialogHeader>
                              <DialogTitle className="text-foreground flex items-center">
                                {getFileIcon(file.type)}
                                <span className="ml-2">{file.name}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">{renderPreview(file)}</div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {file.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => onDownload?.(file)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onRemove?.(file.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
