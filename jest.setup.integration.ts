import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // 테스트 DB 연결
  console.log('🔌 Connecting to test database...');
  await prisma.$connect();
  console.log('✅ Test database connected');
});

afterAll(async () => {
  // 테스트 후 DB 정리
  await prisma.archive.deleteMany();
  await prisma.model.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.$disconnect();
  console.log('🔌 Disconnected from test database');
});

declare global {
  var prisma: PrismaClient | undefined;
}

global.prisma = prisma;

export {};
