'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Activity, HeartPulse, Flame, Footprints, Moon, TrendingUp, Search, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useConsumerDailySnapshots, useConsumersList } from '@/hooks/api/use-platform-health';

const PRESETS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
] as const;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Steps: Footprints,
  'Active Energy': Flame,
  'Sleep Duration': Moon,
  HRV: HeartPulse,
  'Resting HR': Activity,
  Workouts: TrendingUp,
  'Blood Oxygen': Activity,
  'Heart Rate': HeartPulse,
  'Sleep Score': Moon,
};

const CHART_COLORS = ['var(--primary)', 'var(--brand-secondary)', 'var(--brand-tertiary)'];

export default function HealthHistoryPage() {
  const [days, setDays] = useState(7);
  const [userId, setUserId] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const from = daysAgo(days);
  const to = todayStr();

  const { data: consumersData } = useConsumersList(1, search || '_____');
  const { data, isLoading } = useConsumerDailySnapshots(userId, from, to);

  const consumers = useMemo(() => consumersData?.items ?? [], [consumersData]);

  const selectedUser = useMemo(
    () => consumers.find((c: { user: { id: string } }) => c.user.id === userId),
    [consumers, userId],
  );

  const chartData = useMemo(() => {
    if (!data?.activitySummary?.length) return [];
    return data.activitySummary.map((a: Record<string, unknown>) => ({
      date: new Date(a.date as string).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      steps: (a.steps as number) ?? 0,
      calories: (a.calories as number) ?? 0,
      activeMinutes: (a.activeMinutes as number) ?? 0,
    }));
  }, [data]);

  const lineChartData = useMemo(() => {
    if (!data?.trends) return [];
    const vals = data.trends;
    const len = vals.recovery.length;
    return Array.from({ length: len }, (_, i) => ({
      day: i + 1,
      recovery: vals.recovery[i] ?? 0,
      steps: vals.steps[i] ?? 0,
      heartRate: vals.heartRate[i] ?? 0,
    }));
  }, [data]);

  const barKeys = ['steps', 'calories', 'activeMinutes'];
  const lineKeys = ['recovery', 'steps', 'heartRate'];

  const handleSelect = useCallback((id: string) => {
    setUserId(id);
    setOpen(false);
    setSearch('');
  }, []);

  return (
    <PageShell
      eyebrow="Health AI"
      title="Health History"
      description="Select a user and date range to view their daily metric snapshots, trends, and workout sessions."
    >
      {/* User selector */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-brand-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-text-muted shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
            placeholder="Search user by name or email..."
            value={open ? search : (selectedUser ? (selectedUser as unknown as { user: { name: string; email: string } }).user?.name || (selectedUser as unknown as { user: { email: string } }).user?.email : '')}
            onFocus={() => setOpen(true)}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          />
          {userId && (
            <button onClick={() => { setUserId(''); setSearch(''); }}>
              <X className="h-4 w-4 text-text-muted" />
            </button>
          )}
        </div>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-xl border border-brand-border bg-background shadow-xl">
              {consumers.length === 0 ? (
                <p className="p-4 text-sm text-text-muted">No users found</p>
              ) : (
                consumers.map((c: { user: { id: string; name: string; email: string } }) => (
                  <button
                    key={c.user.id}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-surface-secondary ${c.user.id === userId ? 'bg-brand-primary/10' : ''}`}
                    onClick={() => handleSelect(c.user.id)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">
                      {(c.user.name || c.user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{c.user.name || 'Unnamed'}</p>
                      <p className="text-xs text-text-muted">{c.user.email}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {!userId ? (
        <Card><CardContent className="py-12 text-center text-text-muted">Select a user to view their health history.</CardContent></Card>
      ) : (
        <>
          {/* Period presets */}
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <Button key={p.days} variant={days === p.days ? 'default' : 'outline'} size="sm" onClick={() => setDays(p.days)}>
                {p.label}
              </Button>
            ))}
            <span className="ml-auto text-xs text-text-muted">
              {data?.range?.label ?? 'Loading...'} · {data?.range?.helperText ?? ''}
            </span>
          </div>

          {isLoading ? (
            <VitalsLoader label="Loading health history" className="min-h-[300px]" />
          ) : !data ? (
            <Card><CardContent className="py-8 text-center text-text-muted">No data available for this user.</CardContent></Card>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.metrics.map((m, i) => {
                  const Icon = METRIC_ICONS[m.label] ?? Activity;
                  return (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-text-muted">{m.label}</CardTitle>
                          <Icon className="h-4 w-4 text-brand-primary" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{m.value}</p>
                          <p className="text-xs text-text-muted">{m.unit} avg</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Daily Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <p className="text-sm text-text-muted">Steps, active calories, and active minutes per day</p>
                </CardHeader>
                <CardContent className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-input-value)', color: 'var(--text-primary)' }} />
                      {barKeys.map((k, i) => (
                        <Bar key={k} dataKey={k} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trend Charts */}
              <div className="grid gap-6 lg:grid-cols-3">
                {lineKeys.map((key, i) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="capitalize">{key} Trend</CardTitle>
                      <p className="text-xs text-text-muted">Normalized 0-1 over {days} days</p>
                    </CardHeader>
                    <CardContent className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineChartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={CHART_COLORS[i]} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={CHART_COLORS[i]} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 1]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-input-value)', color: 'var(--text-primary)' }} />
                          <Area type="monotone" dataKey={key} stroke={CHART_COLORS[i]} fill={`url(#grad-${key})`} strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sessions */}
              {data.sessions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Sessions ({data.sessions.length})</CardTitle>
                    <p className="text-sm text-text-muted">Workout records in this date range</p>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-brand-border">
                      {data.sessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-text-muted">{new Date(s.recordedAt).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{s.value}</p>
                            <p className="text-xs text-text-muted">{s.unit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </PageShell>
  );
}
