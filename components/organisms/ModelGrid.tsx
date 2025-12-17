'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Image } from '@/components/atoms/Image';
import { SegmentControl, type SegmentOption } from '@/components/molecules/SegmentControl';
import type { Category } from '@prisma/client';

export interface GridModel {
  id: string;
  name: string;
  imageUrl: string;
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  category?: string;
  featured?: boolean;
}

export interface ModelGridProps {
  models: GridModel[];
  isLoading?: boolean;
  selectedCategory?: Category | 'ALL';
  onCategoryChange?: (category: string) => void;
  onModelClick?: (modelId: string) => void;
}

const CATEGORY_OPTIONS: SegmentOption[] = [
  { value: 'ALL', label: 'ALL' },
  { value: 'INTOWN', label: 'INTOWN' },
  { value: 'UPCOMING', label: 'UPCOMING' },
];

export function ModelGrid({
  models,
  isLoading = false,
  selectedCategory = 'ALL',
  onCategoryChange,
  onModelClick,
}: ModelGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (models.length === 0) {
    return (
      <section className="py-16 px-4 text-center">
        <p className="text-gray-500 text-lg">No models found</p>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 카테고리 필터 */}
        {onCategoryChange && (
          <div className="mb-8 flex justify-center">
            <SegmentControl
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={onCategoryChange}
            />
          </div>
        )}

        {/* 인스타그램 스타일 그리드 */}
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {models.map((model) => (
            <motion.div
              key={model.id}
              className="relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
              onMouseEnter={() => setHoveredId(model.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onModelClick?.(model.id)}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* 이미지 */}
              <Image
                src={model.imageUrl}
                alt={model.name}
                fill
                className="object-cover"
              />

              {/* 호버 오버레이 */}
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === model.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center text-white px-4">
                  <h3 className="text-lg md:text-xl font-bold mb-2">{model.name}</h3>
                  <div className="flex flex-wrap gap-2 md:gap-4 justify-center text-xs md:text-sm">
                    {model.height && <span>H: {model.height}</span>}
                    {model.bust && <span>B: {model.bust}</span>}
                    {model.waist && <span>W: {model.waist}</span>}
                    {model.hip && <span>H: {model.hip}</span>}
                  </div>
                  {model.category && (
                    <div className="mt-2 text-xs md:text-sm opacity-80">
                      {model.category}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Featured 배지 */}
              {model.featured && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  ★ FEATURED
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
