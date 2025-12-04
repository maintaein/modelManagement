// Model 관련 TypeScript 타입 및 Zod 스키마
import { z } from 'zod';
import { Category } from '@prisma/client';

// ==================== Zod 스키마 ====================

// 카테고리 스키마
export const categorySchema = z.nativeEnum(Category);

// 모델 생성 스키마 (클라이언트에서 받는 데이터)
export const createModelSchema = z.object({
  name: z.string().min(1, '모델 이름은 필수입니다'),
  slug: z.string()
    .min(1, 'Slug는 필수입니다')
    .regex(/^[a-z0-9-]+$/, 'Slug는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  category: categorySchema,
  nationality: z.string().optional(),
  profileImage: z.string().url('올바른 URL 형식이 아닙니다').optional(),
  images: z.array(z.string().url()).optional(),
  bio: z.string().optional(),
  height: z.string().optional(),
  measurements: z.string().optional(),
  instagram: z.string().optional(),
});

// 모델 업데이트 스키마 (모든 필드 optional)
export const updateModelSchema = createModelSchema.partial();

// 아카이브 생성 스키마
export const createArchiveSchema = z.object({
  title: z.string().min(1, '아카이브 제목은 필수입니다'),
  brand: z.string().optional(),
  images: z.array(z.string().url()).min(1, '최소 1개 이상의 이미지가 필요합니다'),
  modelId: z.string().uuid('올바른 모델 ID가 아닙니다'),
});

// 아카이브 업데이트 스키마
export const updateArchiveSchema = createArchiveSchema.partial().omit({ modelId: true });

// 관리자 로그인 스키마
export const adminLoginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
});

// 관리자 생성 스키마
export const createAdminSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '비밀번호는 최소 1개의 대문자를 포함해야 합니다')
    .regex(/[a-z]/, '비밀번호는 최소 1개의 소문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호는 최소 1개의 숫자를 포함해야 합니다'),
  name: z.string().optional(),
});

// ==================== TypeScript 타입 ====================

// Zod 스키마로부터 추론된 타입
export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type CreateArchiveInput = z.infer<typeof createArchiveSchema>;
export type UpdateArchiveInput = z.infer<typeof updateArchiveSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

// Prisma 모델 타입 확장 (이미지 배열 처리)
export interface ModelWithImages {
  id: string;
  name: string;
  slug: string;
  category: Category;
  nationality: string | null;
  profileImage: string | null;
  images: string[] | null; // JSON 필드 타입 명시
  bio: string | null;
  height: string | null;
  measurements: string | null;
  instagram: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 아카이브와 함께 있는 모델 타입
export interface ModelWithArchives extends ModelWithImages {
  archives: ArchiveWithImages[];
}

// 아카이브 타입 확장
export interface ArchiveWithImages {
  id: string;
  title: string;
  brand: string | null;
  images: string[]; // JSON 필드 타입 명시
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 모델과 함께 있는 아카이브 타입
export interface ArchiveWithModel extends ArchiveWithImages {
  model: ModelWithImages;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// 모델 필터 파라미터
export interface ModelFilterParams {
  category?: Category;
  search?: string;
  page?: number;
  limit?: number;
}

// 아카이브 필터 파라미터
export interface ArchiveFilterParams {
  modelId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
