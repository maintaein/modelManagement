'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SegmentControlProps {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
};

/**
 * 세그먼트 컨트롤 컴포넌트
 * 탭 형태의 선택 UI 제공
 */
export function SegmentControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  size = 'md',
  fullWidth = false,
}: SegmentControlProps) {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || options[0]?.value || ''
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return (
    <div
      className={cn(
        'inline-flex bg-gray-100 rounded-lg p-1 gap-1',
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = currentValue === option.value;
        const isDisabled = option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={isDisabled}
            onClick={() => !isDisabled && handleChange(option.value)}
            className={cn(
              'flex-1 rounded-md font-medium transition-all duration-200',
              sizeClasses[size],
              isSelected
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
              isDisabled && 'opacity-50 cursor-not-allowed',
              !isDisabled && !isSelected && 'hover:bg-gray-50'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
