// 관리자 계정 생성 스크립트
// 사용법: npx tsx scripts/create-admin.ts
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

// CLI 입력 받기 위한 인터페이스
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promise 기반 질문 함수
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n=== 관리자 계정 생성 ===\n');

    // 이메일 입력
    const email = await question('이메일: ');
    if (!email || !email.includes('@')) {
      throw new Error('유효한 이메일을 입력해주세요.');
    }

    // 이메일 중복 확인
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 입력
    const password = await question('비밀번호 (최소 8자, 대소문자 + 숫자 포함): ');
    if (!password || password.length < 8) {
      throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
    }

    // 비밀번호 검증
    if (!/[A-Z]/.test(password)) {
      throw new Error('비밀번호는 최소 1개의 대문자를 포함해야 합니다.');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('비밀번호는 최소 1개의 소문자를 포함해야 합니다.');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('비밀번호는 최소 1개의 숫자를 포함해야 합니다.');
    }

    // 이름 입력 (선택)
    const name = await question('이름 (선택사항): ');

    // 비밀번호 해싱
    console.log('\n비밀번호 해싱 중...');
    const hashedPassword = await hash(password, 10);

    // 관리자 생성
    console.log('관리자 계정 생성 중...');
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    console.log('\n✅ 관리자 계정이 생성되었습니다!');
    console.log(`ID: ${admin.id}`);
    console.log(`이메일: ${admin.email}`);
    if (admin.name) {
      console.log(`이름: ${admin.name}`);
    }
    console.log(`생성일: ${admin.createdAt.toISOString()}\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ 오류: ${error.message}\n`);
    } else {
      console.error('\n❌ 알 수 없는 오류가 발생했습니다.\n');
    }
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// 스크립트 실행
createAdmin();
