'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Info, Clock, User, Globe, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useActivityLogs } from '@/hooks/api/use-logs';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function ActivityLogViewPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const { data, isLoading } = useActivityLogs(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const log = data?.items.find(l => l.id === logId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading activity log" />;
  }

  if (!log) {
    return (
      <PageShell title="Log not found" description="This activity log could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/activity-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Logs
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Monitoring"
      title="Activity Detail"
      description={`Log ID: ${log.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/activity-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-brand-primary" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Activity className="h-6 w-6" />
               </div>
               <div>
                  <p className="font-bold text-lg capitalize">{log.module} Event</p>
                  <p className="text-sm text-text-muted">{log.description}</p>
               </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-brand-border/50 text-sm">
               <div className="flex justify-between">
                  <span className="text-text-muted">Module</span>
                  <span className="font-medium capitalize">{log.module}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <span className="font-medium text-brand-secondary">SUCCESS</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-secondary" />
              Actor Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
               <div className="h-10 w-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-sm font-bold">
                  {log.user?.name?.charAt(0) || 'S'}
               </div>
               <div>
                  <p className="font-semibold">{log.user?.name || 'System / Anonymous'}</p>
                  <p className="text-xs text-text-muted">{log.user?.email || 'No email associated'}</p>
               </div>
            </div>
            <div className="space-y-2 pt-2 text-xs">
               <div className="flex items-center gap-2 text-text-muted">
                  <Globe className="h-3 w-3" />
                  <span>IP: {log.ip || 'Local / Unknown'}</span>
               </div>
               <div className="flex items-start gap-2 text-text-muted">
                  <Server className="h-3 w-3 mt-0.5" />
                  <span className="break-all line-clamp-2">Agent: {log.userAgent || 'Unknown'}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-text-muted" />
              Timestamp
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-2xl font-mono font-bold text-foreground">
                {new Date(log.createdAt).toLocaleString()}
             </p>
             <p className="text-sm text-text-muted mt-1 italic">
                Precise system time when this event was recorded.
             </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
