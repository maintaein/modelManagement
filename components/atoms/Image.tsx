import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// Next.js Image Props 확장
interface CustomImageProps extends Omit<NextImageProps, 'alt'> {
  alt: string; // alt를 필수로 강제
  className?: string;
}

/**
 * Next.js Image 컴포넌트 래퍼
 */
export function Image({ alt, className, ...props }: CustomImageProps) {
  return (
    <NextImage
      alt={alt}
      className={cn('object-cover', className)}
      {...props}
    />
  );
}
