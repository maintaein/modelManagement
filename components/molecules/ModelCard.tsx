'use client';

import { useState, useCallback } from 'react';
import { Image } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';

export interface ModelCardProps {
  id: string;
  name: string;
  imageUrl: string;
  activity?: string;
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  featured?: boolean;
  onClick?: (id: string) => void;
  className?: string;
  overlayColor?: string;
}

/**
 * 모델 카드 컴포넌트
 * 기본: 모델 사진만 표시, 하단에 이름
 * 호버: 오버레이로 모델의 상세 정보 표시
 */
export function ModelCard({
  id,
  name,
  imageUrl,
  activity,
  height,
  bust,
  waist,
  hip,
  shoes,
  hair,
  eyes,
  featured = false,
  onClick,
  className,
  overlayColor = 'bg-gradient-to-br from-red-600 to-red-800',
}: ModelCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onClick?.(id);
    },
    [id, onClick]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const measurements = [
    { label: 'ACTIVITY', value: activity },
    { label: 'HEIGHT', value: height },
    { label: 'BUST', value: bust },
    { label: 'WAIST', value: waist },
    { label: 'HIP', value: hip },
    { label: 'SHOES', value: shoes },
    { label: 'HAIR', value: hair },
    { label: 'EYES', value: eyes },
  ].filter((m) => m.value);

  return (
    <div
      className={cn(
        'relative aspect-[3/4] overflow-hidden cursor-pointer group',
        className
      )}
      onClick={handleClick}
    >
      {/* 모델 이미지 */}
      <Image
        src={imageUrl}
        alt={`${name} model photo`}
        fill
        className={cn(
          'object-cover transition-all duration-500 group-hover:scale-105',
          !imageLoaded && 'opacity-0'
        )}
        onLoad={handleImageLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={featured}
      />

      {/* Featured 배지 (항상 표시) */}
      {featured && (
        <div className="absolute top-4 right-4 z-20 bg-black text-white text-xs font-semibold px-3 py-1 rounded">
          FEATURED
        </div>
      )}

      {/* 하단 이름 (기본 상태) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-xl font-bold text-black tracking-wide uppercase">
          {name}
        </h3>
      </div>

      {/* 호버 시 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-white',
          overlayColor
        )}
      >
        {/* 모델 이름 */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-wider uppercase">
          {name}
        </h2>

        {/* 모델 정보 */}
        {measurements.length > 0 && (
          <div className="w-full max-w-xs space-y-3">
            {measurements.map((m) => (
              <div key={m.label} className="flex justify-between items-center border-b border-white/30 pb-2">
                <span className="text-sm font-semibold tracking-wide opacity-90">
                  {m.label}
                </span>
                <span className="text-base font-medium">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 화살표 버튼 */}
        <button
          type="button"
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(id);
          }}
          aria-label={`View ${name} profile`}
        >
          <ArrowRight className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
}
