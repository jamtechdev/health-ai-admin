'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminApiLogs } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { ApiLogRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';
import { toast } from 'sonner';

export default function ApiLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminApiLogs(page);
  const rows = data?.items ?? [];

  const columns: Column<ApiLogRecord>[] = [
    { key: 'method', header: 'Method' },
    { key: 'path', header: 'Path' },
    { key: 'statusCode', header: 'Status', render: (row) => row.statusCode ?? '—' },
    { key: 'durationMs', header: 'Duration', render: (row) => `${row.durationMs ?? 0}ms` },
    { key: 'user', header: 'User', render: (row) => row.User?.email ?? 'Anonymous' },
    { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/api-logs/${row.id}`)}
          className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="Observability"
      title="API Logs"
      description="Request-level observability for admin and mobile API traffic."
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        onExport={async () => {
          try {
            const result = await platformHealthService.adminApiLogs({ limit: 0, export: 1 });
            exportCsv(
              'api-logs.csv',
              result.items.map((row) => ({
                method: row.method,
                path: row.path,
                statusCode: row.statusCode,
                durationMs: row.durationMs,
                user: row.User?.email,
                createdAt: row.createdAt,
              })),
            );
            toast.success('Exported API logs');
          } catch {
            toast.error('Failed to export API logs');
          }
        }}
      />
    </PageShell>
  );
}
