'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Trash2, Power, PowerOff, RotateCcw } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/ui/page-shell';
import { useUsersList, useUpdateUser, useDeleteUser, useRevertUser } from '@/hooks/api/use-users';
import type { UserRecord } from '@/types/user';
import { exportCsv } from '@/lib/csv';

function ConfirmDeleteModal({
  user,
  open,
  onClose,
  onSoftDelete,
  onPermanentDelete,
  isPending,
}: {
  user: UserRecord;
  open: boolean;
  onClose: () => void;
  onSoftDelete: (reason: string) => void;
  onPermanentDelete: () => void;
  isPending: boolean;
}) {
  const [mode, setMode] = useState<'select' | 'soft' | 'permanent'>('select');
  const [reason, setReason] = useState('');
  if (!open) return null;

  if (mode === 'soft') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
        <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold">Soft Delete User</h3>
          <p className="mt-2 text-text-muted">
            Soft delete <strong>{user.name}</strong> ({user.email})? They won&apos;t be able to log in. You can revert later from Account Requests.
          </p>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-text-secondary">Reason</label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason..." />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMode('select')}>Back</Button>
            <Button onClick={() => onSoftDelete(reason)} disabled={isPending} className="bg-amber-500 text-white hover:bg-amber-600">
              {isPending ? 'Processing...' : 'Soft Delete'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'permanent') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
        <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold">Permanently Delete User</h3>
          <p className="mt-2 text-text-muted">
            Are you sure? This will permanently remove <strong>{user.name}</strong> ({user.email}) and <strong>all related data</strong>. This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMode('select')}>Back</Button>
            <Button variant="destructive" onClick={onPermanentDelete} disabled={isPending}>
              {isPending ? 'Processing...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">Delete User</h3>
        <p className="mt-2 text-text-muted">
          How do you want to delete <strong>{user.name}</strong> ({user.email})?
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="secondary" onClick={() => setMode('soft')} className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 justify-center">
            Soft Delete — keep data, can revert later
          </Button>
          <Button variant="destructive" onClick={() => setMode('permanent')} className="justify-center">
            Permanent Delete — removes all data
          </Button>
          <Button variant="outline" onClick={onClose} className="justify-center">Cancel</Button>
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
  const [deletingUser, setDeletingUser] = useState<{ user: UserRecord; action: 'soft' | 'hard' } | null>(null);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const revertUser = useRevertUser();

  const handleToggleStatus = async (user: UserRecord) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateUser.mutateAsync({ id: user.id, payload: { status: newStatus } });
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleSoftDelete = async (reason: string) => {
    const delUser = deletingUser?.user;
    if (!delUser) return;
    try {
      await deleteUser.mutateAsync({ id: delUser.id, action: 'soft', reason: reason || undefined });
      toast.success('User soft deleted');
      setDeletingUser(null);
    } catch {
      toast.error('Failed to soft delete user');
    }
  };

  const handlePermanentDelete = async () => {
    const delUser = deletingUser?.user;
    if (!delUser) return;
    try {
      await deleteUser.mutateAsync({ id: delUser.id, action: 'hard' });
      toast.success('User permanently deleted');
      setDeletingUser(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleRevertFromList = async (userId: string) => {
    try {
      await revertUser.mutateAsync(userId);
      toast.success('User reverted successfully');
    } catch {
      toast.error('Failed to revert user');
    }
  };

  const handlePermanentDeleteFromList = async (userId: string) => {
    try {
      await deleteUser.mutateAsync({ id: userId, action: 'hard' });
      toast.success('User permanently deleted');
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
      render: (row) => {
        if (row.deletedAt) {
          return (
            <span className="rounded-full bg-brand-critical/15 px-2 py-0.5 text-xs font-medium text-brand-critical">DELETED</span>
          );
        }
        return (
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
        );
      },
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
        const isDeleted = !!row.deletedAt;
        if (isDeleted) {
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleRevertFromList(row.id)}
                className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-brand-secondary"
                title="Revert (restore user)"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePermanentDeleteFromList(row.id)}
                className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-brand-critical"
                title="Permanent delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        }
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
                onClick={() => setDeletingUser({ user: row, action: 'soft' })}
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
    <PageShell
      eyebrow="People"
      title="Users"
      description="Manage platform users, roles, account status, and lifecycle actions."
    >
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
          user={deletingUser.user}
          open={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onSoftDelete={handleSoftDelete}
          onPermanentDelete={handlePermanentDelete}
          isPending={deleteUser.isPending}
        />
      )}
    </PageShell>
  );
}
