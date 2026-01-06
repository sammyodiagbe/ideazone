'use client';

import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'p0' | 'p1' | 'p2' | 'success' | 'warning' | 'error';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  p0: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  p1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  p2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
