'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
  autoplayDelay?: number;
}

export function ModelCarousel({
  models,
  onModelClick,
  autoplayDelay = 4000
}: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [totalProgress, setTotalProgress] = useState(() => 100 / models.length);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 이전 인덱스를 state로 관리
  const [prevIndex, setPrevIndex] = useState(0);

  // -2 위치에 있어야 할 모델 ID를 추적 (중간 전환용)
  const [transitioningModels, setTransitioningModels] = useState<Set<string>>(new Set());

  // currentIndex가 변경되면 이전 인덱스 업데이트 및 transitioning 계산
  useEffect(() => {
    if (prevIndex !== currentIndex) {
      const transitionSet = new Set<string>();

      models.forEach((model, index) => {
        const prevDiff = (index - prevIndex + models.length) % models.length;
        const currDiff = (index - currentIndex + models.length) % models.length;

        let prevPos: number;
        if (prevDiff === 0) prevPos = 0;
        else if (prevDiff === 1) prevPos = 1;
        else if (prevDiff === 2) prevPos = 2;
        else if (prevDiff === models.length - 1) prevPos = -1;
        else prevPos = -2;

        let currPos: number;
        if (currDiff === 0) currPos = 0;
        else if (currDiff === 1) currPos = 1;
        else if (currDiff === 2) currPos = 2;
        else if (currDiff === models.length - 1) currPos = -1;
        else currPos = -2;

        // -1에서 2로 전환되는 경우
        if (prevPos === -1 && currPos === 2) {
          transitionSet.add(model.id);
        }
      });

      if (transitionSet.size > 0) {
        // setTimeout으로 비동기 처리하여 ESLint 경고 해결
        const timer1 = setTimeout(() => {
          setTransitioningModels(transitionSet);
        }, 0);

        // 600ms 후 transitioning 해제하고 prevIndex 업데이트
        const timer2 = setTimeout(() => {
          setTransitioningModels(new Set());
          setPrevIndex(currentIndex);
        }, 600);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      } else {
        const timer = setTimeout(() => {
          setPrevIndex(currentIndex);
        }, 0);

        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, prevIndex, models]);

  // 자동 슬라이드 및 프로그레스 바
  useEffect(() => {
    if (models.length <= 1 || isHovered) {
      // 마우스 오버 시 프로그레스 정지
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    // 각 모델이 (100 / models.length)%씩 차지
    const segmentSize = 100 / models.length;

    // autoplayDelay 후에 다음 슬라이드로 전환 및 프로그레스 바 업데이트
    progressIntervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % models.length;

        // 프로그레스 바를 다음 세그먼트로 즉시 업데이트
        // 첫 번째 모델(index 0) → 33.3%, 두 번째(index 1) → 66.6%, 세 번째(index 2) → 100%
        const nextProgress = (nextIndex + 1) * segmentSize;
        setTotalProgress(nextProgress);

        // 무한 루프: 마지막 모델 후 첫 번째로 돌아갈 때
        if (nextIndex === 0) {
          // 100% → 0% → 33.3% 애니메이션을 위해 약간의 딜레이
          setTimeout(() => setTotalProgress(segmentSize), 50);
        }

        return nextIndex;
      });
    }, autoplayDelay);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, models.length, isHovered, autoplayDelay]);

  if (models.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">No models available</p>
      </section>
    );
  }

  const handleModelClick = (modelId: string) => {
    onModelClick?.(modelId);
  };

  // 각 모델의 위치 계산 (-2: 왼쪽 밖, -1: 왼쪽, 0: 중앙, 1: 오른쪽, 2: 오른쪽 밖)
  const getPosition = (index: number, modelId: string) => {
    // transitioning 중인 모델은 -2 위치 강제
    if (transitioningModels.has(modelId)) {
      return -2;
    }

    // 정규화된 diff 계산: 항상 양수로 만들어서 순환
    const normalizedDiff = (index - currentIndex + models.length) % models.length;

    if (normalizedDiff === 0) return 0; // 중앙
    if (normalizedDiff === 1) return 1; // 오른쪽 (다음 슬라이드)
    if (normalizedDiff === 2) return 2; // 오른쪽 대기 (화면 밖)
    if (normalizedDiff === models.length - 1) return -1; // 왼쪽 (이전 슬라이드)

    return -2; // 나머지는 모두 왼쪽 밖
  };

  return (
    <section
      className="relative py-16 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative flex items-center justify-center h-[600px]">
        {models.map((model, index) => {
          const position = getPosition(index, model.id);
          const isCenter = position === 0;
          const isLeftSide = position === -1;
          const isRightSide = position === 1;

          return (
            <motion.div
              key={model.id}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                x:
                  position === 0
                    ? '0%'
                    : position === 1
                      ? '400px'
                      : position === -1
                        ? '-400px'
                        : position === -2
                          ? '-800px' // 왼쪽으로 완전히 빠져나감
                          : '800px', // position === 2: 오른쪽 대기
                scale: isCenter ? 1 : 0.7,
                opacity: isCenter ? 1 : (isLeftSide || isRightSide) ? 0.5 : 0,
                zIndex: isCenter ? 10 : 5,
                height: isCenter ? 500 : 384,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
                zIndex: { duration: 0 },
              }}
              onClick={() => handleModelClick(model.id)}
              style={{ width: '384px' }}
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-lg"
                style={{
                  filter: isCenter ? 'grayscale(0%)' : 'grayscale(70%)',
                  transition: 'filter 0.6s ease-in-out',
                }}
              >
                <Image
                  src={model.imageUrl}
                  alt={`${model.name} model photo`}
                  fill
                  className="object-cover"
                />
                {!isCenter && <div className="absolute inset-0 bg-black/20" />}
                {isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-3xl font-bold">{model.name}</h3>
                    {model.category && (
                      <p className="text-white/90 text-lg mt-2">{model.category}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ width: '0%' }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  );
}
