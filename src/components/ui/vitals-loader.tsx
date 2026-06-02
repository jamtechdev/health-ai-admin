import { Activity, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalsLoaderProps {
  label?: string;
  compact?: boolean;
  className?: string;
}

export function VitalsLoader({
  label = 'Reading live vitals',
  compact = false,
  className,
}: VitalsLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-brand-border/80 bg-surface/80 p-6 text-center shadow-soft',
        compact ? 'min-h-32' : 'min-h-72',
        className,
      )}
    >
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-brand-primary/25 bg-brand-primary/10 shadow-[0_0_40px_var(--primary-glow)]">
        <HeartPulse className="h-7 w-7 text-brand-primary" />
        <span className="absolute inset-0 rounded-3xl border border-brand-primary/30 animate-ping" />
      </div>
      <div className="relative h-10 w-full max-w-xs overflow-hidden rounded-full border border-brand-border bg-background/70 px-4">
        <div className="vitals-line absolute inset-y-0 left-0 flex items-center text-brand-secondary">
          <svg viewBox="0 0 220 40" className="h-10 w-56" aria-hidden="true">
            <polyline
              points="0,22 28,22 38,14 49,30 62,8 76,34 88,22 112,22 123,16 134,27 148,12 162,31 176,22 220,22"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
        <Activity className="h-3.5 w-3.5" />
        Syncing health signals
      </p>
    </div>
  );
}

export function VitalsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-card border border-brand-border/80 bg-surface shadow-soft">
      <div className="border-b border-brand-border/80 bg-surface-elevated/80 p-4">
        <div className="h-4 w-44 animate-pulse rounded-full bg-surface-secondary" />
      </div>
      <div className="divide-y divide-brand-border/70">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-4 h-4 animate-pulse rounded-full bg-surface-secondary" />
            <div className="col-span-3 h-4 animate-pulse rounded-full bg-surface-secondary/80" />
            <div className="col-span-2 h-4 animate-pulse rounded-full bg-brand-secondary/20" />
            <div className="col-span-3 h-4 animate-pulse rounded-full bg-surface-secondary/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
