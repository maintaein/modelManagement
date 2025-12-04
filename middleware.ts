// Next.js Middleware - 관리자 페이지 보호
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * NextAuth Middleware
 * - /admin 경로 보호 (로그인 페이지 제외)
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */
export default withAuth(
  function middleware(req) {
    // 인증된 사용자만 통과
    return NextResponse.next();
  },
  {
    callbacks: {
      // 인증 여부 확인
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

/**
 * Middleware 적용 경로 설정
 * - /admin으로 시작하는 모든 경로에 적용
 * - /admin/login은 제외 (로그인 페이지는 인증 불필요)
 */
export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/models/:path*',
    '/admin/archives/:path*',
    '/admin/settings/:path*',
  ],
};
