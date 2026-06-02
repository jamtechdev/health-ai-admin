'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { useActivityLogs } from '@/hooks/api/use-logs';
import type { ActivityLog } from '@/types/logs';

const columns: Column<ActivityLog>[] = [
  { key: 'module', header: 'Module' },
  { key: 'description', header: 'Description' },
  {
    key: 'userAgent',
    header: 'Device / IP',
    render: (row) => {
      if (row.module !== 'auth') return '—';
      const agent = row.userAgent ?? '';
      const ip = row.ip ?? '';
      return [agent, ip].filter(Boolean).join(' · ') || '—';
    },
  },
  {
    key: 'user',
    header: 'User',
    render: (row) => row.user?.name ?? row.user?.email ?? 'System',
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs(page);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <p className="text-text-muted">User activity timeline — shows login/logout with device & IP details.</p>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
