'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAuditLogs } from '@/hooks/api/use-logs';
import type { AuditLog } from '@/types/logs';

export default function AuditLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page);

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
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/audit-logs/${row.id}`)}
          className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

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
