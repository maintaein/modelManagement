import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

// Heading 레벨 타입
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// 폰트 굵기 타입
type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

// 줄 높이 타입
type LineHeight = 'tight' | 'normal' | 'relaxed' | 'loose';

// Heading Props
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

// Text Props
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
  size?: 'large' | 'base' | 'small' | 'caption';
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

// 반응형 폰트 사이즈 (UI.md 기준)
const headingSizes: Record<HeadingLevel, string> = {
  h1: 'text-[2rem] md:text-[3rem]', // Mobile: 32px, Desktop: 48px
  h2: 'text-[1.75rem] md:text-[2.5rem]', // Mobile: 28px, Desktop: 40px
  h3: 'text-[1.5rem] md:text-[2rem]', // Mobile: 24px, Desktop: 32px
  h4: 'text-[1.25rem] md:text-[1.5rem]', // Mobile: 20px, Desktop: 24px
  h5: 'text-[1.125rem] md:text-[1.25rem]', // Mobile: 18px, Desktop: 20px
  h6: 'text-[1rem] md:text-[1.125rem]', // Mobile: 16px, Desktop: 18px
};

const textSizes = {
  large: 'text-[1.125rem]', // 18px
  base: 'text-[1rem]', // 16px
  small: 'text-[0.875rem]', // 14px
  caption: 'text-[0.75rem]', // 12px
};

const fontWeights = {
  light: 'font-light', // 300
  regular: 'font-normal', // 400
  medium: 'font-medium', // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold', // 700
  black: 'font-black', // 900
};

const lineHeights = {
  tight: 'leading-tight', // 1.2
  normal: 'leading-normal', // 1.5
  relaxed: 'leading-relaxed', // 1.6
  loose: 'leading-loose', // 1.8
};

/**
 * Heading 컴포넌트 (h1-h6)
 */
export function Heading({
  level,
  children,
  className,
  weight = 'bold',
  lineHeight = 'tight',
  ...props
}: HeadingProps) {
  const Component = level;

  return (
    <Component
      className={cn(
        headingSizes[level],
        fontWeights[weight],
        lineHeights[lineHeight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Text 컴포넌트 (p)
 */
export function Text({
  children,
  className,
  size = 'base',
  weight = 'regular',
  lineHeight = 'normal',
  ...props
}: TextProps) {
  return (
    <p
      className={cn(
        textSizes[size],
        fontWeights[weight],
        lineHeights[lineHeight],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// 편의를 위한 개별 Heading 컴포넌트
export function H1(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h1" {...props} />;
}

export function H2(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h2" {...props} />;
}

export function H3(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h3" {...props} />;
}

export function H4(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h4" {...props} />;
}

export function H5(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h5" {...props} />;
}

export function H6(props: Omit<HeadingProps, 'level'>) {
  return <Heading level="h6" {...props} />;
}
