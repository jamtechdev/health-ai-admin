'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useRolesList } from '@/hooks/api/use-roles';
import type { RoleRecord } from '@/types/role';

const columns: Column<RoleRecord>[] = [
  { key: 'name', header: 'Name' },
  { key: 'slug', header: 'Slug' },
  { key: 'description', header: 'Description' },
  { key: 'userCount', header: 'Users' },
];

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useRolesList(page, search);

  return (
    <PageShell
      eyebrow="Access"
      title="Roles & Permissions"
      description="Manage role definitions, permission groups, and user access levels."
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </PageShell>
  );
}
