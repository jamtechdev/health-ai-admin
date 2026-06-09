'use client';

import { useParams, useRouter } from 'next/navigation';
import { Watch, ArrowLeft } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { useConsumerDevices } from '@/hooks/api/use-platform-health';
import type { ConnectedDeviceRecord } from '@/types/platform-health';

export default function UserWearablesPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { data, isLoading } = useConsumerDevices(userId);
  const wearables = data ?? [];

  const columns: Column<ConnectedDeviceRecord>[] = [
    { key: 'provider', header: 'Provider', render: (row) => row.provider.replace('_', ' ') },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="rounded-full bg-brand-secondary/15 px-2 py-0.5 text-xs font-medium text-brand-secondary">
          {row.status}
        </span>
      ),
    },
    {
      key: 'lastSyncAt',
      header: 'Last sync',
      render: (row) => (row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleString() : 'Never'),
    },
  ];

  return (
    <PageShell
      eyebrow="User Wearables"
      title={`Wearables for User`}
      description={`Viewing all connected devices for this user.`}
      actions={
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={wearables}
        isLoading={isLoading}
        emptyMessage="No wearables found for this user."
      />
    </PageShell>
  );
}
