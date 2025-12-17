'use client';

import { useState, useCallback, useRef } from 'react';
import { Image } from '@/components/atoms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import type { ChangeEvent, DragEvent } from 'react';

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress?: number;
}

interface ImageUploaderProps {
  onUpload?: (files: File[]) => void;
  onRemove?: (id: string) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * 이미지 업로더 컴포넌트
 * 드래그 앤 드롭 및 파일 선택을 통한 이미지 업로드
 */
export function ImageUploader({
  onUpload,
  onRemove,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/jpeg,image/png,image/webp',
  multiple = true,
  className,
  disabled = false,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `파일 크기는 ${(maxSize / 1024 / 1024).toFixed(1)}MB를 초과할 수 없습니다.`;
      }

      const acceptedTypes = accept.split(',').map((t) => t.trim());
      if (!acceptedTypes.includes(file.type)) {
        return '지원하지 않는 파일 형식입니다.';
      }

      return null;
    },
    [maxSize, accept]
  );

  const processFiles = useCallback(
    (newFiles: File[]) => {
      setError('');

      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) {
        setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      const filesToProcess = newFiles.slice(0, remainingSlots);
      const validFiles: UploadedFile[] = [];

      for (const file of filesToProcess) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        };

        validFiles.push(uploadedFile);
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
        onUpload?.(validFiles.map((f) => f.file));
      }
    },
    [files.length, maxFiles, validateFile, onUpload]
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        return prev.filter((f) => f.id !== id);
      });
      onRemove?.(id);
      setError('');
    },
    [onRemove]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 업로드 영역 */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!disabled ? handleBrowseClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          이미지를 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-xs text-gray-500">
          최대 {maxFiles}개, 파일당 최대 {(maxSize / 1024 / 1024).toFixed(1)}MB
        </p>

        {error && (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        )}
      </div>

      {/* 업로드된 파일 미리보기 */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <Image
                src={file.preview}
                alt={file.file.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* 파일 정보 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                <ImageIcon className="text-white mb-2" size={24} />
                <p className="text-white text-xs text-center truncate w-full px-2">
                  {file.file.name}
                </p>
                <p className="text-white text-xs mt-1">
                  {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              {/* 삭제 버튼 */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(file.id);
                }}
                disabled={disabled}
              >
                <X size={14} />
              </Button>

              {/* 업로드 진행률 (옵션) */}
              {file.progress !== undefined && file.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
