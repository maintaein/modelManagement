'use client';

// React Query Provider 설정
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * React Query Provider 컴포넌트
 * - 클라이언트 사이드에서만 동작
 * - QueryClient 인스턴스를 컴포넌트 상태로 관리 (Hot Reload 대응)
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState로 QueryClient 생성 (컴포넌트 렌더링마다 재생성 방지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 쿼리 기본 옵션
            staleTime: 60 * 1000, // 1분 - 데이터가 fresh 상태로 유지되는 시간
            gcTime: 5 * 60 * 1000, // 5분 - 캐시에서 제거되기까지 시간 (cacheTime에서 이름 변경됨)
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
            retry: 1, // 실패 시 재시도 횟수
          },
          mutations: {
            // Mutation 기본 옵션
            retry: 0, // Mutation은 재시도하지 않음
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
