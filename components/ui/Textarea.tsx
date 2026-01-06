'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`
            w-full rounded-lg border bg-white px-4 py-3 text-zinc-900
            placeholder:text-zinc-400 focus:outline-none focus:ring-2
            focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-900
            dark:text-zinc-100 dark:placeholder:text-zinc-500
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-200 dark:border-zinc-700'
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
