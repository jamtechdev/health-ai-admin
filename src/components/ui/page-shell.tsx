import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  eyebrow?: string;
  title: string;
  titleColor?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  eyebrow,
  title,
  titleColor = 'text-red-500',
  description,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-brand-border/80 bg-surface/75 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
              {eyebrow}
            </p>
          )}
          <h2 className={cn("mt-1 text-2xl font-bold tracking-tight sm:text-3xl", titleColor)}>{title}</h2>
          {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{description}</p>}
        </div>
        {actions && (
          <div className="relative z-0 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
