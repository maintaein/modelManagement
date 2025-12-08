'use client';

import Carousel from '@/components/bits/Carousel';
import { Image } from '@/components/atoms/Image';

export interface CarouselModel {
  id: string;
  name: string;
  imageUrl: string;
  category?: string;
}

export interface ModelCarouselProps {
  models: CarouselModel[];
  onModelClick?: (modelId: string) => void;
}

export function ModelCarousel({ models, onModelClick }: ModelCarouselProps) {
  const carouselItems = models.map((model, index) => ({
    id: index + 1,
    title: model.name,
    description: model.category || 'Model',
    icon: (
      <div
        className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg"
        onClick={() => onModelClick?.(model.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onModelClick?.(model.id);
          }
        }}
      >
        <Image
          src={model.imageUrl}
          alt={`${model.name} model photo`}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{model.name}</h3>
          {model.category && (
            <p className="text-white/90 text-sm mt-1">{model.category}</p>
          )}
        </div>
      </div>
    ),
  }));

  if (models.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">No models available</p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Carousel items={carouselItems} baseWidth={300} loop />
    </section>
  );
}
