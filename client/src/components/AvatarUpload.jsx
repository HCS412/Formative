import { useState, useRef } from 'react';
import { Camera, X, Loader2, Upload } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';

export function AvatarUpload({ currentUrl, name, onUpload, onRemove, size = '2xl' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be under 5MB', 'error');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onUpload?.(data.avatarUrl);
        addToast('Profile photo updated!', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      addToast(error.message || 'Failed to upload photo', 'error');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async () => {
    if (!currentUrl && !preview) return;

    setUploading(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPreview(null);
        onRemove?.();
        addToast('Profile photo removed', 'success');
      } else {
        throw new Error(data.error || 'Failed to remove photo');
      }
    } catch (error) {
      addToast(error.message || 'Failed to remove photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
    '3xl': 'w-36 h-36',
  };

  return (
    <div
      className={`relative group ${sizeClasses[size]}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Avatar */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-4 ${dragOver ? 'ring-teal-400' : 'ring-teal-500/30'} transition-all`}>
        <Avatar
          src={preview || currentUrl}
          name={name}
          size={size}
          className="w-full h-full"
        />
      </div>

      {/* Overlay */}
      <div className={`
        absolute inset-0 flex items-center justify-center
        bg-black/60 rounded-full
        transition-opacity duration-200
        ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-teal-500 rounded-full hover:bg-teal-600 transition-colors"
              title="Upload photo"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            {(currentUrl || preview) && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drag indicator */}
      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-teal-500/20 rounded-full border-2 border-dashed border-teal-400">
          <Upload className="w-6 h-6 text-teal-400" />
        </div>
      )}
    </div>
  );
}

export default AvatarUpload;
