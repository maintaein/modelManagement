// 공통 유틸리티 함수
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * - clsx: 조건부 클래스 결합
 * - twMerge: Tailwind 클래스 충돌 해결
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 문자열을 URL-safe slug로 변환
 * @param text - 변환할 문자열
 * @returns URL-safe slug (소문자, 하이픈으로 연결)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백, 언더스코어를 하이픈으로
    .replace(/^-+|-+$/g, ''); // 앞뒤 하이픈 제거
}

/**
 * 날짜를 로케일 문자열로 포맷
 * @param date - Date 객체 또는 ISO 문자열
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(
  date: Date | string,
  locale: string = 'ko-KR',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 * @param bytes - 바이트 크기
 * @param decimals - 소수점 자리수 (기본값: 2)
 * @returns 포맷된 파일 크기 문자열 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * debounce 함수
 * - 연속된 호출을 지연시켜 마지막 호출만 실행
 * @param func - 실행할 함수
 * @param wait - 대기 시간 (밀리초)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 배열을 청크(chunk)로 분할
 * @param array - 분할할 배열
 * @param size - 청크 크기
 * @returns 청크 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 랜덤 문자열 생성
 * @param length - 문자열 길이
 * @returns 랜덤 문자열
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * JSON 안전하게 파싱
 * @param json - JSON 문자열
 * @param fallback - 파싱 실패 시 반환할 기본값
 * @returns 파싱된 객체 또는 기본값
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 이미지 URL 배열을 JSON 문자열로 변환
 * @param images - 이미지 URL 배열
 * @returns JSON 문자열 또는 null
 */
export function imagesToJson(images: string[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  return JSON.stringify(images);
}

/**
 * JSON 문자열을 이미지 URL 배열로 변환
 * @param json - JSON 문자열
 * @returns 이미지 URL 배열 또는 빈 배열
 */
export function jsonToImages(json: string | null | undefined): string[] {
  if (!json) return [];
  return safeJsonParse<string[]>(json, []);
}
