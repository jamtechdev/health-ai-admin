'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { usePlansList, useDeletePlan } from '@/hooks/api/use-plans';
import { plansService } from '@/services/plans.service';
import { parsePlanFeatures } from '@/lib/plan-features';
import type { PlanRecord } from '@/types/plan';
import { exportCsv } from '@/lib/csv';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePlansList(page, search);
  const deletePlan = useDeletePlan();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePlan.mutateAsync(deleteId);
      toast.success('Plan deleted');
    } catch {
      toast.error('Failed to delete plan');
    }
    setDeleteId(null);
  };

  const columns: Column<PlanRecord>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'planType',
      header: 'Type',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.planType === 'free' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600'}`}>
          {row.planType}
        </span>
      ),
    },
    { key: 'price', header: 'Price', render: (row) => `$${Number(row.price).toFixed(2)}` },
    { key: 'durationDays', header: 'Duration', render: (row) => `${row.durationDays} days` },
    {
      key: 'features',
      header: 'Features',
      render: (row) => {
        const count = parsePlanFeatures(row.features).length;
        return (
          <span className="text-sm text-text-secondary">
            {count} {count === 1 ? 'feature' : 'features'}
          </span>
        );
      },
    },
    { key: 'appleProductId', header: 'Apple ID', render: (row) => row.appleProductId ?? '—' },
    { key: 'androidProductId', header: 'Android ID', render: (row) => row.androidProductId ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/subscriptions/${row.id}`)}
            className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="rounded p-1.5 cursor-pointer transition-colors hover:bg-red-50 text-red-400 hover:text-red-600"
            title="Delete plan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="Billing"
      title="Subscription Plans"
      description="Manage Apple IAP subscription plans, pricing, and product IDs."
      actions={
        <button
          onClick={() => router.push('/subscriptions/create')}
          className="inline-flex h-9 items-center justify-center rounded-button bg-brand-primary px-4 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> New Plan
        </button>
      }
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
        onExport={async () => {
          try {
            const result = await plansService.list({ limit: 0, search: search || undefined });
            exportCsv(
              'plans.csv',
              result.items.map((row) => ({
                name: row.name,
                type: row.planType,
                price: row.price,
                durationDays: row.durationDays,
                appleProductId: row.appleProductId,
                androidProductId: row.androidProductId,
                status: row.status,
              })),
            );
            toast.success('Exported plans');
          } catch {
            toast.error('Failed to export plans');
          }
        }}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </PageShell>
  );
}
