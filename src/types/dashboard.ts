import type { HealthPlatformOverview } from './platform-health';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  unreadNotifications: number;
  healthPlatform?: HealthPlatformOverview;
  recentActivity: Array<{
    id: string;
    source?: 'activity' | 'api';
    module: string;
    description: string;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
  usersByMonth: Array<{ month: string; count: number }>;
}
