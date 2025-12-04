import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 이미지 허용 (프로덕션에서는 특정 도메인으로 제한 권장)
      },
    ],
  },

  // TypeScript 엄격 모드
  typescript: {
    ignoreBuildErrors: false, // 빌드 시 TypeScript 에러 무시하지 않음
  },

  // 실험적 기능
  experimental: {
    // 서버 액션 활성화 (기본값이지만 명시적으로 표시)
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  // 환경 변수 검증 (런타임에 필요한 환경 변수 확인)
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
