import { BaseService } from '@/lib/api/base.service';
import type { ListParams, PaginatedData } from '@/lib/api/types';
import type {
  AiInsightRecord,
  ConnectedDeviceRecord,
  ConsumerDashboard,
  ConsumerListItem,
  HealthMetricRecord,
  HealthPlatformOverview,
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
}

export const platformHealthService = new PlatformHealthService();

export type { ConsumerListItem, PaginatedData };
