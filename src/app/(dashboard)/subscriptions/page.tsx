'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminSubscriptions } from '@/hooks/api/use-platform-health';
import type { SubscriptionRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminSubscriptions(page, search);
  const rows = data?.items ?? [];

  const columns: Column<SubscriptionRecord>[] = [
    { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
    { key: 'email', header: 'Email', render: (row) => row.User?.email ?? '—' },
    { key: 'status', header: 'Status' },
    { key: 'customer', header: 'Stripe customer', render: (row) => row.stripeCustomerId ?? '—' },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (row) => (row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/subscriptions/${row.id}`)}
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
      eyebrow="Billing"
      title="Subscriptions"
      description="Stripe-ready subscription monitoring for mobile app users."
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
            'subscriptions.csv',
            rows.map((row) => ({
              user: row.User?.name,
              email: row.User?.email,
              status: row.status,
              stripeCustomerId: row.stripeCustomerId,
              stripeSubscriptionId: row.stripeSubscriptionId,
              expiresAt: row.expiresAt,
            })),
          )
        }
      />
    </PageShell>
  );
}
