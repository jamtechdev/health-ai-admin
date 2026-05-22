'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, Shield, Bell, HeartPulse, Watch, Sparkles, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/api/use-dashboard';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-brand-primary' },
  { key: 'activeUsers', label: 'Active Users', icon: UserCheck, color: 'text-brand-secondary' },
  { key: 'totalRoles', label: 'Roles', icon: Shield, color: 'text-brand-tertiary' },
  { key: 'unreadNotifications', label: 'Unread', icon: Bell, color: 'text-brand-warning' },
] as const;

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-text-muted">Overview of TovaPulse operations</p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-text-muted">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.usersByMonth ?? []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-brand-border" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D94343" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
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
                      {item.user?.name ?? 'System'} · {new Date(item.createdAt).toLocaleString()}
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
    </div>
  );
}
