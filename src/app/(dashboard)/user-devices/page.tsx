'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { useAdminUserDevices } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { UserDeviceDirectoryItem } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

export default function UserDevicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUserDevices(page, '');
  const rows = data?.items ?? [];

  const handleExport = async () => {
    try {
      const result = await platformHealthService.adminUserDevices({
        limit: 0,
        export: 1,
      });
      exportCsv(
        'device-logins.csv',
        result.items.map((row) => ({
          user: row.userName,
          email: row.userEmail,
          model_name: row.modelName ?? '',
          device_id: row.clientDeviceId,
          platform: row.platform ?? '',
          isDebug: row.isDebug == null ? '' : row.isDebug ? 'true' : 'false',
          device_type: row.deviceType ?? '',
          version: row.appVersion ?? '',
          ip_address: row.lastIp ?? '',
          timezone: row.timezone ?? '',
          last_login: row.lastSeenAt,
          status: row.loginStatus,
        })),
      );
      toast.success('Exported device logins');
    } catch {
      toast.error('Failed to export device logins');
    }
  };

  const columns: Column<UserDeviceDirectoryItem>[] = [
    {
      key: 'userName',
      header: 'User',
      render: (row) => row.userName || row.userEmail || '—',
    },
    {
      key: 'modelName',
      header: 'Device',
      render: (row) => row.modelName?.trim() || row.clientDeviceId || '—',
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (row) => row.platform?.toUpperCase() || '—',
    },
    {
      key: 'deviceType',
      header: 'Device Type',
      render: (row) =>
        row.deviceType === 'debug' ? 'Debug' : row.deviceType === 'release' ? 'Release' : '—',
    },
    {
      key: 'appVersion',
      header: 'Version',
      render: (row) => row.appVersion?.trim() || '—',
    },
    {
      key: 'lastIp',
      header: 'IP Address',
      render: (row) => row.lastIp || '—',
    },
    {
      key: 'timezone',
      header: 'Timezone',
      render: (row) => row.timezone?.trim() || '—',
    },
    {
      key: 'lastSeenAt',
      header: 'Last Login',
      render: (row) => (row.lastSeenAt ? new Date(row.lastSeenAt).toLocaleString() : '—'),
    },
    {
      key: 'loginStatus',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.loginStatus === 'logged_in'
              ? 'bg-brand-secondary/15 text-brand-secondary'
              : 'bg-brand-critical/15 text-brand-critical'
          }`}
        >
          {row.loginStatus === 'logged_in' ? 'Logged In' : 'Logged Out'}
        </span>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="People"
      title="Device Logins"
      description="Track every phone where users are logged in — model, platform, build type, IP, timezone, and live status."
      actions={
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        pageSize={data?.meta?.limit ?? 20}
        totalItems={data?.meta?.total}
        onPageChange={setPage}
      />
    </PageShell>
  );
}
