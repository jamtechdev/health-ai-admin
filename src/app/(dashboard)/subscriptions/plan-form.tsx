'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PlanFormValues {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  planType: 'free' | 'premium';
  appleProductId: string;
  androidProductId: string;
  status: 'active' | 'inactive';
  features: Record<string, unknown>;
}

interface PlanFormProps {
  initialValues?: PlanFormValues;
  onSubmit: (values: PlanFormValues) => void;
  isSubmitting?: boolean;
}

export function PlanForm({ initialValues, onSubmit, isSubmitting }: PlanFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? 0);
  const [durationDays, setDurationDays] = useState(initialValues?.durationDays ?? 30);
  const [planType, setPlanType] = useState<'free' | 'premium'>(initialValues?.planType ?? 'premium');
  const [appleProductId, setAppleProductId] = useState(initialValues?.appleProductId ?? '');
  const [androidProductId, setAndroidProductId] = useState(initialValues?.androidProductId ?? '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initialValues?.status ?? 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, price, durationDays, planType, appleProductId, androidProductId, status, features: {} });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Plan name" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Plan description" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Price ($)</label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Duration (days)</label>
              <Input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} required />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Plan Type</label>
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-brand-primary/40 has-[:checked]:bg-brand-primary/10 has-[:checked]:text-brand-primary">
                <input type="radio" name="planType" className="h-4 w-4 accent-brand-primary" value="free" checked={planType === 'free'} onChange={() => setPlanType('free')} />
                Free
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-brand-primary/40 has-[:checked]:bg-brand-primary/10 has-[:checked]:text-brand-primary">
                <input type="radio" name="planType" className="h-4 w-4 accent-brand-primary" value="premium" checked={planType === 'premium'} onChange={() => setPlanType('premium')} />
                Premium
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Apple Product ID</label>
            <Input value={appleProductId} onChange={(e) => setAppleProductId(e.target.value)} placeholder="com.example.product.weekly" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Android Product ID</label>
            <Input value={androidProductId} onChange={(e) => setAndroidProductId(e.target.value)} placeholder="com.example.product.monthly" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-green-500/40 has-[:checked]:bg-green-500/10 has-[:checked]:text-green-600">
                <input type="radio" name="status" className="h-4 w-4 accent-green-600" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                Active
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-red-500/40 has-[:checked]:bg-red-500/10 has-[:checked]:text-red-600">
                <input type="radio" name="status" className="h-4 w-4 accent-red-600" value="inactive" checked={status === 'inactive'} onChange={() => setStatus('inactive')} />
                Inactive
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {initialValues ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
}
