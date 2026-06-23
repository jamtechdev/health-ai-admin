'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlanForm } from '../plan-form';
import { useCreatePlan } from '@/hooks/api/use-plans';
import { PageShell } from '@/components/ui/page-shell';

export default function CreatePlanPage() {
  const router = useRouter();
  const createPlan = useCreatePlan();

  return (
    <PageShell eyebrow="Billing" title="Create Plan" description="Create a new subscription plan with features.">
      <PlanForm
        isSubmitting={createPlan.isPending}
        onSubmit={async (values) => {
          try {
            await createPlan.mutateAsync({
              ...values,
              description: values.description || undefined,
              appleProductId: values.appleProductId || undefined,
              androidProductId: values.androidProductId || undefined,
            });
            toast.success('Plan created');
            router.push('/subscriptions');
          } catch {
            toast.error('Failed to create plan');
          }
        }}
      />
    </PageShell>
  );
}
