import { BaseService } from '@/lib/api/base.service';
import type { AdminUserSubscriptionCheck } from '@/types/subscription';

class SubscriptionsService extends BaseService {
  /** Admin: verify a user's real subscription live with the store. */
  checkUserWithStore(userId: string) {
    return this.get<AdminUserSubscriptionCheck>(`/subscriptions/admin/users/${userId}/check`);
  }
}

export const subscriptionsService = new SubscriptionsService();
