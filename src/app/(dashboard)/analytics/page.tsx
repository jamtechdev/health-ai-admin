'use client';

import { Activity, Bell, Database, Sparkles, Users, Watch, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { useAdminAnalyticsOverview } from '@/hooks/api/use-platform-health';

const cards = [
  { key: 'totalUsers', label: 'Total users', icon: Users },
  { key: 'connectedWearables', label: 'Connected wearables', icon: Watch },
  { key: 'metricsToday', label: 'Metrics today', icon: Database },
  { key: 'insightsToday', label: 'Insights today', icon: Sparkles },
  { key: 'activeSubscriptions', label: 'Active subscriptions', icon: Bell },
  { key: 'failedSyncs', label: 'Failed syncs', icon: XCircle },
  { key: 'apiRequestsToday', label: 'API requests today', icon: Activity },
] as const;

export default function AnalyticsPage() {
  const { data, isLoading } = useAdminAnalyticsOverview();

  return (
    <PageShell
      eyebrow="Telemetry"
      title="Analytics"
      description="TovaPulse operations, biometric telemetry, usage signals, and sync health."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-text-muted">{card.label}</CardTitle>
                <Icon className="h-5 w-5 text-brand-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {isLoading ? '—' : String(data?.[card.key] ?? 0)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
