'use client';

import { useMutation } from '@tanstack/react-query';
import { subscriptionsService } from '@/services/subscriptions.service';

/**
 * Admin: verify a user's real subscription live with the store (Apple/Google).
 * Exposed as a mutation because it triggers a live store network call on demand.
 */
export function useCheckUserSubscription() {
  return useMutation({
    mutationFn: (userId: string) => subscriptionsService.checkUserWithStore(userId),
  });
}
