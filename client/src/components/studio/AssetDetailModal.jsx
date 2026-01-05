import { useState, useEffect } from 'react'
import {
  X, Loader2, Image, Video, FileText, Send, MessageSquare, Clock, Calendar, Edit3,
  Trash2, Upload, ChevronLeft, ChevronRight, Play, Plus, Check, AlertCircle, ExternalLink
} from 'lucide-react'
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'
import { Button, Badge, Textarea, Input } from '@/components/ui'
import { AssetUpload, AssetFileGrid } from './AssetUpload'
import api from '@/lib/api'

const STATUS_CONFIG = {
  draft: { label: 'Draft', variant: 'default', color: 'gray' },
  in_review: { label: 'In Review', variant: 'warning', color: 'orange' },
  approved: { label: 'Approved', variant: 'success', color: 'green' },
  changes_requested: { label: 'Changes Requested', variant: 'error', color: 'red' },
  scheduled: { label: 'Scheduled', variant: 'primary', color: 'blue' },
  live: { label: 'Live', variant: 'success', color: 'green' },
}

export function AssetDetailModal({ assetId, isOpen, onClose, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(true)
  const [asset, setAsset] = useState(null)
  const [versions, setVersions] = useState([])
  const [currentVersion, setCurrentVersion] = useState(null)
  const [files, setFiles] = useState([])
  const [feedback, setFeedback] = useState([])
  const [captions, setCaptions] = useState([])

  const [activeTab, setActiveTab] = useState('details') // details, files, feedback, versions
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // File upload state
  const [showUpload, setShowUpload] = useState(false)
  const [newFiles, setNewFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  // Feedback state
  const [newFeedback, setNewFeedback] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  // File viewer
  const [viewingFile, setViewingFile] = useState(null)
  const [viewingIndex, setViewingIndex] = useState(0)

  useEffect(() => {
    if (isOpen && assetId) {
      loadAssetData()
    }
  }, [isOpen, assetId])

  const loadAssetData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load asset details
      const assetData = await api.getAsset(assetId)
      setAsset(assetData.asset)
      setEditForm({
        name: assetData.asset.name,
        description: assetData.asset.description || '',
        platform: assetData.asset.platform,
        format: assetData.asset.format,
      })

      // Load versions
      const versionsData = await api.getAssetVersions(assetId)
      setVersions(versionsData.versions || [])
      const current = versionsData.versions?.find(v => v.is_current) || versionsData.versions?.[0]
      setCurrentVersion(current)

      // Load files for current version
      if (current) {
        const filesData = await api.getAssetFiles(assetId, current.id)
        setFiles(filesData.files || [])

        // Load feedback
        const feedbackData = await api.getAssetFeedback(assetId, current.id)
        setFeedback(feedbackData.feedback || [])
      }
    } catch (err) {
      console.error('Failed to load asset:', err)
      setError(err.message || 'Failed to load asset')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateAsset(assetId, editForm)
      setAsset(prev => ({ ...prev, ...editForm }))
      setEditing(false)
      onUpdate?.()
    } catch (err) {
      setError(err.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    setSaving(true)
    try {
      await api.submitAssetForReview(assetId, currentVersion.id)
      await loadAssetData()
      onUpdate?.()
    } catch (err) {
      setError(err.message || 'Failed to submit for review')
    } finally {
      setSaving(false)
    }
  }

  const handleUploadFiles = async () => {
    if (newFiles.length === 0) return

    setUploading(true)
    try {
      const rawFiles = newFiles.map(f => f.file)
      await api.uploadAssetFiles(assetId, currentVersion.id, rawFiles)

      // Reload files
      const filesData = await api.getAssetFiles(assetId, currentVersion.id)
      setFiles(filesData.files || [])

      setNewFiles([])
      setShowUpload(false)
      onUpdate?.()
    } catch (err) {
      setError(err.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (file) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      await api.removeAssetFile(file.id)
      setFiles(prev => prev.filter(f => f.id !== file.id))
      onUpdate?.()
    } catch (err) {
      setError(err.message || 'Failed to delete file')
    }
  }

  const handleAddFeedback = async () => {
    if (!newFeedback.trim()) return

    setSubmittingFeedback(true)
    try {
      await api.addAssetFeedback(assetId, currentVersion.id, {
        content: newFeedback.trim(),
        source: 'creator',
      })

      // Reload feedback
      const feedbackData = await api.getAssetFeedback(assetId, currentVersion.id)
      setFeedback(feedbackData.feedback || [])
      setNewFeedback('')
    } catch (err) {
      setError(err.message || 'Failed to add comment')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset? This cannot be undone.')) return

    try {
      await api.deleteAsset(assetId)
      onDelete?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to delete asset')
    }
  }

  const handleCreateVersion = async () => {
    try {
      await api.createAssetVersion(assetId)
      await loadAssetData()
      onUpdate?.()
    } catch (err) {
      setError(err.message || 'Failed to create new version')
    }
  }

  const navigateFile = (direction) => {
    const newIndex = viewingIndex + direction
    if (newIndex >= 0 && newIndex < files.length) {
      setViewingIndex(newIndex)
      setViewingFile(files[newIndex])
    }
  }

  if (!isOpen) return null

  const statusConfig = STATUS_CONFIG[asset?.status] || STATUS_CONFIG.draft

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          </div>
        ) : error && !asset ? (
          <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load asset</p>
            <p className="text-[var(--text-secondary)] mb-4">{error}</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        ) : asset ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-[var(--border-color)]">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-semibold mb-2"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-semibold mb-2 truncate">{asset.name}</h2>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  <Badge variant="outline" className="capitalize">{asset.platform}</Badge>
                  <Badge variant="outline" className="capitalize">{asset.format}</Badge>
                  <span className="text-sm text-[var(--text-muted)]">
                    v{currentVersion?.version_number || 1}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!editing && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-color)]">
              {['details', 'files', 'feedback', 'versions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-[2px]",
                    activeTab === tab
                      ? "text-teal-400 border-teal-400"
                      : "text-[var(--text-secondary)] border-transparent hover:text-white"
                  )}
                >
                  {tab}
                  {tab === 'feedback' && feedback.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">
                      {feedback.filter(f => !f.is_resolved).length}
                    </span>
                  )}
                  {tab === 'files' && (
                    <span className="ml-2 text-[var(--text-muted)]">{files.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-5 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
                <button onClick={() => setError(null)} className="float-right">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Description
                    </label>
                    {editing ? (
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-[var(--text-secondary)]">
                        {asset.description || 'No description'}
                      </p>
                    )}
                  </div>

                  {/* File Preview */}
                  {files.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Files
                      </label>
                      <AssetFileGrid
                        files={files.slice(0, 4)}
                        onFileClick={(file, index) => {
                          setViewingFile(file)
                          setViewingIndex(index)
                        }}
                      />
                      {files.length > 4 && (
                        <button
                          onClick={() => setActiveTab('files')}
                          className="mt-2 text-sm text-teal-400 hover:text-teal-300"
                        >
                          +{files.length - 4} more files
                        </button>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Created
                      </label>
                      <p className="text-sm">{formatDate(asset.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        Last Updated
                      </label>
                      <p className="text-sm">{formatRelativeTime(asset.updated_at)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Tab */}
              {activeTab === 'files' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Uploaded Files</h3>
                    <Button size="sm" variant="secondary" onClick={() => setShowUpload(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Add Files
                    </Button>
                  </div>

                  {showUpload && (
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <AssetUpload
                        files={newFiles}
                        onFilesChange={setNewFiles}
                        uploading={uploading}
                      />
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" size="sm" onClick={() => { setShowUpload(false); setNewFiles([]) }}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleUploadFiles} disabled={newFiles.length === 0 || uploading}>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Upload {newFiles.length} file{newFiles.length !== 1 ? 's' : ''}
                        </Button>
                      </div>
                    </div>
                  )}

                  {files.length === 0 ? (
                    <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl">
                      <Image className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                      <p className="text-[var(--text-secondary)]">No files uploaded yet</p>
                      <Button size="sm" className="mt-3" onClick={() => setShowUpload(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  ) : (
                    <AssetFileGrid
                      files={files}
                      editable
                      onFileClick={(file, index) => {
                        setViewingFile(file)
                        setViewingIndex(index)
                      }}
                      onRemove={handleDeleteFile}
                    />
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  {/* Add feedback */}
                  <div className="flex gap-2">
                    <Textarea
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      placeholder="Add a comment or feedback..."
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddFeedback}
                      disabled={!newFeedback.trim() || submittingFeedback}
                      className="self-end"
                    >
                      {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Feedback list */}
                  {feedback.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2 text-[var(--text-muted)]" />
                      <p>No feedback yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {feedback.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "p-4 rounded-xl border",
                            item.is_resolved
                              ? "bg-green-500/5 border-green-500/20"
                              : "bg-[var(--bg-secondary)] border-[var(--border-color)]"
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{item.user_name || 'User'}</span>
                              <Badge variant="outline" className="text-xs capitalize">{item.source}</Badge>
                              {item.is_resolved && (
                                <Badge variant="success" className="text-xs">Resolved</Badge>
                              )}
                            </div>
                            <span className="text-xs text-[var(--text-muted)]">
                              {formatRelativeTime(item.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{item.content}</p>
                          {item.timecode_start !== null && (
                            <p className="text-xs text-teal-400 mt-2">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {item.timecode_start}s - {item.timecode_end}s
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Versions Tab */}
              {activeTab === 'versions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Version History</h3>
                    <Button size="sm" variant="secondary" onClick={handleCreateVersion}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Version
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        className={cn(
                          "p-4 rounded-xl border transition-colors cursor-pointer",
                          version.is_current
                            ? "bg-teal-500/10 border-teal-500/30"
                            : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--text-muted)]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">Version {version.version_number}</span>
                            {version.is_current && <Badge variant="primary">Current</Badge>}
                            <Badge variant="outline" className="capitalize">{version.status}</Badge>
                          </div>
                          <span className="text-sm text-[var(--text-muted)]">
                            {formatDate(version.created_at)}
                          </span>
                        </div>
                        {version.review_notes && (
                          <p className="text-sm text-[var(--text-secondary)] mt-2">
                            {version.review_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-[var(--border-color)]">
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    {asset.status === 'draft' && (
                      <Button onClick={handleSubmitForReview} disabled={saving || files.length === 0}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Review
                      </Button>
                    )}
                    {asset.status === 'approved' && (
                      <Button>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    )}
                    {asset.status === 'changes_requested' && (
                      <Button onClick={() => { setActiveTab('files'); setShowUpload(true) }}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Version
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* File Viewer Overlay */}
      {viewingFile && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setViewingFile(null)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {files.length > 1 && (
            <>
              <button
                onClick={() => navigateFile(-1)}
                disabled={viewingIndex === 0}
                className="absolute left-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateFile(1)}
                disabled={viewingIndex === files.length - 1}
                className="absolute right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[80vh]">
            {viewingFile.mime_type?.startsWith('image/') ? (
              <img
                src={viewingFile.file_url}
                alt={viewingFile.file_name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : viewingFile.mime_type?.startsWith('video/') ? (
              <video
                src={viewingFile.file_url}
                controls
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            ) : (
              <div className="text-center text-white">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>{viewingFile.file_name}</p>
                <a
                  href={viewingFile.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-teal-400 hover:text-teal-300"
                >
                  Open file <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {viewingIndex + 1} of {files.length}
          </div>
        </div>
      )}
    </div>
  )
}
