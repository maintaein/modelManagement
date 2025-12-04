// Prisma Client 싱글톤 패턴
import { PrismaClient } from '@prisma/client';

// global 타입 확장 (TypeScript strict mode)
declare global {
  var prisma: PrismaClient | undefined;
}

// Prisma Client 싱글톤
// 개발 환경: Hot Reload 시 재생성 방지 (global 사용)
// 프로덕션: 단일 인스턴스 사용
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
