'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadHeroSliderImage, deleteHeroSliderImage } from '@/app/utils/storage';
import { useToast } from '@/app/utils/ToastContext';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  onImageDelete?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageChange,
  onImageDelete,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file || disabled) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadHeroSliderImage(file);
      onImageChange(imageUrl);
      showSuccess('Upload Successful', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      showError('Upload Failed', error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl || disabled) return;

    const confirmed = confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      await deleteHeroSliderImage(currentImageUrl);
      onImageDelete?.();
      showSuccess('Image Deleted', 'Image deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showError('Delete Failed', 'Failed to delete image');
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentImageUrl}
              alt="Current image"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Delete image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-400 hover:bg-orange-50'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-orange-100 rounded-full">
                {currentImageUrl ? (
                  <Upload className="w-6 h-6 text-orange-600" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentImageUrl ? 'Replace image' : 'Upload image'}
                </p>
                <p className="text-xs text-gray-500">
                  Drag & drop or click to browse
                </p>
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}