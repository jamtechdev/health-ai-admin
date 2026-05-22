'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { useUsersList } from '@/hooks/api/use-users';
import { useConsumersList } from '@/hooks/api/use-platform-health';
import type { UserRecord } from '@/types/user';
import type { ConsumerTableRow } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

const columns: Column<UserRecord>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          row.status === 'ACTIVE'
                    ? 'bg-brand-secondary/15 text-brand-secondary'
                    : 'bg-surface-secondary text-text-muted'
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: 'roles',
    header: 'Roles',
    render: (row) => row.roles?.map((r) => r.name).join(', ') ?? '—',
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

const consumerColumns: Column<ConsumerTableRow>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link href={`/consumers/${row.user.id}`} className="font-medium text-brand-primary hover:underline">
        {row.user.name}
      </Link>
    ),
  },
  { key: 'email', header: 'Email', render: (row) => row.user.email },
  { key: 'goal', header: 'Goal', render: (row) => row.profile?.primaryGoal ?? '—' },
  { key: 'devices', header: 'Devices', render: (row) => `${row.connectedDevices} connected` },
  { key: 'score', header: 'Health score', render: (row) => row.latestInsight?.healthScore ?? '—' },
  {
    key: 'actions',
    header: '',
    render: (row) => (
              <Link href={`/consumers/${row.user.id}`} className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline">
        Health detail <ExternalLink className="h-3 w-3" />
      </Link>
    ),
  },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [consumerPage, setConsumerPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'system' | 'app'>('system');
  const { data, isLoading } = useUsersList(page, search);
  const { data: consumers, isLoading: consumersLoading } = useConsumersList(consumerPage, search);

  const consumerRows: ConsumerTableRow[] = (consumers?.items ?? []).map((item) => ({
    ...item,
    id: item.user.id,
  }));

  const handleExport = () => {
    const rows = data?.items ?? [];
    exportCsv('users.csv', rows.map((r) => ({ name: r.name, email: r.email, status: r.status })));
    toast.success('Exported users');
  };

  const handleConsumerExport = () => {
    exportCsv(
      'app-users.csv',
      consumerRows.map((r) => ({
        name: r.user.name,
        email: r.user.email,
        goal: r.profile?.primaryGoal,
        connectedDevices: r.connectedDevices,
        healthScore: r.latestInsight?.healthScore,
      })),
    );
    toast.success('Exported app users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-text-muted">One place for admins, staff, mobile app users, and health profiles.</p>
        </div>
        <Button onClick={() => toast.info('Create user modal — connect to API POST /users')}>
          Add User
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-brand-border bg-surface p-2">
        <Button
          variant={activeTab === 'system' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('system')}
        >
          System Users
        </Button>
        <Button
          variant={activeTab === 'app' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('app')}
        >
          App Users & Health
        </Button>
        <Link href="/profile" className="ml-auto">
          <Button variant="outline" size="sm">My Profile</Button>
        </Link>
      </div>

      {activeTab === 'system' ? (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          page={page}
          totalPages={data?.meta?.totalPages ?? 1}
          onPageChange={setPage}
          onExport={handleExport}
          emptyMessage="No system users found."
        />
      ) : (
        <DataTable
          columns={consumerColumns}
          data={consumerRows}
          isLoading={consumersLoading}
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setConsumerPage(1);
          }}
          page={consumerPage}
          totalPages={consumers?.meta?.totalPages ?? 1}
          onPageChange={setConsumerPage}
          onExport={handleConsumerExport}
          emptyMessage="No app users found. Mobile app registrations appear here."
        />
      )}
    </div>
  );
}
