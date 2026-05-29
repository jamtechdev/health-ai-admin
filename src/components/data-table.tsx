'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  isLoading,
  search,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  onExport,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAll = () => {
    if (selected.length === data.length) setSelected([]);
    else setSelected(data.map((r) => r.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-button bg-surface-secondary" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onSearchChange && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search..."
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-card border border-brand-border bg-surface shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-text-secondary">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-14 text-center">
                  <div className="mx-auto max-w-sm rounded-card border border-dashed border-brand-border bg-surface-elevated/50 p-6 text-text-muted">
                    <p className="font-medium text-foreground">No data yet</p>
                    <p className="mt-1 text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-brand-border hover:bg-surface-elevated"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
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
                    <td key={col.key} className="px-4 py-3">
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

      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
