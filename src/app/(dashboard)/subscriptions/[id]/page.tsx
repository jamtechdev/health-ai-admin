'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, CreditCard, Tag, DollarSign, Calendar, Hash, Apple, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { usePlan } from '@/hooks/api/use-plans';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function PlanViewPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { data: plan, isLoading } = usePlan(planId);
  const isDelayedLoading = useDelayedLoading(isLoading);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading plan details" />;
  }

  if (!plan) {
    return (
      <PageShell title="Plan not found" description="This plan record could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/subscriptions')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Billing"
      title={plan.name}
      description={`${plan.planType === 'free' ? 'Free' : 'Premium'} subscription plan`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/subscriptions')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push(`/subscriptions/${planId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Plan
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-brand-primary" />
                Plan Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-brand-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-brand-primary" />
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-text-muted block">Plan Name</span>
                  <span className="text-lg font-bold">{plan.name}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Type</span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${plan.planType === 'free' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600'}`}>
                    {plan.planType}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Status</span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${plan.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {plan.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface-secondary/50 p-4 rounded-lg border border-brand-border/50 italic">
                {plan.description || 'No description provided for this plan.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="border-b border-brand-border/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-brand-tertiary" />
                Pricing & Details
              </CardTitle>
              <p className="text-sm text-text-muted mt-1">
                Configuration details for this subscription plan.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50">
                  <DollarSign className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Price</p>
                    <p className="text-sm font-semibold">${Number(plan.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Duration</p>
                    <p className="text-sm font-semibold">{plan.durationDays} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50">
                  <Apple className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Apple Product ID</p>
                    <p className="text-sm font-semibold">{plan.appleProductId || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50">
                  <Hash className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Android Product ID</p>
                    <p className="text-sm font-semibold">{plan.androidProductId || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50">
                  <Hash className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Plan ID</p>
                    <p className="text-sm font-mono text-text-secondary">{plan.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
