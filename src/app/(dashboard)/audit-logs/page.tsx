'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { useAuditLogs } from '@/hooks/api/use-logs';
import type { AuditLog } from '@/types/logs';

const columns: Column<AuditLog>[] = [
  { key: 'action', header: 'Action' },
  { key: 'entity', header: 'Entity' },
  { key: 'entityId', header: 'Entity ID' },
  {
    key: 'actor',
    header: 'Actor',
    render: (row) => row.actor?.name ?? '—',
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <p className="text-text-muted">System audit trail</p>
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
