'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/ui/page-shell';
import {
  useAccountRequests,
  useRevertRequest,
  usePermanentDeleteRequest,
} from '@/hooks/api/use-account-requests';
import type { AccountDeletionRequestRecord } from '@/types/account-request';

function ViewDetailsModal({
  request,
  open,
  onClose,
}: {
  request: AccountDeletionRequestRecord;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">Request Details</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <span className="text-text-muted">User:</span>
            <p className="font-medium">{request.user?.name ?? 'Unknown'}</p>
          </div>
          <div>
            <span className="text-text-muted">Email:</span>
            <p className="font-medium">{request.user?.email ?? '—'}</p>
          </div>
          <div>
            <span className="text-text-muted">Type:</span>
            <p className="font-medium capitalize">{request.action === 'user_request' ? 'User Requested Deletion' : 'Admin Soft Deleted'}</p>
          </div>
          {request.reason && (
            <div>
              <span className="text-text-muted">Reason:</span>
              <p className="mt-1 rounded-md bg-surface-secondary p-3 text-foreground">{request.reason}</p>
            </div>
          )}
          <div>
            <span className="text-text-muted">Requested on:</span>
            <p className="font-medium">{request.createdAt ? new Date(request.createdAt).toLocaleString() : '—'}</p>
          </div>
          <div>
            <span className="text-text-muted">Status:</span>
            <p className="font-medium capitalize">{request.status.replace('_', ' ')}</p>
          </div>
          {request.deletedAt && (
            <div>
              <span className="text-text-muted">Deleted on:</span>
              <p className="font-medium">{new Date(request.deletedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmActionModal({
  request,
  open,
  onClose,
  onConfirm,
  action,
  isPending,
}: {
  request: AccountDeletionRequestRecord;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'revert' | 'permanent_delete';
  isPending: boolean;
}) {
  if (!open) return null;

  const isRevert = action === 'revert';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">{isRevert ? 'Revert User' : 'Permanent Delete'}</h3>
        <p className="mt-2 text-text-muted">
          {isRevert
            ? `Are you sure you want to restore ${request.user?.name ?? 'this user'}? They will be able to log in again.`
            : `This will permanently delete ${request.user?.name ?? 'this user'} and all related data. This cannot be undone.`}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant={isRevert ? 'secondary' : 'destructive'}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processing...' : isRevert ? 'Revert' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AccountRequestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAccountRequests(page);
  const revertMutation = useRevertRequest();
  const deleteMutation = usePermanentDeleteRequest();
  const [viewedRequest, setViewedRequest] = useState<AccountDeletionRequestRecord | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    request: AccountDeletionRequestRecord;
    action: 'revert' | 'permanent_delete';
  } | null>(null);

  const handleRevert = async () => {
    if (!confirmModal) return;
    try {
      await revertMutation.mutateAsync(confirmModal.request.id);
      toast.success('User reverted successfully');
      setConfirmModal(null);
    } catch {
      toast.error('Failed to revert user');
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirmModal) return;
    try {
      await deleteMutation.mutateAsync(confirmModal.request.id);
      toast.success('User permanently deleted');
      setConfirmModal(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const columns: Column<AccountDeletionRequestRecord>[] = [
    {
      key: 'user',
      header: 'User',
      render: (row) => row.user?.name ?? row.user?.email ?? 'Unknown',
    },
    {
      key: 'user.email',
      header: 'Email',
      render: (row) => row.user?.email ?? '—',
    },
    {
      key: 'action',
      header: 'Type',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.action === 'user_request' ? 'bg-blue-500/15 text-blue-700' : 'bg-amber-500/15 text-amber-700'}`}>
          {row.action === 'user_request' ? 'User Request' : 'Admin Soft Delete'}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => row.reason ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          row.status === 'pending'
            ? 'bg-amber-500/15 text-amber-700'
            : row.status === 'reverted'
              ? 'bg-brand-secondary/15 text-brand-secondary'
              : 'bg-brand-critical/15 text-brand-critical'
        }`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Requested',
      render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        if (row.status !== 'pending') return <span className="text-xs text-text-muted">Completed</span>;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewedRequest(row)}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => setConfirmModal({ request: row, action: 'revert' })}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-brand-secondary"
              title="Revert (restore user)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setConfirmModal({ request: row, action: 'permanent_delete' })}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-brand-critical"
              title="Permanent delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell
      eyebrow="People"
      title="Account Requests"
      description="Manage deletion requests from users and admin soft-deleted accounts."
    >
      {data && data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-brand-border bg-surface/50 py-16">
          <AlertTriangle className="mb-3 h-10 w-10 text-text-muted" />
          <p className="text-sm text-text-muted">No deletion requests yet.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.meta?.totalPages ?? 1}
          onPageChange={setPage}
          emptyMessage="No deletion requests found."
        />
      )}

      {viewedRequest && (
        <ViewDetailsModal
          request={viewedRequest}
          open={!!viewedRequest}
          onClose={() => setViewedRequest(null)}
        />
      )}

      {confirmModal && (
        <ConfirmActionModal
          request={confirmModal.request}
          open={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.action === 'revert' ? handleRevert : handlePermanentDelete}
          action={confirmModal.action}
          isPending={revertMutation.isPending || deleteMutation.isPending}
        />
      )}
    </PageShell>
  );
}
