'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Trash2, Power, PowerOff } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { useUsersList, useUpdateUser, useDeleteUser } from '@/hooks/api/use-users';
import type { UserRecord } from '@/types/user';
import { exportCsv } from '@/lib/csv';

function ConfirmDeleteModal({
  user,
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  user: UserRecord;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">Delete User</h3>
        <p className="mt-2 text-text-muted">
          Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
          This will permanently remove the user and <strong>all related data</strong> (health metrics, devices, insights, subscriptions, etc.).
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete permanently'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsersList(page, search);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleToggleStatus = async (user: UserRecord) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateUser.mutateAsync({ id: user.id, payload: { status: newStatus } });
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.id);
      toast.success('User permanently deleted');
      setDeletingUser(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

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
              : row.status === 'INACTIVE'
                ? 'bg-surface-secondary text-text-muted'
                : 'bg-brand-critical/15 text-brand-critical'
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
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        const isSuperAdmin = row.roles?.some((r) => r.slug === 'super-admin');
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/users/${row.id}/edit`)}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {!isSuperAdmin && (
              <button
                onClick={() => handleToggleStatus(row)}
                className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                title={row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              >
                {row.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              </button>
            )}
            {!isSuperAdmin && (
              <button
                onClick={() => setDeletingUser(row)}
                className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-brand-critical"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const handleExport = () => {
    const rows = data?.items ?? [];
    exportCsv('users.csv', rows.map((r) => ({ name: r.name, email: r.email, status: r.status })));
    toast.success('Exported users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-text-muted">Manage all platform users.</p>
        </div>
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
        emptyMessage="No users found."
      />

      {deletingUser && (
        <ConfirmDeleteModal
          user={deletingUser}
          open={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          isPending={deleteUser.isPending}
        />
      )}
    </div>
  );
}
