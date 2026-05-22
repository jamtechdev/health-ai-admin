'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Roles & Permissions</h2>
        <p className="text-text-muted">Manage roles and permission assignments</p>
      </div>
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
    </div>
  );
}
