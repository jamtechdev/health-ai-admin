import { BaseService } from '@/lib/api/base.service';
import type { AdminUserSubscriptionCheck, GrantProPayload, GrantedSubscription } from '@/types/subscription';

class SubscriptionsService extends BaseService {
  /** Admin: verify a user's real subscription live with the store. */
  checkUserWithStore(userId: string) {
    return this.get<AdminUserSubscriptionCheck>(`/subscriptions/admin/users/${userId}/check`);
  }

  /** Admin: grant Pro (premium) — unlimited or time-limited. */
  grantPro(userId: string, payload: GrantProPayload) {
    return this.post<GrantedSubscription>(`/subscriptions/admin/users/${userId}/grant`, payload);
  }
}

export const subscriptionsService = new SubscriptionsService();
