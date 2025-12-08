'use client';

import { ModelCard } from '@/components/molecules/ModelCard';
import { SegmentControl, type SegmentOption } from '@/components/molecules/SegmentControl';
import AnimatedList from '@/components/bits/AnimatedList';
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
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* 카테고리 필터 */}
        {onCategoryChange && (
          <div className="mb-12 flex justify-center">
            <SegmentControl
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={onCategoryChange}
            />
          </div>
        )}

        {/* 모델 그리드 */}
        <AnimatedList
          items={models.map((model) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              imageUrl={model.imageUrl}
              height={model.height}
              bust={model.bust}
              waist={model.waist}
              hip={model.hip}
              featured={model.featured}
              onClick={onModelClick}
            />
          ))}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        />
      </div>
    </section>
  );
}
