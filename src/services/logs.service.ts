import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { ActivityLog, AuditLog } from '@/types/logs';

class LogsService extends BaseService {
  activityList(params?: ListParams) {
    return this.getPaginated<ActivityLog>('/activity-logs', params);
  }

  auditList(params?: ListParams) {
    return this.getPaginated<AuditLog>('/audit-logs', params);
  }
}

export const logsService = new LogsService();
