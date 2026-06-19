'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, Shield, Bell, HeartPulse, Watch, Sparkles, Database, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useDashboardStats } from '@/hooks/api/use-dashboard';
import Link from 'next/link';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-brand-primary' },
  { key: 'activeUsers', label: 'Active Users', icon: UserCheck, color: 'text-brand-secondary' },
  { key: 'totalRoles', label: 'Roles', icon: Shield, color: 'text-brand-tertiary' },
  { key: 'unreadNotifications', label: 'Unread', icon: Bell, color: 'text-brand-warning' },
] as const;

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure live layout has stabilized
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageShell
      eyebrow="Command Center"
      title="Dashboard"
      description="Overview of TovaPulse operations, app users, biometrics, and platform activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const value = data?.[stat.key as keyof typeof data] ?? 0;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">{stat.label}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{isLoading ? '—' : String(value)}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {data?.contacts && (
        <Card className="min-w-0">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Contact Inquiries</CardTitle>
              <p className="mt-1 text-sm text-text-muted">
                Pending support requests and the latest admin replies
              </p>
            </div>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
            >
              Open contacts
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Pending', value: data.contacts.pendingCount },
                { label: 'Replied', value: data.contacts.repliedCount },
                { label: 'Closed', value: data.contacts.closedCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-card border border-brand-border/80 bg-surface-elevated/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">{item.label}</p>
                    <Mail className="h-4 w-4 text-brand-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {(data.contacts.recentContacts ?? []).map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-card border border-brand-border/70 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-text-muted">{contact.email}</p>
                      <p className="mt-2 text-sm text-text-secondary">{contact.subject || 'No subject'}</p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-brand-secondary/10 px-2.5 py-1 text-xs font-semibold capitalize text-brand-secondary">
                      {contact.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{contact.message}</p>
                  {contact.adminReply && (
                    <div className="mt-3 rounded-card border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                        Latest admin reply
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm text-text-secondary">{contact.adminReply}</p>
                      {contact.repliedAt && (
                        <p className="mt-2 text-xs text-text-muted">
                          {new Date(contact.repliedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {!isLoading && !data.contacts.recentContacts?.length && (
                <p className="text-sm text-text-muted">No contact requests yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {data?.healthPlatform && (
        <>
          <div>
            <h3 className="text-lg font-semibold">TovaPulse Biometrics</h3>
            <p className="text-sm text-text-muted">App users, wearables, active biometrics, and AI insights</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'App users', value: data.healthPlatform.totalConsumers, icon: HeartPulse },
              { label: 'Devices', value: data.healthPlatform.connectedDevices, icon: Watch },
              { label: 'Insights today', value: data.healthPlatform.insightsToday, icon: Sparkles },
              { label: 'Total metrics', value: data.healthPlatform.totalMetrics, icon: Database },
              { label: 'Total insights', value: data.healthPlatform.totalInsights, icon: Sparkles },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-text-muted">{item.label}</CardTitle>
                      <Icon className="h-5 w-5 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{isLoading ? '—' : String(item.value)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs text-text-muted">
            Integrations: Oura {data.healthPlatform.integrations.oura ? 'on' : 'off'} · OpenAI{' '}
            {data.healthPlatform.integrations.openai ? 'on' : 'rule-based'}
          </p>
        </>
      )}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full min-w-0">
            {isLoading || !mounted ? (
              <VitalsLoader label="Charting user growth" compact className="h-full min-h-0 border-0 bg-transparent shadow-none" />
            ) : (
              <div className="h-full w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.usersByMonth ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={{ stroke: 'var(--border)' }}
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      axisLine={{ stroke: 'var(--border)' }}
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--primary-glow)' }}
                      contentStyle={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-input-value)',
                        boxShadow: 'var(--shadow-floating-value)',
                        color: 'var(--text-primary)',
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(data?.recentActivity ?? []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 border-b border-brand-border pb-3 last:border-0"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-brand-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-text-muted">
                      {item.user?.name ?? item.user?.email ?? 'App user'} · {item.source ?? item.module} ·{' '}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
              {!isLoading && !data?.recentActivity?.length && (
                <p className="text-sm text-text-muted">No recent activity</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
