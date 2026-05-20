'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { useAdminSubscriptions } from '@/hooks/api/use-platform-health';
import type { SubscriptionRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

const columns: Column<SubscriptionRecord>[] = [
  { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
  { key: 'email', header: 'Email', render: (row) => row.User?.email ?? '—' },
  { key: 'status', header: 'Status' },
  { key: 'customer', header: 'Stripe customer', render: (row) => row.stripeCustomerId ?? '—' },
  { key: 'subscription', header: 'Stripe subscription', render: (row) => row.stripeSubscriptionId ?? '—' },
  {
    key: 'expiresAt',
    header: 'Expires',
    render: (row) => (row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : '—'),
  },
];

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminSubscriptions(page, search);
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <p className="text-slate-500">Stripe-ready subscription monitoring for app users.</p>
      </div>

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
    </div>
  );
}
