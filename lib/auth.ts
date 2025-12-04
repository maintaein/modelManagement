// NextAuth 설정 및 인증 관련 유틸리티
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { adminLoginSchema } from '@/types';

/**
 * NextAuth 설정
 * - JWT 세션 전략 사용 (서버리스 환경 최적화)
 * - Credentials Provider로 관리자 로그인
 */
export const authOptions: NextAuthOptions = {
  // JWT 세션 전략 (데이터베이스 세션보다 서버리스 환경에 적합)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // 인증 Provider 설정
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 입력값 검증
        const validatedFields = adminLoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error('Invalid email or password');
        }

        const { email, password } = validatedFields.data;

        // 관리자 조회
        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin) {
          throw new Error('Invalid email or password');
        }

        // 비밀번호 검증
        const isPasswordValid = await compare(password, admin.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // 인증 성공 - User 객체 반환
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],

  // 콜백 설정
  callbacks: {
    // JWT 콜백: 토큰에 사용자 정보 추가
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // Session 콜백: 세션에 사용자 정보 추가
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },

  // 커스텀 페이지 경로
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  // 개발 환경에서 디버그 모드 활성화
  debug: process.env.NODE_ENV === 'development',
};
