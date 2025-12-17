'use client';

import { useRef } from 'react';
import SplitText from '@/components/bits/SplitText';

export interface HeroVideoProps {
  videoSrc: string;
  title?: string;
  subtitle?: string;
  showScrollIndicator?: boolean;
}

export function HeroVideo({
  videoSrc,
  title = 'PLATINUM MANAGEMENT',
  subtitle,
  showScrollIndicator = true,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 배경 비디오 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Background video"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        {/* 타이틀 - SplitText 애니메이션 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center px-4">
          <SplitText
            text={title}
            className="inline-block"
            delay={100}
            duration={0.8}
            ease="power3.out"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
        </h1>

        {/* 서브타이틀 */}
        {subtitle && (
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-center px-4 opacity-90">
            {subtitle}
          </p>
        )}

        {/* 스크롤 인디케이터 */}
        {showScrollIndicator && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm tracking-widest">SCROLL</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
