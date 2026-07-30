'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useRouter } from 'next/navigation';
import { useRolesList } from '@/hooks/api/use-roles';
import type { RoleRecord } from '@/types/role';

export default function RolesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetching } = useRolesList(page, search);

  const columns: Column<RoleRecord>[] = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'description', header: 'Description' },
    { key: 'userCount', header: 'Users' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/roles/${row.id}`)}
          className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="Access"
      title="Roles & Permissions"
      
      description="Manage role definitions, permission groups, and user access levels."
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading || isFetching}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        pageSize={data?.meta?.limit ?? 10}
        totalItems={data?.meta?.total}
        onPageChange={setPage}
      />
    </PageShell>
  );
}
