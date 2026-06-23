import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { PlanFeature, PlanRecord } from '@/types/plan';

type PlanPayload = {
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

class PlansService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<PlanRecord>('/subscriptions/plans', params);
  }

  getById(id: string) {
    return this.get<PlanRecord>(`/subscriptions/plans/${id}`);
  }

  create(payload: PlanPayload) {
    return this.post<PlanRecord>('/subscriptions/plans', payload);
  }

  update(id: string, payload: Partial<PlanPayload>) {
    return this.put<PlanRecord>(`/subscriptions/plans/${id}`, payload);
  }

  remove(id: string) {
    return this.delete<{ message: string }>(`/subscriptions/plans/${id}`);
  }
}

export const plansService = new PlansService();
