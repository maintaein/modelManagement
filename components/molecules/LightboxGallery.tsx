'use client';

import { useState, useCallback, useEffect } from 'react';
import { Image } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { KeyboardEvent } from 'react';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface LightboxGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose?: () => void;
  className?: string;
}

/**
 * 라이트박스 갤러리 컴포넌트
 * 이미지를 전체 화면으로 보여주는 갤러리
 */
export function LightboxGallery({
  images,
  initialIndex = 0,
  onClose,
  className,
}: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const currentImage = images[currentIndex];

  const handlePrevious = useCallback(() => {
    setIsImageLoaded(false);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsImageLoaded(false);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    },
    [handleClose, handlePrevious, handleNext]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!currentImage) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/95 flex items-center justify-center',
        className
      )}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      tabIndex={0}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      {/* 이전 버튼 */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* 이미지 */}
      <div
        className="relative w-full h-full flex items-center justify-center p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-7xl max-h-full w-full h-full">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className={cn(
              'object-contain transition-opacity duration-300',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleImageLoad}
            sizes="100vw"
            priority
          />
        </div>

        {/* 캡션 */}
        {currentImage.caption && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm md:text-base">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* 다음 버튼 */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
