import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[16px] border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
