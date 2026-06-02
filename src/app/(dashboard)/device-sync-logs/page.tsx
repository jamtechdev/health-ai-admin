'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminSyncLogs } from '@/hooks/api/use-platform-health';
import type { DeviceSyncLogRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

const columns: Column<DeviceSyncLogRecord>[] = [
  { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
  { key: 'provider', header: 'Provider', render: (row) => row.provider.replace('_', ' ') },
  { key: 'status', header: 'Status' },
  { key: 'metricsSynced', header: 'Metrics', render: (row) => row.metricsSynced },
  { key: 'errorMessage', header: 'Error', render: (row) => row.errorMessage ?? '—' },
  { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
];

export default function DeviceSyncLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSyncLogs(page);
  const rows = data?.items ?? [];

  return (
    <PageShell
      eyebrow="Sync Health"
      title="Device Sync Logs"
      description="Track wearable sync jobs, retries, metrics ingested, and failures."
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        onExport={() =>
          exportCsv(
            'device-sync-logs.csv',
            rows.map((row) => ({
              user: row.User?.name,
              provider: row.provider,
              status: row.status,
              metricsSynced: row.metricsSynced,
              errorMessage: row.errorMessage,
              createdAt: row.createdAt,
            })),
          )
        }
      />
    </PageShell>
  );
}
