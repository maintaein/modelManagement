import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

// Next.js Link Props + HTML anchor 속성
interface CustomLinkProps extends NextLinkProps {
  children: ReactNode;
  className?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick'];
  onMouseEnter?: AnchorHTMLAttributes<HTMLAnchorElement>['onMouseEnter'];
  onMouseLeave?: AnchorHTMLAttributes<HTMLAnchorElement>['onMouseLeave'];
}

/**
 * Next.js Link 컴포넌트 래퍼
 */
export function Link({
  children,
  className,
  href,
  target,
  rel,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CustomLinkProps) {
  // 외부 링크인 경우 보안 속성 자동 추가
  const isExternal = target === '_blank';
  const safeRel = isExternal ? 'noopener noreferrer' : rel;

  return (
    <NextLink
      href={href}
      target={target}
      rel={safeRel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'transition-opacity duration-300 hover:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
