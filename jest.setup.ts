import '@testing-library/jest-dom';
import { mockDeep, mockReset } from 'jest-mock-extended';
import type { PrismaClient } from '@prisma/client';
import React from 'react';

// Prisma Client 모킹
const prismaMock = mockDeep<PrismaClient>();

jest.mock('./lib/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

// NextAuth 모킹
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Next.js Image 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; sizes?: string; onLoad?: () => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, sizes, onLoad, ...imgProps } = props;
    // fill, priority, sizes는 Next.js Image의 커스텀 속성이므로 제거
    return React.createElement('img', imgProps);
  },
}));

// Next.js Link 모킹
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement('a', { href }, children);
  },
}));

beforeEach(() => {
  mockReset(prismaMock);
});
