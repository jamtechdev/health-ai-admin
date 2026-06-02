'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminWearables } from '@/hooks/api/use-platform-health';
import type { ConnectedDeviceRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

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
];

export default function WearablesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminWearables(page, search);
  const rows = data?.items ?? [];

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
        onExport={() =>
          exportCsv(
            'wearables.csv',
            rows.map((row) => ({
              user: row.User?.name,
              email: row.User?.email,
              provider: row.provider,
              status: row.status,
              lastSyncAt: row.lastSyncAt,
            })),
          )
        }
      />
    </PageShell>
  );
}
