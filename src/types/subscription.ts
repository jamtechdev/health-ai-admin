export interface MobileSubscriptionStatus {
  is_subscribed: boolean;
  is_expired: boolean;
  is_product_purchase: boolean;
  platform: string | null;
  productId: string | null;
  subscription: {
    subscription_type: string | null;
    subscription_status: boolean;
    expires_date: string | null;
    original_transaction_id?: string | null;
    plan_name?: string | null;
    plan_type?: string | null;
    days_remaining?: number;
    auto_renew?: boolean;
  } | null;
  pending: unknown | null;
}

export interface StoreCheckResult {
  source: 'app_store' | 'google_play';
  environment?: 'Sandbox' | 'Production';
  subscriptionState?: string;
  status: MobileSubscriptionStatus;
}

export interface LocalSubscriptionView {
  id: string;
  planName: string | null;
  planType: string | null;
  platform: 'android' | 'ios' | null;
  status: string;
  transactionId: string | null;
  receiptToken: string | null;
  expiryDate: string | null;
  autoRenew: boolean;
  isTrial: boolean;
  daysRemaining: number;
}

export interface AdminUserSubscriptionCheck {
  userId: string;
  hasStorePurchase: boolean;
  local: LocalSubscriptionView | null;
  store: StoreCheckResult | null;
  storeError: string | null;
}

export type GrantProPayload = {
  unlimited?: boolean;
  durationDays?: number;
  expiryDate?: string | null;
  planId?: string;
};

export interface GrantedSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string | null;
  planType: string | null;
  platform: string | null;
  status: string;
  expiryDate: string | null;
  startDate: string;
  autoRenew: boolean;
  isTrial: boolean;
  daysRemaining: number;
}
