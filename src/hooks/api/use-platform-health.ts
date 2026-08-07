'use client';

import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { platformHealthService } from '@/services/platform-health.service';
import { queryKeys } from './query-keys';

export function useHealthPlatformOverview() {
  return useQuery({
    queryKey: queryKeys.platformHealth.overview,
    queryFn: () => platformHealthService.overview(),
  });
}

export function useConsumersList(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.consumers(page, search),
    queryFn: () => platformHealthService.listConsumers({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}

export function useConsumerDetail(userId: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.consumer(userId),
    queryFn: () => platformHealthService.consumerDetail(userId),
    enabled: Boolean(userId),
  });
}

export function useConsumerDevices(userId: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.devices(userId),
    queryFn: () => platformHealthService.consumerDevices(userId),
    enabled: Boolean(userId),
  });
}

export function useConsumerMetrics(userId: string, days: number) {
  return useQuery({
    queryKey: queryKeys.platformHealth.metrics(userId, days),
    queryFn: () => platformHealthService.consumerMetrics(userId, days),
    enabled: Boolean(userId),
  });
}

export function useConsumerInsights(userId: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.insights(userId),
    queryFn: () => platformHealthService.consumerInsights(userId),
    enabled: Boolean(userId),
  });
}

export function useGenerateInsight(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => platformHealthService.generateInsight(userId),
    onSuccess: () => {
      toast.success('AI insight generated');
      void qc.invalidateQueries({ queryKey: queryKeys.platformHealth.consumer(userId) });
      void qc.invalidateQueries({ queryKey: queryKeys.platformHealth.insights(userId) });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: () => toast.error('Failed to generate insight'),
  });
}

export function useSyncConsumerDevices(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => platformHealthService.syncDevices(userId),
    onSuccess: () => {
      toast.success('Device sync triggered');
      void qc.invalidateQueries({ queryKey: queryKeys.platformHealth.consumer(userId) });
    },
    onError: () => toast.error('Sync failed'),
  });
}

export function useAdminAnalyticsOverview() {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminAnalytics,
    queryFn: () => platformHealthService.adminAnalyticsOverview(),
  });
}

export function useAdminWearables(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminWearables(page, search),
    queryFn: () => platformHealthService.adminWearables({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminInsights(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminInsights(page, search),
    queryFn: () => platformHealthService.adminInsights({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminSubscriptions(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminSubscriptions(page, search),
    queryFn: () => platformHealthService.adminSubscriptions({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminSyncLogs(page: number) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminSyncLogs(page),
    queryFn: () => platformHealthService.adminSyncLogs({ page, limit: 20 }),
  });
}

export function useAdminApiLogs(page: number) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminApiLogs(page),
    queryFn: () => platformHealthService.adminApiLogs({ page, limit: 20 }),
  });
}

export function useAdminDailySnapshots(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.dailySnapshots(from, to),
    queryFn: () => platformHealthService.dailySnapshotsHistory(from, to),
  });
}

export function useConsumerDailySnapshots(userId: string, from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.consumerDailySnapshots(userId, from, to),
    queryFn: () => platformHealthService.consumerDailySnapshots(userId, from, to),
    enabled: Boolean(userId),
  });
}

export function useAdminUserDevices(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminUserDevices(page, search),
    queryFn: () => platformHealthService.adminUserDevices({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminActiveSessions(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.platformHealth.adminActiveSessions(page, search),
    queryFn: () => platformHealthService.adminActiveSessions({ page, limit: 20, search }),
    placeholderData: keepPreviousData,
  });
}
