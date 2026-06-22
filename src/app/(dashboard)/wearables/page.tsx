'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminWearables } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { ConnectedDeviceRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';
import { toast } from 'sonner';

export default function WearablesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminWearables(page, search);
  const rows = data?.items ?? [];

  const columns: Column<ConnectedDeviceRecord>[] = [
    { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
    { key: 'email', header: 'Email', render: (row) => row.User?.email ?? '—' },
    { key: 'provider', header: 'Provider', render: (row) => row.provider.replace('_', ' ') },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="rounded-full bg-brand-secondary/15 px-2 py-0.5 text-xs font-medium text-brand-secondary">
          {row.status}
        </span>
      ),
    },
    {
      key: 'lastSyncAt',
      header: 'Last sync',
      render: (row) => (row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleString() : 'Never'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/wearables/${row.id}`)}
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
      eyebrow="Health Signals"
      title="Wearables"
      
      description="Monitor Apple Health, Oura, Fitbit, Garmin, and Health Connect device connections."
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        onExport={async () => {
          try {
            const result = await platformHealthService.adminWearables({ limit: 0, search, export: 1 });
            exportCsv(
              'wearables.csv',
              result.items.map((row) => ({
                user: row.User?.name,
                email: row.User?.email,
                provider: row.provider,
                status: row.status,
                lastSyncAt: row.lastSyncAt,
              })),
            );
            toast.success('Exported wearables');
          } catch {
            toast.error('Failed to export wearables');
          }
        }}
      />
    </PageShell>
  );
}
