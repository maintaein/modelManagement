import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // 테스트 DB 연결
  await prisma.$connect();
});

beforeEach(async () => {
  // 각 테스트 전 DB 초기화
  await prisma.model.deleteMany();
  await prisma.archive.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

declare global {
  var prisma: PrismaClient | undefined;
}

global.prisma = prisma;

export {};
