'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { useActivityLogs, useClearActivityLogs } from '@/hooks/api/use-logs';
import type { ActivityLog } from '@/types/logs';

export default function ActivityLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs(page);
  const clearMutation = useClearActivityLogs();

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all activity logs? This cannot be undone.')) return;
    try {
      await clearMutation.mutateAsync();
      toast.success('All activity logs cleared');
    } catch {
      toast.error('Failed to clear activity logs');
    }
  };

  const columns: Column<ActivityLog>[] = [
    { key: 'module', header: 'Module' },
    { key: 'description', header: 'Description' },
    {
      key: 'user',
      header: 'User',
      render: (row) => row.user?.name ?? row.user?.email ?? 'System',
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => router.push(`/activity-logs/${row.id}`)}
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
      eyebrow="User Activity"
      title="Activity Logs"
      description="App user activity timeline with login, logout, device, and IP details."
      actions={
        <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={clearMutation.isPending}>
          <Trash2 className="mr-1.5 h-4 w-4" />
          {clearMutation.isPending ? 'Clearing...' : 'Remove All'}
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </PageShell>
  );
}
