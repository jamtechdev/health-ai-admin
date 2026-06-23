'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plansService } from '@/services/plans.service';
import { queryKeys } from './query-keys';
import type { PlanFeature } from '@/types/plan';

type PlanMutationPayload = {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  planType: 'free' | 'premium';
  appleProductId?: string;
  androidProductId?: string;
  status?: 'active' | 'inactive';
  features?: PlanFeature[];
};

export function usePlansList(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.plans.list(page, search),
    queryFn: () =>
      plansService.list({ page, limit: 10, search: search || undefined }),
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: queryKeys.plans.detail(id),
    queryFn: () => plansService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanMutationPayload) => plansService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
    },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<PlanMutationPayload>) =>
      plansService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
    },
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plansService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plans.all });
    },
  });
}
