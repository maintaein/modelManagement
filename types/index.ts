// 타입 통합 export 파일
export type {
  CreateModelInput,
  UpdateModelInput,
  CreateArchiveInput,
  UpdateArchiveInput,
  AdminLoginInput,
  CreateAdminInput,
  ModelWithImages,
  ModelWithArchives,
  ArchiveWithImages,
  ArchiveWithModel,
  ApiResponse,
  PaginatedResponse,
  ModelFilterParams,
  ArchiveFilterParams,
} from './model';

export {
  categorySchema,
  createModelSchema,
  updateModelSchema,
  createArchiveSchema,
  updateArchiveSchema,
  adminLoginSchema,
  createAdminSchema,
} from './model';

// Prisma 기본 타입 re-export
export { Category } from '@prisma/client';
