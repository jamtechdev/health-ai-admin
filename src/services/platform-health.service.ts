import { BaseService } from '@/lib/api/base.service';
import type { ListParams, PaginatedData } from '@/lib/api/types';
import type {
  AdminAnalyticsOverview,
  ApiLogRecord,
  AiInsightRecord,
  ActiveSessionItem,
  ConnectedDeviceRecord,
  ConsumerDashboard,
  ConsumerListItem,
  DeviceSyncLogRecord,
  HealthMetricRecord,
  HealthPlatformOverview,
  HistoryResponse,
  SubscriptionRecord,
  UserDeviceDirectoryItem,
} from '@/types/platform-health';

class PlatformHealthService extends BaseService {
  overview() {
    return this.get<HealthPlatformOverview>('/admin/health/overview');
  }

  listConsumers(params?: ListParams) {
    return this.getPaginated<ConsumerListItem>('/admin/health/consumers', params);
  }

  consumerDetail(userId: string) {
    return this.get<ConsumerDashboard>(`/admin/health/consumers/${userId}`);
  }

  consumerMetrics(userId: string, days = 30) {
    return this.get<HealthMetricRecord[]>(`/admin/health/consumers/${userId}/metrics`, { days });
  }

  consumerInsights(userId: string) {
    return this.get<AiInsightRecord[]>(`/admin/health/consumers/${userId}/insights`);
  }

  consumerDevices(userId: string) {
    return this.get<ConnectedDeviceRecord[]>(`/admin/health/consumers/${userId}/devices`);
  }

  generateInsight(userId: string) {
    return this.post<AiInsightRecord>(`/admin/health/consumers/${userId}/generate-insight`);
  }

  syncDevices(userId: string) {
    return this.post<Record<string, unknown>>(`/admin/health/consumers/${userId}/sync`);
  }

  adminAnalyticsOverview() {
    return this.get<AdminAnalyticsOverview>('/admin/analytics/overview');
  }

  adminWearables(params?: ListParams) {
    return this.getPaginated<ConnectedDeviceRecord>('/admin/analytics/wearables', params);
  }

  adminInsights(params?: ListParams) {
    return this.getPaginated<AiInsightRecord>('/admin/analytics/insights', params);
  }

  adminSubscriptions(params?: ListParams) {
    return this.getPaginated<SubscriptionRecord>('/admin/analytics/subscriptions', params);
  }

  adminSyncLogs(params?: ListParams) {
    return this.getPaginated<DeviceSyncLogRecord>('/admin/analytics/sync-logs', params);
  }

  adminApiLogs(params?: ListParams) {
    return this.getPaginated<ApiLogRecord>('/admin/analytics/api-logs', params);
  }

  dailySnapshotsHistory(from: string, to: string) {
    return this.get<HistoryResponse>('/daily-snapshots', { history: 'true', from, to });
  }

  consumerDailySnapshots(userId: string, from: string, to: string) {
    return this.get<HistoryResponse>(`/admin/health/consumers/${userId}/daily-snapshots`, { from, to });
  }

  adminUserDevices(params?: ListParams) {
    return this.getPaginated<UserDeviceDirectoryItem>('/admin/health/user-devices', params);
  }

  adminActiveSessions(params?: ListParams) {
    return this.getPaginated<ActiveSessionItem>('/admin/health/active-sessions', params);
  }
}

export const platformHealthService = new PlatformHealthService();

export type { ConsumerListItem, PaginatedData };
