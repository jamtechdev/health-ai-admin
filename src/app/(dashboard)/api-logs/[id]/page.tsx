'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Code, Clock, User, Globe, Hash, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAdminApiLogs } from '@/hooks/api/use-platform-health';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function ApiLogViewPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const { data, isLoading } = useAdminApiLogs(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const log = data?.items.find(l => l.id === logId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading API log details" />;
  }

  if (!log) {
    return (
      <PageShell title="Log not found" description="This API log could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/api-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to API Logs
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Observability"
      title="API Request Detail"
      description={`${log.method} ${log.path}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/api-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-brand-primary" />
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-secondary flex items-center justify-between">
               <div>
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Method</p>
                  <p className="text-2xl font-black text-brand-primary">{log.method}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Status</p>
                  <p className={`text-2xl font-black ${(log.statusCode ?? 0) >= 400 ? 'text-brand-critical' : 'text-brand-secondary'}`}>
                     {log.statusCode || '???' }
                  </p>
               </div>
            </div>
            <div className="space-y-3 pt-2 text-sm">
               <div className="flex justify-between">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-mono font-bold">{log.durationMs}ms</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-text-muted">User</span>
                  <span className="font-medium">{log.User?.email || 'Anonymous'}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-text-muted">Timestamp</span>
                  <span className="text-xs">{new Date(log.createdAt).toLocaleString()}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Path & User Agent */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-semibold">Request Path</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="font-mono text-sm bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-brand-border/50 break-all">
                   {log.path}
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-semibold">User Agent</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-xs text-text-secondary font-mono leading-relaxed">
                   {log.userAgent || 'No user agent header provided.'}
                </p>
             </CardContent>
           </Card>
        </div>

        {/* Payload & Errors */}
        <Card className="lg:col-span-3">
           <CardHeader className="border-b border-brand-border/50">
              <CardTitle className="flex items-center gap-2">
                 <Code className="h-5 w-5 text-brand-tertiary" />
                 Data Payload
              </CardTitle>
           </CardHeader>
           <CardContent className="pt-6 space-y-6">
              {(log as any).payload ? (
                 <div>
                    <h4 className="text-xs font-bold uppercase text-text-muted mb-2 tracking-widest">Request Body</h4>
                    <pre className="p-4 rounded-xl bg-surface-elevated border border-brand-border overflow-auto max-h-96 font-mono text-[11px] leading-relaxed">
                       {typeof (log as any).payload === 'string' ? (log as any).payload : JSON.stringify((log as any).payload, null, 2)}
                    </pre>
                 </div>
              ) : (
                 <p className="text-sm text-text-muted italic">No payload sent with this request.</p>
              )}

              {(log as any).error && (
                 <div className="pt-4 border-t border-brand-border/50">
                    <h4 className="text-xs font-bold uppercase text-brand-critical mb-2 tracking-widest flex items-center gap-2">
                       <AlertCircle className="h-3 w-3" />
                       Error Trace
                    </h4>
                    <pre className="p-4 rounded-xl bg-brand-critical/5 border border-brand-critical/20 text-brand-critical overflow-auto max-h-96 font-mono text-[11px] leading-relaxed">
                       {typeof (log as any).error === 'string' ? (log as any).error : JSON.stringify((log as any).error, null, 2)}
                    </pre>
                 </div>
              )}
           </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
