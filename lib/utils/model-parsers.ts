/**
 * 모델 데이터 파싱 유틸리티 함수들
 */

/**
 * Prisma Json 필드의 이미지 배열을 문자열 배열로 파싱
 * @param images - Prisma Json 타입의 이미지 데이터
 * @returns 파싱된 이미지 URL 배열
 */
export function parseModelImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images;
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * measurements 문자열에서 개별 치수 추출
 * @param measurements - "B:34 W:24 H:34" 형식의 문자열
 * @returns 추출된 bust, waist, hip 값
 */
export interface ParsedMeasurements {
  bust?: string;
  waist?: string;
  hip?: string;
}

export function parseMeasurements(measurements: string | null): ParsedMeasurements {
  const str = measurements || '';

  const bustMatch = str.match(/B:(\d+)/);
  const waistMatch = str.match(/W:(\d+)/);
  const hipMatch = str.match(/H:(\d+)/);

  return {
    bust: bustMatch ? bustMatch[1] : undefined,
    waist: waistMatch ? waistMatch[1] : undefined,
    hip: hipMatch ? hipMatch[1] : undefined,
  };
}

/**
 * 이미지 배열에서 첫 번째 이미지 URL을 반환하거나 기본 플레이스홀더 반환
 * @param images - 이미지 URL 배열
 * @param placeholder - 기본 플레이스홀더 URL (기본값: '/images/placeholder.jpg')
 * @returns 첫 번째 이미지 URL 또는 플레이스홀더
 */
export function getFirstImageOrPlaceholder(
  images: string[],
  placeholder: string = '/images/placeholder.jpg'
): string {
  return images[0] || placeholder;
}
