import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, Video, FileText, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export function AssetUpload({
  files = [],
  onFilesChange,
  maxFiles = 10,
  accept = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(','),
  disabled = false,
  uploading = false,
  uploadProgress = {},
  className,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  const validateFile = (file) => {
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only images and videos allowed.' }
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File too large. Maximum size is 100MB.' }
    }
    return { valid: true }
  }

  const processFiles = useCallback((newFiles) => {
    const filesToAdd = []
    const errors = []

    for (const file of newFiles) {
      if (files.length + filesToAdd.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        break
      }

      // Check for duplicates
      const isDuplicate = files.some(f => f.name === file.name && f.size === file.size)
      if (isDuplicate) {
        errors.push(`${file.name} is already added`)
        continue
      }

      const validation = validateFile(file)
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`)
        continue
      }

      // Create preview URL for images
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
      const preview = isImage ? URL.createObjectURL(file) : null

      filesToAdd.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isImage,
        isVideo,
        preview,
        status: 'pending', // pending, uploading, success, error
        error: null,
      })
    }

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd])
    }

    return errors
  }, [files, maxFiles, onFilesChange])

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (disabled || uploading) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    if (disabled || uploading) return
    const selectedFiles = Array.from(e.target.files)
    processFiles(selectedFiles)
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removeFile = (index) => {
    if (uploading) return
    const newFiles = [...files]
    // Revoke preview URL to prevent memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview)
    }
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    if (file.isImage) return <Image className="w-5 h-5 text-pink-400" />
    if (file.isVideo) return <Video className="w-5 h-5 text-purple-400" />
    return <FileText className="w-5 h-5 text-blue-400" />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
          "flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-teal-500 bg-teal-500/10"
            : "border-[var(--border-color)] hover:border-teal-500/50 hover:bg-[var(--bg-secondary)]",
          (disabled || uploading) && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
          isDragging ? "bg-teal-500/20" : "bg-[var(--bg-card)]"
        )}>
          <Upload className={cn(
            "w-8 h-8 transition-colors",
            isDragging ? "text-teal-400" : "text-[var(--text-muted)]"
          )} />
        </div>

        <p className="text-lg font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files'}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          or click to browse
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Images (JPEG, PNG, GIF, WebP) or Videos (MP4, MOV, WebM) • Max 100MB each
        </p>

        {files.length > 0 && (
          <p className="text-xs text-teal-400 mt-2">
            {files.length} of {maxFiles} files selected
          </p>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const progress = uploadProgress[file.name] || 0
            const isUploading = file.status === 'uploading'
            const isSuccess = file.status === 'success'
            const isError = file.status === 'error'

            return (
              <div
                key={`${file.name}-${index}`}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  isError
                    ? "bg-red-500/10 border-red-500/30"
                    : isSuccess
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-[var(--bg-card)] border-[var(--border-color)]"
                )}
              >
                {/* Preview or icon */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.isVideo ? (
                    <Video className="w-6 h-6 text-purple-400" />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{file.isImage ? 'Image' : file.isVideo ? 'Video' : 'File'}</span>
                  </div>

                  {/* Progress bar */}
                  {isUploading && (
                    <div className="mt-2 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {isError && file.error && (
                    <p className="text-xs text-red-400 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                  ) : isSuccess ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : isError ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Compact file preview grid for viewing uploaded assets
export function AssetFileGrid({ files = [], onFileClick, onRemove, editable = false }) {
  if (files.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {files.map((file, index) => {
        const isImage = file.mime_type?.startsWith('image/')
        const isVideo = file.mime_type?.startsWith('video/')
        const thumbnailUrl = file.metadata?.thumbnailUrl || file.thumbnailUrl
        const displayUrl = thumbnailUrl || (isImage ? file.file_url : null)

        return (
          <div
            key={file.id || index}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden border border-[var(--border-color)] group",
              onFileClick && "cursor-pointer"
            )}
            onClick={() => onFileClick?.(file, index)}
          >
            {displayUrl ? (
              <img
                src={displayUrl}
                alt={file.file_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
                {isVideo ? (
                  <Video className="w-8 h-8 text-purple-400" />
                ) : (
                  <FileText className="w-8 h-8 text-blue-400" />
                )}
              </div>
            )}

            {/* Primary badge */}
            {file.is_primary && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-teal-500 text-white text-xs font-medium">
                Primary
              </div>
            )}

            {/* Video indicator */}
            {isVideo && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs">
                Video
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {editable && onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(file, index)
                  }}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
