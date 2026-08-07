'use client';

import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminUserDevices } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { UserDeviceDirectoryItem } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function formatLastLogin(value: string | null | undefined): string {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function PlatformBadge({ value }: { value: string | null | undefined }) {
  const platform = (value ?? '').toLowerCase();
  if (!platform) {
    return (
      <span className="inline-flex rounded-md bg-slate-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        N/A
      </span>
    );
  }
  const styles =
    platform === 'android'
      ? 'bg-emerald-600 text-white'
      : platform === 'ios'
        ? 'bg-zinc-900 text-white'
        : platform === 'web'
          ? 'bg-slate-500 text-white'
          : 'bg-slate-500 text-white';

  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        styles,
      )}
    >
      {platform}
    </span>
  );
}

function DeviceTypeBadge({ value }: { value: 'debug' | 'release' | null | undefined }) {
  if (!value) {
    return (
      <span className="inline-flex rounded-md bg-slate-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        N/A
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white',
        value === 'debug' ? 'bg-sky-600' : 'bg-amber-500',
      )}
    >
      {value === 'debug' ? 'Debug' : 'Release'}
    </span>
  );
}

function StatusBadge({ status }: { status: 'logged_in' | 'logged_out' }) {
  const loggedIn = status === 'logged_in';
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white',
        loggedIn ? 'bg-emerald-600' : 'bg-rose-600',
      )}
    >
      {loggedIn ? 'Logged In' : 'Logged Out'}
    </span>
  );
}

function VersionBadge({ value }: { value: string | null | undefined }) {
  if (!value) {
    return (
      <span className="inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
        N/A
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
      {value}
    </span>
  );
}

export default function UserDevicesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const devicesQuery = useAdminUserDevices(page, search);
  const rows = devicesQuery.data?.items ?? [];

  const columns: Column<UserDeviceDirectoryItem>[] = [
    {
      key: 'userName',
      header: 'User',
      render: (row) => (
        <div className="min-w-[140px]">
          <p className="font-medium text-slate-800">{row.userName || '—'}</p>
          <p className="truncate text-xs text-slate-500">{row.userEmail || ''}</p>
        </div>
      ),
    },
    {
      key: 'modelName',
      header: 'Device',
      render: (row) => (
        <div className="min-w-[140px]">
          <p className="font-medium text-slate-800">{row.modelName?.trim() || 'N/A'}</p>
          <p className="font-mono text-[11px] text-slate-400" title={row.clientDeviceId}>
            {row.clientDeviceId.length > 20
              ? `${row.clientDeviceId.slice(0, 10)}…${row.clientDeviceId.slice(-6)}`
              : row.clientDeviceId}
          </p>
        </div>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (row) => <PlatformBadge value={row.platform} />,
    },
    {
      key: 'deviceType',
      header: 'Device Type',
      render: (row) => <DeviceTypeBadge value={row.deviceType} />,
    },
    {
      key: 'appVersion',
      header: 'Version',
      render: (row) => <VersionBadge value={row.appVersion} />,
    },
    {
      key: 'lastIp',
      header: 'IP Address',
      render: (row) =>
        row.lastIp ? (
          <span className="font-mono text-sm text-slate-700">{row.lastIp}</span>
        ) : (
          <span className="inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            N/A
          </span>
        ),
    },
    {
      key: 'timezone',
      header: 'Timezone',
      render: (row) => (
        <span className="text-sm text-slate-700">{row.timezone?.trim() || 'N/A'}</span>
      ),
    },
    {
      key: 'lastSeenAt',
      header: 'Last Login',
      render: (row) => (
        <span className="whitespace-nowrap text-sm text-slate-700">
          {formatLastLogin(row.lastSeenAt)}
        </span>
      ),
    },
    {
      key: 'loginStatus',
      header: 'Status',
      render: (row) => <StatusBadge status={row.loginStatus} />,
    },
  ];

  return (
    <PageShell
      eyebrow="People"
      title="Device Logins"
      titleColor="text-slate-900"
      description="Track every phone where users are logged in — model, platform, build type, IP, timezone, and live status."
      actions={
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-700">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
      }
    >
      <div className="device-logins-table [&_thead]:!bg-[#1e3a5f] [&_thead]:backdrop-blur-none [&_thead_th]:border-b-0 [&_thead_th]:py-3.5 [&_thead_th]:text-[11px] [&_thead_th]:font-bold [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:!text-white [&_tbody_tr:nth-child(even)]:bg-slate-50/90 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_td]:py-3.5">
        <DataTable
          columns={columns}
          data={rows}
          isLoading={devicesQuery.isLoading || devicesQuery.isFetching}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          page={page}
          totalPages={devicesQuery.data?.meta.totalPages ?? 1}
          pageSize={devicesQuery.data?.meta?.limit ?? 20}
          totalItems={devicesQuery.data?.meta?.total}
          onPageChange={setPage}
          emptyMessage="No device logins recorded yet. Ask the app to send device_id headers on login / push-token."
          onExport={async () => {
            try {
              const result = await platformHealthService.adminUserDevices({
                limit: 0,
                search,
                export: 1,
              });
              exportCsv(
                'device-logins.csv',
                result.items.map((row) => ({
                  user: row.userName,
                  email: row.userEmail,
                  device: row.modelName ?? 'N/A',
                  deviceId: row.clientDeviceId,
                  platform: row.platform,
                  deviceType: row.deviceType,
                  version: row.appVersion,
                  ip: row.lastIp,
                  timezone: row.timezone,
                  lastLogin: row.lastSeenAt,
                  status: row.loginStatus,
                })),
              );
              toast.success('Exported device logins');
            } catch {
              toast.error('Failed to export device logins');
            }
          }}
        />
      </div>
    </PageShell>
  );
}
