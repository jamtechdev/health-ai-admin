'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
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
    <PageShell
      eyebrow="Governance"
      title="Audit Logs"
      description="System audit trail for administrative changes and sensitive operations."
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </PageShell>
  );
}
