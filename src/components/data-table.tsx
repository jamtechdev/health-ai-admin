'use client';

import { useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VitalsTableSkeleton } from '@/components/ui/vitals-loader';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onExport?: () => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  search,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  onExport,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);
  const isDelayedLoading = useDelayedLoading(isLoading);

  const toggleAll = () => {
    if (selected.length === data.length) setSelected([]);
    else setSelected(data.map((r) => r.id));
  };

  if (isDelayedLoading) {
    return <VitalsTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {(onSearchChange || onExport) && (
        <div className="flex flex-col gap-3 rounded-card border border-brand-border/80 bg-surface/75 p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search records..."
                value={search ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 border-brand-border/80 bg-background/60 pl-9"
              />
            </div>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="h-11 w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-card border border-brand-border/80 bg-surface shadow-soft">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="sticky top-0 z-10 bg-surface-elevated/95 backdrop-blur">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-brand-border accent-brand-primary"
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-14 text-center">
                  <div className="mx-auto max-w-sm rounded-card border border-dashed border-brand-border bg-surface-elevated/50 p-7 text-text-muted">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary">
                      <Activity className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground">No data yet</p>
                    <p className="mt-1 text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-brand-border/70 transition-colors hover:bg-surface-elevated/70"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-brand-border accent-brand-primary"
                      checked={selected.includes(row.id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id],
                        )
                      }
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={`${row.id}-${col.key}`} className="px-4 py-3 align-middle text-text-secondary">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {onPageChange && data.length > 0 && (
        <div className="flex flex-col gap-3 rounded-card border border-brand-border/80 bg-surface/70 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={page <= 1}
              onClick={() => onPageChange(1)}
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={page >= totalPages}
              onClick={() => onPageChange(totalPages)}
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
