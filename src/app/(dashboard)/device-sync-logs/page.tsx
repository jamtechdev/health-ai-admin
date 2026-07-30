'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminSyncLogs } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { DeviceSyncLogRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';
import { toast } from 'sonner';

export default function DeviceSyncLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSyncLogs(page);
  const rows = data?.items ?? [];

  const columns: Column<DeviceSyncLogRecord>[] = [
    { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
    { key: 'provider', header: 'Provider', render: (row) => row.provider.replace('_', ' ') },
    { key: 'status', header: 'Status' },
    { key: 'metricsSynced', header: 'Metrics', render: (row) => row.metricsSynced },
    { key: 'errorMessage', header: 'Error', render: (row) => row.errorMessage ?? '—' },
    { key: 'createdAt', header: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/device-sync-logs/${row.id}`)}
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
        pageSize={data?.meta?.limit ?? 20}
        totalItems={data?.meta?.total}
        onPageChange={setPage}
        onExport={async () => {
          try {
            const result = await platformHealthService.adminSyncLogs({ limit: 0, export: 1 });
            exportCsv(
              'device-sync-logs.csv',
              result.items.map((row) => ({
                user: row.User?.name,
                provider: row.provider,
                status: row.status,
                metricsSynced: row.metricsSynced,
                errorMessage: row.errorMessage,
                createdAt: row.createdAt,
              })),
            );
            toast.success('Exported device sync logs');
          } catch {
            toast.error('Failed to export device sync logs');
          }
        }}
      />
    </PageShell>
  );
}
