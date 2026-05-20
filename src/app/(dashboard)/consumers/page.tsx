'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import type { ConsumerTableRow } from '@/types/platform-health';
import { useConsumersList } from '@/hooks/api/use-platform-health';

const columns: Column<ConsumerTableRow>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link
        href={`/consumers/${row.user.id}`}
        className="font-medium text-emerald-600 hover:underline"
      >
        {row.user.name}
      </Link>
    ),
  },
  { key: 'email', header: 'Email', render: (row) => row.user.email },
  {
    key: 'goal',
    header: 'Goal',
    render: (row) => row.profile?.primaryGoal ?? '—',
  },
  {
    key: 'devices',
    header: 'Devices',
    render: (row) => (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        {row.connectedDevices} connected
      </span>
    ),
  },
  {
    key: 'score',
    header: 'Health score',
    render: (row) => row.latestInsight?.healthScore ?? '—',
  },
  {
    key: 'insight',
    header: 'Latest insight',
    render: (row) => (
      <span className="line-clamp-1 max-w-xs text-slate-600">
        {row.latestInsight?.title ?? 'No insights yet'}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <Link
        href={`/consumers/${row.user.id}`}
        className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline"
      >
        View <ExternalLink className="h-3 w-3" />
      </Link>
    ),
  },
];

export default function ConsumersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useConsumersList(page, search);

  const rows: ConsumerTableRow[] = (data?.items ?? []).map((item) => ({
    ...item,
    id: item.user.id,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">App Users</h2>
        <p className="text-slate-500">
          Mobile app consumers — wearables, metrics, and AI insights
        </p>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No app users yet. Users appear here after mobile app registration."
      />
    </div>
  );
}
