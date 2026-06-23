export type PlanType = 'free' | 'premium';
export type PlanStatus = 'active' | 'inactive';

export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PlanRecord {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  planType: PlanType;
  appleProductId: string | null;
  androidProductId: string | null;
  status: PlanStatus;
  features: PlanFeature[];
  createdAt: string;
  updatedAt: string;
}
