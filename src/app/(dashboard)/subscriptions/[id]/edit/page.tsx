'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlanForm } from '../../plan-form';
import { usePlan, useUpdatePlan } from '@/hooks/api/use-plans';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { data: plan, isLoading } = usePlan(planId);
  const updatePlan = useUpdatePlan();
  const isDelayedLoading = useDelayedLoading(isLoading);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading plan details" />;
  }

  if (!plan) {
    return (
      <PageShell title="Plan not found" description="The plan you are trying to edit does not exist.">
        <Button variant="outline" onClick={() => router.push('/subscriptions')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Billing"
      title={`Edit: ${plan.name}`}
      description="Update subscription plan details, pricing, and features."
      actions={
        <Button variant="outline" onClick={() => router.push(`/subscriptions/${planId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>
      }
    >
      <PlanForm
        isSubmitting={updatePlan.isPending}
        initialValues={{
          name: plan.name,
          description: plan.description ?? '',
          price: Number(plan.price),
          durationDays: plan.durationDays,
          planType: plan.planType,
          appleProductId: plan.appleProductId ?? '',
          androidProductId: plan.androidProductId ?? '',
          status: plan.status,
          features: plan.features,
        }}
        onSubmit={async (values) => {
          try {
            await updatePlan.mutateAsync({
              id: planId,
              ...values,
              description: values.description || undefined,
              appleProductId: values.appleProductId || undefined,
              androidProductId: values.androidProductId || undefined,
            });
            toast.success('Plan updated successfully');
            router.push(`/subscriptions/${planId}`);
          } catch {
            toast.error('Failed to update plan');
          }
        }}
      />
    </PageShell>
  );
}
