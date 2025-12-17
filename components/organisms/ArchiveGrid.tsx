'use client';

import { useState } from 'react';
import { Image } from '@/components/atoms/Image';
import { LightboxGallery, type GalleryImage } from '@/components/molecules/LightboxGallery';
import AnimatedList from '@/components/bits/AnimatedList';

export interface ArchiveItem {
  id: string;
  imageUrl: string;
  brand?: string;
  modelName?: string;
  caption?: string;
}

export interface ArchiveGridProps {
  archives: ArchiveItem[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export function ArchiveGrid({
  archives,
  isLoading = false,
  columns = 2,
}: ArchiveGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages: GalleryImage[] = archives.map((archive) => ({
    id: archive.id,
    url: archive.imageUrl,
    alt: archive.brand && archive.modelName
      ? `${archive.brand} - ${archive.modelName}`
      : 'Archive photo',
    caption: archive.caption || (archive.brand && archive.modelName
      ? `${archive.brand} - ${archive.modelName}`
      : undefined),
  }));

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className={`grid ${gridColsClass} gap-4`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (archives.length === 0) {
    return (
      <section className="py-16 px-4 text-center">
        <p className="text-gray-500 text-lg">No archives found</p>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <AnimatedList
            items={archives.map((archive, index) => (
              <div
                key={archive.id}
                className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setLightboxIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setLightboxIndex(index);
                  }
                }}
              >
                <Image
                  src={archive.imageUrl}
                  alt={archive.brand && archive.modelName
                    ? `${archive.brand} - ${archive.modelName}`
                    : 'Archive photo'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {(archive.brand || archive.modelName) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    {archive.brand && (
                      <p className="text-white text-sm font-semibold">{archive.brand}</p>
                    )}
                    {archive.modelName && (
                      <p className="text-white/90 text-xs mt-1">{archive.modelName}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            className={`grid ${gridColsClass} gap-4`}
          />
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxGallery
          images={galleryImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
