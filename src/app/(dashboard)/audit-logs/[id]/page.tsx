'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Info, Clock, User, Fingerprint, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAuditLogs } from '@/hooks/api/use-logs';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function AuditLogViewPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const { data, isLoading } = useAuditLogs(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const log = data?.items.find(l => l.id === logId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading audit trail details" />;
  }

  if (!log) {
    return (
      <PageShell title="Log not found" description="This audit log could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/audit-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Audit Logs
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Governance"
      title="Audit Event Detail"
      description={`Reference: ${log.entity} / ${log.action}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/audit-logs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Action Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-primary" />
              Administrative Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
               <p className="text-xs text-brand-primary uppercase font-black tracking-widest mb-1">Action</p>
               <p className="text-2xl font-bold uppercase">{log.action}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="text-xs text-text-muted block">Target Entity</span>
                  <span className="font-semibold">{log.entity}</span>
               </div>
               <div>
                  <span className="text-xs text-text-muted block">Recorded At</span>
                  <span className="font-medium text-sm">{new Date(log.createdAt).toLocaleString()}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Actor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-secondary" />
              Performed By
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary">
               <div className="h-12 w-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-xl font-bold border-2 border-brand-secondary/20">
                  {log.actor?.name?.charAt(0) || 'A'}
               </div>
               <div>
                  <p className="font-bold text-lg">{log.actor?.name || 'System Actor'}</p>
                  <p className="text-sm text-text-muted">ID: {(log.actor as any)?.id || 'N/A'}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Entity Reference */}
        <Card className="lg:col-span-2">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Fingerprint className="h-5 w-5 text-text-muted" />
                 Object Reference
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-secondary border border-brand-border/50 font-mono text-xs">
                 <span className="text-text-muted shrink-0">Entity UUID:</span>
                 <span className="truncate">{log.entityId}</span>
              </div>
           </CardContent>
        </Card>

        {/* Metadata JSON */}
        <Card className="lg:col-span-2">
           <CardHeader className="border-b border-brand-border/50">
              <CardTitle className="flex items-center gap-2">
                 <Database className="h-5 w-5 text-brand-tertiary" />
                 Contextual Metadata
              </CardTitle>
           </CardHeader>
           <CardContent className="pt-6">
              {(log as any).metadata ? (
                 <pre className="p-5 rounded-2xl bg-surface-elevated border border-brand-border overflow-auto max-h-[500px] font-mono text-[11px] leading-relaxed shadow-inner">
                    {typeof (log as any).metadata === 'string' ? (log as any).metadata : JSON.stringify((log as any).metadata, null, 3)}
                 </pre>
              ) : (
                 <div className="py-12 text-center text-text-muted italic">
                    No additional metadata recorded for this event.
                 </div>
              )}
           </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
