import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      testMatch: ['**/__tests__/unit/**/*.test.{ts,tsx}'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['@swc/jest', {
          jsc: {
            parser: { syntax: 'typescript', tsx: true },
            transform: { react: { runtime: 'automatic' } },
          },
        }],
      },
      collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
      ],
      coverageThreshold: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },
    {
      displayName: 'integration',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.ts'],
      testMatch: ['**/__tests__/integration/**/*.test.{ts,tsx}'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
  ],
};

export default createJestConfig(customJestConfig);
