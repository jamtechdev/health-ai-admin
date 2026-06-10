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

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, 'unread-count'],
    queryFn: async () => {
      const res = await notificationsService.list({ page: 1, limit: 1, read: 'false' } as any);
      return res?.meta?.total ?? 0;
    },
    refetchInterval: 5000, // Check every 5 seconds for live feel
  });
}

export function useNotificationDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.notifications.detail(id),
    queryFn: () => notificationsService.getById(id),
    enabled: !!id,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}
