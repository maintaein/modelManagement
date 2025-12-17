import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  // 추가 스타일 옵션
  variant?: 'default' | 'dashed' | 'dotted';
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * shadcn Separator 확장 컴포넌트
 */
export function Divider({
  orientation = 'horizontal',
  className,
  variant = 'default',
  spacing = 'md',
}: DividerProps) {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  };

  const variantClasses = {
    default: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  return (
    <Separator
      orientation={orientation}
      className={cn(
        spacingClasses[spacing],
        variantClasses[variant],
        className
      )}
    />
  );
}
