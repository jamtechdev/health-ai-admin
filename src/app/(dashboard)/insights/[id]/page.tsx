'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminInsights } from '@/hooks/api/use-platform-health';

export default function InsightDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const insightId = params.id as string;
  // Note: We need a way to fetch a single insight. Assuming useAdminInsights allows filtering/finding.
  // Given current tools, we might need a specific hook for single insight or reuse list hook.
  // For now, let's fetch list and find by ID.
  const { data, isLoading } = useAdminInsights(1, '');
  const insight = data?.items.find((item) => item.id === insightId);

  if (isLoading) return <PageShell title="Loading...">Loading...</PageShell>;
  if (!insight) return <PageShell title="Not Found">Insight not found.</PageShell>;

  return (
    <PageShell
      eyebrow="AI Health"
      title="Insight Details"
      actions={
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-brand-primary" />
              {insight.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">User</p>
                <p className="font-medium">{insight.User?.name ?? insight.userId}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Type</p>
                <p className="font-medium">{insight.insightType}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Risk Level</p>
                <p className="font-medium">{insight.riskLevel ?? 'low'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Health Score</p>
                <p className="font-medium">{insight.healthScore ?? '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-muted">Body</p>
              <p className="mt-1">{insight.body}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Generated At</p>
              <p className="font-medium">{new Date(insight.generatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
