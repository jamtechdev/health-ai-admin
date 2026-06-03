'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { useActivityLogs, useClearActivityLogs } from '@/hooks/api/use-logs';
import type { ActivityLog } from '@/types/logs';

const columns: Column<ActivityLog>[] = [
  { key: 'module', header: 'Module' },
  { key: 'description', header: 'Description' },
  {
    key: 'userAgent',
    header: 'Device / IP',
    render: (row) => {
      if (row.module !== 'auth') return '—';
      const agent = row.userAgent ?? '';
      const ip = row.ip ?? '';
      return [agent, ip].filter(Boolean).join(' · ') || '—';
    },
  },
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
];

export default function ActivityLogsPage() {
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
