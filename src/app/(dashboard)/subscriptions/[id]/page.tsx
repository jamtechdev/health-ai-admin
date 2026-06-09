'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Info, Clock, User, Hash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAdminSubscriptions } from '@/hooks/api/use-platform-health';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function SubscriptionViewPage() {
  const params = useParams();
  const router = useRouter();
  const subId = params.id as string;

  const { data, isLoading } = useAdminSubscriptions(1, '');
  const isDelayedLoading = useDelayedLoading(isLoading);
  const sub = data?.items.find(s => s.id === subId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading subscription details" />;
  }

  if (!sub) {
    return (
      <PageShell title="Subscription not found" description="This subscription record could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/subscriptions')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Subscriptions
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Billing"
      title="Subscription Detail"
      description={`Record ID: ${sub.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/subscriptions')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-primary" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
               sub.status === 'active' ? 'bg-brand-secondary/5 border-brand-secondary/20' : 'bg-surface-secondary border-brand-border/50'
            }`}>
               <p className="text-xs text-text-muted uppercase font-black tracking-[0.2em] mb-2">Current Plan Status</p>
               <p className={`text-4xl font-black uppercase ${sub.status === 'active' ? 'text-brand-secondary' : 'text-text-muted'}`}>
                  {sub.status}
               </p>
            </div>
            <div className="space-y-3 pt-2">
               <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                  <span className="text-sm text-text-muted">Expiry / Renewal Date</span>
                  <span className="font-semibold">{sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'Never'}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-secondary" />
              Subscriber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary border border-brand-border/50">
               <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold">
                  {sub.User?.name?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="font-bold text-lg">{sub.User?.name || 'Consumer User'}</p>
                  <p className="text-sm text-text-muted">{sub.User?.email || 'No email available'}</p>
               </div>
            </div>
            <div className="pt-2">
               <span className="text-xs text-text-muted block mb-1">Internal User ID</span>
               <code className="text-xs font-mono bg-surface-secondary px-2 py-1 rounded">{sub.userId}</code>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-text-muted" />
              Stripe Integration Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="p-4 rounded-xl bg-surface-secondary border border-brand-border/50">
                  <p className="text-xs text-text-muted uppercase font-bold mb-2">Customer ID</p>
                  <p className="font-mono text-sm break-all">{sub.stripeCustomerId || '—'}</p>
               </div>
               <div className="p-4 rounded-xl bg-surface-secondary border border-brand-border/50">
                  <p className="text-xs text-text-muted uppercase font-bold mb-2">Subscription ID</p>
                  <p className="font-mono text-sm break-all">{sub.stripeSubscriptionId || '—'}</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
