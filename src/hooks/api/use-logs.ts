'use client';

import { useQuery } from '@tanstack/react-query';
import { logsService } from '@/services/logs.service';
import { queryKeys } from './query-keys';

export function useActivityLogs(page: number) {
  return useQuery({
    queryKey: queryKeys.logs.activity(page),
    queryFn: () => logsService.activityList({ page, limit: 10 }),
  });
}

export function useAuditLogs(page: number) {
  return useQuery({
    queryKey: queryKeys.logs.audit(page),
    queryFn: () => logsService.auditList({ page, limit: 10 }),
  });
}
