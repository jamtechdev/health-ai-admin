'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Watch, Info, Clock, User, Link2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAdminWearables } from '@/hooks/api/use-platform-health';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function WearableViewPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.id as string;

  const { data, isLoading } = useAdminWearables(1, '');
  const isDelayedLoading = useDelayedLoading(isLoading);
  const device = data?.items.find(d => d.id === deviceId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading connection details" />;
  }

  if (!device) {
    return (
      <PageShell title="Connection not found" description="This wearable connection could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/wearables')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wearables
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Health Signals"
      title="Wearable Connection"
      description={`Connection ID: ${device.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/wearables')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Watch className="h-5 w-5 text-brand-primary" />
              Provider Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-secondary border border-brand-border/50">
               <div className="h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
                  <Watch className="h-10 w-10" />
               </div>
               <p className="text-2xl font-black capitalize">{device.provider.replace('_', ' ')}</p>
               <div className={`mt-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  device.status === 'connected' ? 'bg-brand-secondary/15 text-brand-secondary' : 'bg-surface-elevated text-text-muted'
               }`}>
                  {device.status}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* User Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-secondary" />
              Connected User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary">
               <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold border-2 border-brand-primary/20">
                  {device.User?.name?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="font-bold text-lg">{device.User?.name || 'Consumer User'}</p>
                  <p className="text-sm text-text-muted">{device.User?.email || 'No email'}</p>
               </div>
            </div>
            <div className="space-y-3 pt-2 text-sm">
               <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                  <span className="text-text-muted">Internal User ID</span>
                  <code className="text-xs font-mono">{device.userId}</code>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Info */}
        <Card className="lg:col-span-2">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <RefreshCw className="h-5 w-5 text-brand-tertiary" />
                 Synchronization Status
              </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center">
                    <Clock className="h-5 w-5 text-text-muted" />
                 </div>
                 <div>
                    <p className="text-sm font-medium">Last Successful Sync</p>
                    <p className="text-base font-bold text-foreground">
                       {device.lastSyncAt ? new Date(device.lastSyncAt).toLocaleString() : 'Never synced'}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center">
                    <Link2 className="h-5 w-5 text-text-muted" />
                 </div>
                 <div>
                    <p className="text-sm font-medium">Connection Established</p>
                    <p className="text-base font-bold text-foreground">
                       {(device as any).createdAt ? new Date((device as any).createdAt).toLocaleString() : '—'}
                    </p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
