'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountRequestsService } from '@/services/account-requests.service';
import { queryKeys } from './query-keys';

export function useAccountRequests(page: number) {
  return useQuery({
    queryKey: queryKeys.accountRequests.list(page),
    queryFn: () => accountRequestsService.list({ page, limit: 10 }),
  });
}

export function useRevertRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountRequestsService.revert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountRequests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function usePermanentDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountRequestsService.permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountRequests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
