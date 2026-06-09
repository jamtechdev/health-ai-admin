'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Database, Info, Clock, User, Watch, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAdminSyncLogs } from '@/hooks/api/use-platform-health';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function DeviceSyncLogViewPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const { data, isLoading } = useAdminSyncLogs(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const log = data?.items.find(l => l.id === logId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading sync log details" />;
  }

  if (!log) {
    return (
      <PageShell title="Log not found" description="This device sync log could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/device-sync-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sync Logs
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Sync Health"
      title="Sync Operation Detail"
      description={`Log ID: ${log.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/device-sync-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Operation Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-brand-primary" />
              Sync Operation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
               log.status === 'success' ? 'bg-brand-secondary/5 border-brand-secondary/20' : 'bg-brand-critical/5 border-brand-critical/20'
            }`}>
               <div>
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Status</p>
                  <p className={`text-2xl font-bold uppercase ${log.status === 'success' ? 'text-brand-secondary' : 'text-brand-critical'}`}>
                     {log.status}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Metrics</p>
                  <p className="text-2xl font-bold">{log.metricsSynced || 0}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
               <div className="h-10 w-10 rounded-lg bg-surface-secondary flex items-center justify-center">
                  <Watch className="h-5 w-5 text-brand-primary" />
               </div>
               <div>
                  <p className="text-sm font-semibold capitalize">{log.provider.replace('_', ' ')}</p>
                  <p className="text-xs text-text-muted">Data Provider</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-secondary" />
              App User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary border border-brand-border/50">
               <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold">
                  {log.User?.name?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="font-bold">{log.User?.name || 'Consumer User'}</p>
                  <p className="text-sm text-text-muted">User ID: {log.userId}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Details */}
        {log.errorMessage && (
           <Card className="lg:col-span-2 border-brand-critical/30">
             <CardHeader className="bg-brand-critical/5 border-b border-brand-critical/10">
               <CardTitle className="flex items-center gap-2 text-brand-critical text-sm">
                 <AlertCircle className="h-4 w-4" />
                 Failure Reason
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
                <p className="text-sm font-mono text-brand-critical bg-brand-critical/5 p-4 rounded-lg border border-brand-critical/20">
                   {log.errorMessage}
                </p>
             </CardContent>
           </Card>
        )}

        {/* Timing */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-text-muted" />
              Timing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex justify-between items-center py-2">
                <span className="text-sm text-text-muted">Job Execution Time</span>
                <span className="font-medium">{new Date(log.createdAt).toLocaleString()}</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
