import { useState, useEffect } from 'react'
import { X, Loader2, Image, Video, FileText, Instagram, Youtube, Twitter, Facebook, Linkedin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Input, Textarea, Badge } from '@/components/ui'
import { AssetUpload } from './AssetUpload'
import api from '@/lib/api'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'tiktok', label: 'TikTok', icon: null, emoji: '🎵', color: 'bg-black' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-500' },
  { id: 'twitter', label: 'X/Twitter', icon: Twitter, color: 'bg-blue-400' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'bluesky', label: 'Bluesky', icon: null, emoji: '🦋', color: 'bg-sky-400' },
  { id: 'threads', label: 'Threads', icon: null, emoji: '🧵', color: 'bg-gray-700' },
]

const FORMATS = [
  { id: 'image', label: 'Image', icon: Image, description: 'Single image post' },
  { id: 'video', label: 'Video', icon: Video, description: 'Video content' },
  { id: 'carousel', label: 'Carousel', icon: Image, description: 'Multiple images' },
  { id: 'reel', label: 'Reel/Short', icon: Video, description: 'Short-form video' },
  { id: 'story', label: 'Story', icon: Image, description: '24-hour content' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Text-only post' },
]

export function CreateAssetModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1) // 1: info, 2: files, 3: review
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState('')
  const [format, setFormat] = useState('')
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [files, setFiles] = useState([])

  // Created asset
  const [createdAsset, setCreatedAsset] = useState(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow closing animation
      setTimeout(() => {
        setStep(1)
        setName('')
        setDescription('')
        setPlatform('')
        setFormat('')
        setCaption('')
        setTags('')
        setFiles([])
        setCreatedAsset(null)
        setError(null)
      }, 300)
    }
  }, [isOpen])

  const handleCreateAsset = async () => {
    if (!name.trim() || !platform || !format) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create the asset
      const response = await api.createAsset({
        name: name.trim(),
        description: description.trim(),
        platform,
        format,
      })

      const asset = response.asset
      setCreatedAsset(asset)

      // If we have files, upload them
      if (files.length > 0) {
        setStep(2)
        await uploadFiles(asset.id, asset.current_version_id || asset.version_id)
      } else if (caption || tags) {
        // Add caption and tags if provided
        await addMetadata(asset.id, asset.current_version_id || asset.version_id)
        onSuccess?.(asset)
        onClose()
      } else {
        onSuccess?.(asset)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Failed to create asset')
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async (assetId, versionId) => {
    setUploading(true)

    try {
      // Update file statuses to uploading
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })))

      // Get raw files for upload
      const rawFiles = files.map(f => f.file)

      const result = await api.uploadAssetFiles(assetId, versionId, rawFiles)

      // Update file statuses based on result
      setFiles(prev => prev.map((f, i) => {
        const uploadedFile = result.files?.[i]
        if (uploadedFile?.error) {
          return { ...f, status: 'error', error: uploadedFile.message }
        }
        return { ...f, status: 'success' }
      }))

      // Add caption and tags
      await addMetadata(assetId, versionId)

      // Success!
      setStep(3)
      setTimeout(() => {
        onSuccess?.(createdAsset)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to upload files')
      setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: 'Upload failed' })))
    } finally {
      setUploading(false)
    }
  }

  const addMetadata = async (assetId, versionId) => {
    try {
      // Add caption
      if (caption.trim()) {
        await api.addAssetCaption(assetId, versionId, {
          caption: caption.trim(),
          locale: 'en',
          isPrimary: true,
        })
      }

      // Add tags
      if (tags.trim()) {
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
        if (tagList.length > 0) {
          await api.addAssetTags(assetId, versionId, tagList)
        }
      }
    } catch (err) {
      console.error('Failed to add metadata:', err)
      // Non-fatal, don't throw
    }
  }

  const canProceed = name.trim() && platform && format

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => !loading && !uploading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-xl font-semibold">Create New Asset</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {step === 1 && 'Add details for your content'}
              {step === 2 && 'Uploading your files...'}
              {step === 3 && 'Asset created successfully!'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading || uploading}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Asset Name <span className="text-red-400">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Summer Campaign Reel"
                  autoFocus
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Platform <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                          platform === p.id
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", p.color)}>
                          {Icon ? <Icon className="w-4 h-4" /> : <span className="text-sm">{p.emoji}</span>}
                        </div>
                        <span className="text-xs">{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Format <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((f) => {
                    const Icon = f.icon
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center",
                          format === f.id
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", format === f.id ? "text-teal-400" : "text-[var(--text-muted)]")} />
                        <span className="text-sm font-medium">{f.label}</span>
                        <span className="text-xs text-[var(--text-muted)]">{f.description}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this asset..."
                  rows={2}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Files</label>
                <AssetUpload
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={format === 'carousel' ? 10 : format === 'video' || format === 'reel' ? 1 : 5}
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium mb-2">Caption</label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  rows={3}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {caption.length} characters
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="fashion, summer, lifestyle (comma separated)"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-8 text-center">
              <Loader2 className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Uploading Files</h3>
              <p className="text-[var(--text-secondary)]">
                Please wait while we upload your content...
              </p>

              {/* File progress */}
              <div className="mt-6 space-y-2 text-left">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      file.status === 'success' ? 'bg-green-500/10' :
                      file.status === 'error' ? 'bg-red-500/10' :
                      'bg-[var(--bg-secondary)]'
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-[var(--bg-card)] flex items-center justify-center">
                      {file.isImage ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                    </div>
                    {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-teal-400" />}
                    {file.status === 'success' && <Badge variant="success">Done</Badge>}
                    {file.status === 'error' && <Badge variant="error">Failed</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Asset Created!</h3>
              <p className="text-[var(--text-secondary)]">
                Your content has been saved successfully.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="flex justify-end gap-3 p-5 border-t border-[var(--border-color)]">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreateAsset} disabled={!canProceed || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : files.length > 0 ? (
                'Create & Upload'
              ) : (
                'Create Asset'
              )}
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  )
}
