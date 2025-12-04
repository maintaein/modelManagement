// NextAuth 타입 확장
import 'next-auth';
import 'next-auth/jwt';

// NextAuth Session 및 User 타입 확장
declare module 'next-auth' {
  /**
   * NextAuth Session 타입 확장
   * - 관리자 정보 (id, email, name) 추가
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  /**
   * NextAuth User 타입 확장
   * - 관리자 정보 (id, email, name) 추가
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

// NextAuth JWT 타입 확장
declare module 'next-auth/jwt' {
  /**
   * NextAuth JWT 타입 확장
   * - 토큰에 관리자 정보 포함
   */
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
  }
}
