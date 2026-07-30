'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useRouter } from 'next/navigation';
import type { ConsumerTableRow } from '@/types/platform-health';
import { useConsumersList } from '@/hooks/api/use-platform-health';

export default function ConsumersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetching } = useConsumersList(page, search);

  const columns: Column<ConsumerTableRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <Link
          href={`/consumers/${row.user.id}`}
          className="font-medium text-brand-primary hover:underline"
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
        <span className="rounded-full bg-brand-secondary/15 px-2 py-0.5 text-xs font-medium text-brand-secondary">
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
        <span className="line-clamp-1 max-w-xs text-text-secondary">
          {row.latestInsight?.title ?? 'No insights yet'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/consumers/${row.user.id}`)}
          className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const rows: ConsumerTableRow[] = (data?.items ?? []).map((item) => ({
    ...item,
    id: item.user.id,
  }));

  return (
    <PageShell
      eyebrow="Consumers"
      title="App Users"
      
      description="Mobile app consumers, wearables, health metrics, and AI insights."
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading || isFetching}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        pageSize={data?.meta?.limit ?? 20}
        totalItems={data?.meta?.total}
        onPageChange={setPage}
        emptyMessage="No app users yet. Users appear here after mobile app registration."
      />
    </PageShell>
  );
}
