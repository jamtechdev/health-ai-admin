'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlanForm } from '../plan-form';
import { useCreatePlan } from '@/hooks/api/use-plans';
import { PageShell } from '@/components/ui/page-shell';

export default function CreatePlanPage() {
  const router = useRouter();
  const createPlan = useCreatePlan();

  const handleSubmit = async (values: {
    name: string;
    description: string;
    price: number;
    durationDays: number;
    planType: 'free' | 'premium';
    appleProductId: string;
    androidProductId: string;
    status: 'active' | 'inactive';
    features: Record<string, unknown>;
  }) => {
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
  };

  return (
    <PageShell eyebrow="Billing" title="Create Plan" description="Create a new subscription plan.">
      <PlanForm onSubmit={handleSubmit} />
    </PageShell>
  );
}
