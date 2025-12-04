'use client';

// NextAuth Session Provider 래퍼
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

/**
 * NextAuth Session Provider 래퍼 컴포넌트
 * - 클라이언트 컴포넌트로 감싸서 사용
 * - 관리자 페이지 레이아웃에서 사용
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
