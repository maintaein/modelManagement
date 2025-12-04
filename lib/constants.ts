// 프로젝트 전역 상수
import { Category } from '@prisma/client';

/**
 * 카테고리 라벨 매핑
 * - Enum 값을 사용자 친화적인 라벨로 변환
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ALL]: 'All Models',
  [Category.INTOWN]: 'In Town',
  [Category.UPCOMING]: 'Upcoming',
};

/**
 * 카테고리 옵션 배열
 * - Select 컴포넌트에서 사용
 */
export const CATEGORY_OPTIONS = [
  { value: Category.ALL, label: CATEGORY_LABELS[Category.ALL] },
  { value: Category.INTOWN, label: CATEGORY_LABELS[Category.INTOWN] },
  { value: Category.UPCOMING, label: CATEGORY_LABELS[Category.UPCOMING] },
] as const;

/**
 * 페이지네이션 기본값
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

/**
 * API 엔드포인트
 */
export const API_ROUTES = {
  // 모델 관련
  MODELS: '/api/models',
  MODEL_BY_ID: (id: string) => `/api/models/${id}`,
  MODEL_BY_SLUG: (slug: string) => `/api/models/slug/${slug}`,

  // 아카이브 관련
  ARCHIVES: '/api/archives',
  ARCHIVE_BY_ID: (id: string) => `/api/archives/${id}`,
  ARCHIVES_BY_MODEL: (modelId: string) => `/api/archives?modelId=${modelId}`,

  // 관리자 관련
  ADMINS: '/api/admin/admins',
  ADMIN_BY_ID: (id: string) => `/api/admin/admins/${id}`,

  // 업로드
  UPLOAD: '/api/upload',
} as const;

/**
 * 페이지 경로
 */
export const ROUTES = {
  // 공개 페이지
  HOME: '/',
  MODELS: '/models',
  MODEL_DETAIL: (slug: string) => `/models/${slug}`,
  ARCHIVES: '/archives',
  CONTACT: '/contact',

  // 관리자 페이지
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MODELS: '/admin/models',
  ADMIN_MODEL_CREATE: '/admin/models/create',
  ADMIN_MODEL_EDIT: (id: string) => `/admin/models/${id}/edit`,
  ADMIN_ARCHIVES: '/admin/archives',
  ADMIN_ARCHIVE_CREATE: '/admin/archives/create',
  ADMIN_ARCHIVE_EDIT: (id: string) => `/admin/archives/${id}/edit`,
  ADMIN_SETTINGS: '/admin/settings',
} as const;

/**
 * 파일 업로드 제한
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  THEME: 'taylor-theme',
  ADMIN_PREFERENCES: 'taylor-admin-preferences',
} as const;

/**
 * 에러 메시지
 */
export const ERROR_MESSAGES = {
  // 공통 에러
  GENERIC: '오류가 발생했습니다. 다시 시도해주세요.',
  NETWORK: '네트워크 연결을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',

  // 모델 관련
  MODEL_NOT_FOUND: '모델을 찾을 수 없습니다.',
  MODEL_CREATE_FAILED: '모델 생성에 실패했습니다.',
  MODEL_UPDATE_FAILED: '모델 수정에 실패했습니다.',
  MODEL_DELETE_FAILED: '모델 삭제에 실패했습니다.',
  MODEL_SLUG_DUPLICATE: '이미 사용 중인 Slug입니다.',

  // 아카이브 관련
  ARCHIVE_NOT_FOUND: '아카이브를 찾을 수 없습니다.',
  ARCHIVE_CREATE_FAILED: '아카이브 생성에 실패했습니다.',
  ARCHIVE_UPDATE_FAILED: '아카이브 수정에 실패했습니다.',
  ARCHIVE_DELETE_FAILED: '아카이브 삭제에 실패했습니다.',

  // 관리자 관련
  ADMIN_NOT_FOUND: '관리자를 찾을 수 없습니다.',
  ADMIN_CREATE_FAILED: '관리자 생성에 실패했습니다.',
  ADMIN_EMAIL_DUPLICATE: '이미 사용 중인 이메일입니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',

  // 업로드 관련
  UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  FILE_TOO_LARGE: '파일 크기가 너무 큽니다.',
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.',
} as const;

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  // 모델 관련
  MODEL_CREATED: '모델이 생성되었습니다.',
  MODEL_UPDATED: '모델이 수정되었습니다.',
  MODEL_DELETED: '모델이 삭제되었습니다.',

  // 아카이브 관련
  ARCHIVE_CREATED: '아카이브가 생성되었습니다.',
  ARCHIVE_UPDATED: '아카이브가 수정되었습니다.',
  ARCHIVE_DELETED: '아카이브가 삭제되었습니다.',

  // 관리자 관련
  ADMIN_CREATED: '관리자가 생성되었습니다.',
  ADMIN_UPDATED: '관리자가 수정되었습니다.',
  ADMIN_DELETED: '관리자가 삭제되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',

  // 업로드 관련
  UPLOAD_SUCCESS: '파일이 업로드되었습니다.',
} as const;

/**
 * React Query 키
 */
export const QUERY_KEYS = {
  // 모델 관련
  MODELS: 'models',
  MODEL: (id: string) => ['model', id] as const,
  MODEL_BY_SLUG: (slug: string) => ['model', 'slug', slug] as const,

  // 아카이브 관련
  ARCHIVES: 'archives',
  ARCHIVE: (id: string) => ['archive', id] as const,
  ARCHIVES_BY_MODEL: (modelId: string) => ['archives', 'model', modelId] as const,

  // 관리자 관련
  ADMINS: 'admins',
  ADMIN: (id: string) => ['admin', id] as const,
  CURRENT_ADMIN: 'current-admin',
} as const;
