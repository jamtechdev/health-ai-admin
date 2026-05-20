'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { useUsersList } from '@/hooks/api/use-users';
import type { UserRecord } from '@/types/user';

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
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
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

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsersList(page, search);

  const handleExport = () => {
    const rows = data?.items ?? [];
    const csv = [
      ['Name', 'Email', 'Status'].join(','),
      ...rows.map((r) => [r.name, r.email, r.status].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    toast.success('Exported users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-slate-500">Manage system users</p>
        </div>
        <Button onClick={() => toast.info('Create user modal — connect to API POST /users')}>
          Add User
        </Button>
      </div>

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
      />
    </div>
  );
}
