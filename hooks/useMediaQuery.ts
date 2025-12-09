'use client';

import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 *
 * 미디어 쿼리 상태를 추적하는 커스텀 훅
 * 반응형 디자인을 위해 화면 크기 변경을 감지합니다.
 *
 * @param query - CSS 미디어 쿼리 문자열 (예: '(min-width: 768px)')
 * @returns 미디어 쿼리 매칭 여부 (boolean)
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  // SSR 환경에서는 초기값 false 반환
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    // SSR 환경 체크
    if (typeof window === 'undefined') {
      return;
    }

    const matchMedia = window.matchMedia(query);

    // 초기 상태 업데이트 (hydration 대비)
    setMatches(matchMedia.matches);

    // 미디어 쿼리 변경 이벤트 핸들러
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 이벤트 리스너 등록
    matchMedia.addEventListener('change', handleChange);

    // 클린업
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
