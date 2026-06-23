import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { PlanRecord } from '@/types/plan';

class PlansService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<PlanRecord>('/subscriptions/plans', params);
  }

  getById(id: string) {
    return this.get<PlanRecord>(`/subscriptions/plans/${id}`);
  }

  create(payload: {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    planType: 'free' | 'premium';
    appleProductId?: string;
    androidProductId?: string;
    status?: 'active' | 'inactive';
    features?: Record<string, unknown>;
  }) {
    return this.post<PlanRecord>('/subscriptions/plans', payload);
  }

  update(
    id: string,
    payload: {
      name?: string;
      description?: string;
      price?: number;
      durationDays?: number;
      planType?: 'free' | 'premium';
      appleProductId?: string;
      androidProductId?: string;
      status?: 'active' | 'inactive';
      features?: Record<string, unknown>;
    },
  ) {
    return this.put<PlanRecord>(`/subscriptions/plans/${id}`, payload);
  }

  remove(id: string) {
    return this.delete<{ message: string }>(`/subscriptions/plans/${id}`);
  }
}

export const plansService = new PlansService();
