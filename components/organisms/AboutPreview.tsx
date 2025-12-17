'use client';

import { useState, useEffect, useCallback } from 'react';
import { Image } from '@/components/atoms/Image';
import FadeContent from '@/components/bits/FadeContent';

export interface AboutSlide {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface AboutPreviewProps {
  slides: AboutSlide[];
  autoPlayInterval?: number;
}

const DEFAULT_SLIDES: AboutSlide[] = [
  {
    id: '1',
    title: 'LEADING MODEL AGENCY',
    description: 'We discover and develop the world\'s most promising models',
  },
  {
    id: '2',
    title: 'GLOBAL NETWORK',
    description: 'Connected with top fashion brands worldwide',
  },
  {
    id: '3',
    title: 'PROFESSIONAL MANAGEMENT',
    description: 'Dedicated support for every model\'s career',
  },
];

export function AboutPreview({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
}: AboutPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [nextSlide, autoPlayInterval]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
      {currentSlide.imageUrl && (
        <div className="absolute inset-0 opacity-10">
          <Image
            src={currentSlide.imageUrl}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      <FadeContent key={currentSlide.id} className="relative z-10 text-center px-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          {currentSlide.title}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-gray-700">
          {currentSlide.description}
        </p>
      </FadeContent>

      {/* 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-black' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
