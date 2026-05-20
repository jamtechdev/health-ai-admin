import { BaseService } from '@/lib/api/base.service';
import type { DashboardStats } from '@/types/dashboard';

class DashboardService extends BaseService {
  getStats() {
    return this.get<DashboardStats>('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
