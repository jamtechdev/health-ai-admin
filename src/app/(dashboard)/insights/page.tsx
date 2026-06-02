'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminInsights } from '@/hooks/api/use-platform-health';
import type { AiInsightRecord } from '@/types/platform-health';
import { exportCsv } from '@/lib/csv';

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
];

export default function InsightsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminInsights(page, search);
  const rows = data?.items ?? [];

  return (
    <PageShell
      eyebrow="AI Health"
      title="AI Insights"
      description="Review generated recommendations, risk levels, and health scores for app users."
    >
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
        onExport={() =>
          exportCsv(
            'ai-insights.csv',
            rows.map((row) => ({
              user: row.User?.name,
              email: row.User?.email,
              title: row.title,
              type: row.insightType,
              risk: row.riskLevel,
              score: row.healthScore,
              generatedAt: row.generatedAt,
            })),
          )
        }
      />
    </PageShell>
  );
}
