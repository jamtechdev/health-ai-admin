'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminInsights } from '@/hooks/api/use-platform-health';
import { platformHealthService } from '@/services/platform-health.service';
import type { AiInsightRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';
import { toast } from 'sonner';

const columns: Column<AiInsightRecord>[] = [
  { key: 'user', header: 'User', render: (row) => row.User?.name ?? row.userId },
  { key: 'title', header: 'Title' },
  { key: 'type', header: 'Type', render: (row) => row.insightType },
  { key: 'risk', header: 'Risk', render: (row) => row.riskLevel ?? 'low' },
  { key: 'score', header: 'Score', render: (row) => row.healthScore ?? '—' },
  {
    key: 'generatedAt',
    header: 'Generated',
    render: (row) => new Date(row.generatedAt).toLocaleString(),
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row) => (
      <button
        onClick={() => {}} // Placeholder, will be fixed by router context
        className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </button>
    ),
  },
];

export default function InsightsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetching } = useAdminInsights(page, search);
  const rows = data?.items ?? [];

  const columnsWithRouter: Column<AiInsightRecord>[] = columns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (row) => (
          <button
            onClick={() => router.push(`/insights/${row.id}`)}
            className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
        )
      };
    }
    return col;
  });

  return (
    <PageShell
      eyebrow="AI Health"
      title="AI Insights"
      description="Review generated recommendations, risk levels, and health scores for app users."
    >
      <DataTable
        columns={columnsWithRouter}
        data={rows}
        isLoading={isLoading || isFetching}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        pageSize={data?.meta?.limit ?? 20}
        totalItems={data?.meta?.total}
        onPageChange={setPage}
        onExport={async () => {
          try {
            const result = await platformHealthService.adminInsights({ limit: 0, search, export: 1 });
            exportCsv(
              'ai-insights.csv',
              result.items.map((row) => ({
                user: row.User?.name,
                email: row.User?.email,
                title: row.title,
                type: row.insightType,
                risk: row.riskLevel,
                score: row.healthScore,
                generatedAt: row.generatedAt,
              })),
            );
            toast.success('Exported AI insights');
          } catch {
            toast.error('Failed to export AI insights');
          }
        }}
      />
    </PageShell>
  );
}
