export interface UserSubscriptionRecord {
  id: string;
  planId: string;
  planName: string | null;
  status: 'active' | 'expired' | 'cancelled' | 'refunded' | 'pending';
  platform: 'android' | 'ios' | null;
  startDate: string;
  expiryDate: string | null;
  purchaseDate: string | null;
  transactionId: string | null;
  autoRenew: boolean;
  isTrial: boolean;
  Plan?: { name: string; planType: string; price?: number; durationDays?: number; description?: string | null };
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  status: string;
  avatar?: string | null;
  roles?: { id: string; name: string; slug: string }[];
  deletedAt?: string | null;
  createdAt: string;
  profile?: UserHealthProfileData | null;
  activeSubscription?: UserSubscriptionRecord | null;
  subscriptionHistory?: UserSubscriptionRecord[];
}

export interface UserHealthProfileData {
  age?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  weightUnit?: string | null;
  heightCm?: number | null;
  heightUnit?: string | null;
  targetWeightKg?: number | null;
  targetWeightUnit?: string | null;
  primaryGoal?: string | null;
  activityLevel?: string | null;
  sleepGoal?: number | null;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  status?: string;
  roleIds?: string[];
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  password?: string;
  status?: string;
  avatar?: string | null;
  roleIds?: string[];
  age?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  weightUnit?: string | null;
  heightCm?: number | null;
  heightUnit?: string | null;
  targetWeightKg?: number | null;
  targetWeightUnit?: string | null;
  primaryGoal?: string | null;
  activityLevel?: string | null;
  sleepGoal?: number | null;
}
