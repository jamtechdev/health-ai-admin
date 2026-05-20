'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, Sparkles, Watch, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useConsumerDetail,
  useConsumerInsights,
  useConsumerMetrics,
  useGenerateInsight,
  useSyncConsumerDevices,
} from '@/hooks/api/use-platform-health';

const providerLabel: Record<string, string> = {
  apple_health: 'Apple Health / Watch',
  oura: 'Oura Ring',
};

export default function ConsumerDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [metricDays, setMetricDays] = useState(7);

  const { data, isLoading } = useConsumerDetail(userId);
  const { data: insights } = useConsumerInsights(userId);
  const { data: metrics } = useConsumerMetrics(userId, metricDays);
  const generate = useGenerateInsight(userId);
  const sync = useSyncConsumerDevices(userId);

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Loading consumer health data…</div>;
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Link href="/consumers" className="inline-flex items-center gap-2 text-sm text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> Back to app users
        </Link>
        <p className="text-slate-500">Consumer not found.</p>
      </div>
    );
  }

  const profile = data.profile;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/consumers" className="mb-2 inline-flex items-center gap-2 text-sm text-emerald-600">
            <ArrowLeft className="h-4 w-4" /> App users
          </Link>
          <h2 className="text-2xl font-bold">Health profile</h2>
          <p className="text-slate-500">User ID: {userId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={sync.isPending}
            onClick={() => sync.mutate()}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
            Sync devices
          </Button>
          <Button disabled={generate.isPending} onClick={() => generate.mutate()}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI insight
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Health score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{data.healthScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Connected devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.devices.filter((d) => d.status === 'connected').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{profile.primaryGoal ?? '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            {profile.age ? `${profile.age} yrs` : '—'}
            {profile.weightKg ? ` · ${profile.weightKg} kg` : ''}
            {profile.heightCm ? ` · ${profile.heightCm} cm` : ''}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Today&apos;s AI insight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-semibold">{data.todayInsight.title}</p>
          <p className="whitespace-pre-wrap text-sm text-slate-600">{data.todayInsight.body}</p>
          {data.todayInsight.recommendation && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {data.todayInsight.recommendation}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Watch className="h-5 w-5" />
              Wearables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.devices.length === 0 && (
                <p className="text-sm text-slate-500">No devices connected</p>
              )}
              {data.devices.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800"
                >
                  <span className="font-medium">{providerLabel[d.provider] ?? d.provider}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      d.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Oura: {data.integrations.oura ? 'configured' : 'not configured'} · OpenAI:{' '}
              {data.integrations.openai ? 'on' : 'rule-based'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2">
              {[7, 30, 90].map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={metricDays === d ? 'default' : 'outline'}
                  onClick={() => setMetricDays(d)}
                >
                  {d}d
                </Button>
              ))}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(data.latestMetrics).map(([type, value]) => (
                <div key={type} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
                  <span className="text-slate-500">{type.replace(/_/g, ' ')}</span>
                  <p className="font-semibold">{value}</p>
                </div>
              ))}
              {!Object.keys(data.latestMetrics).length && (
                <p className="col-span-2 text-slate-500">No metrics synced yet</p>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Value</th>
                    <th className="pb-2">Recorded</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics ?? []).slice(0, 20).map((m) => (
                    <tr key={m.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-1">{m.metricType}</td>
                      <td className="py-1">
                        {m.value}
                        {m.unit ? ` ${m.unit}` : ''}
                      </td>
                      <td className="py-1 text-slate-500">
                        {new Date(m.recordedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insight history</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {(insights ?? []).map((insight) => (
              <li key={insight.id} className="border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{insight.title}</p>
                  <span className="text-xs text-slate-500">
                    {new Date(insight.generatedAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">{insight.body}</p>
                {insight.healthScore != null && (
                  <span className="mt-1 inline-block text-xs text-emerald-600">
                    Score: {insight.healthScore}
                  </span>
                )}
              </li>
            ))}
            {!insights?.length && (
              <p className="text-sm text-slate-500">No insights generated yet</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
