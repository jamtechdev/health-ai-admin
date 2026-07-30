'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsService } from '@/services/subscriptions.service';
import { queryKeys } from '@/hooks/api/query-keys';
import type { GrantProPayload } from '@/types/subscription';

/**
 * Admin: verify a user's real subscription live with the store (Apple/Google).
 * Exposed as a mutation because it triggers a live store network call on demand.
 */
export function useCheckUserSubscription() {
  return useMutation({
    mutationFn: (userId: string) => subscriptionsService.checkUserWithStore(userId),
  });
}

/** Admin: grant Pro (premium) access — unlimited or time-limited. */
export function useGrantPro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: GrantProPayload }) =>
      subscriptionsService.grantPro(userId, payload),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
