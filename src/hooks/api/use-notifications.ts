'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications.service';
import { queryKeys } from './query-keys';

export function useNotificationsList(page = 1) {
  return useQuery({
    queryKey: [...queryKeys.notifications.list(), page],
    queryFn: () => notificationsService.list({ page, limit: 10 }),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}
