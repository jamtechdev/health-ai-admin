'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { useAdminApiLogs } from '@/hooks/api/use-platform-health';
import type { ApiLogRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

const columns: Column<ApiLogRecord>[] = [
  { key: 'method', header: 'Method' },
  { key: 'path', header: 'Path' },
  { key: 'statusCode', header: 'Status', render: (row) => row.statusCode ?? '—' },
  { key: 'durationMs', header: 'Duration', render: (row) => `${row.durationMs ?? 0}ms` },
  { key: 'user', header: 'User', render: (row) => row.User?.email ?? 'Anonymous' },
  { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
];

export default function ApiLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminApiLogs(page);
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Logs</h2>
        <p className="text-slate-500">Request-level observability for admin and mobile APIs.</p>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        onExport={() =>
          exportCsv(
            'api-logs.csv',
            rows.map((row) => ({
              method: row.method,
              path: row.path,
              statusCode: row.statusCode,
              durationMs: row.durationMs,
              user: row.User?.email,
              createdAt: row.createdAt,
            })),
          )
        }
      />
    </div>
  );
}
