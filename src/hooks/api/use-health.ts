'use client';

import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/services/health.service';
import { queryKeys } from './query-keys';

export function useApiHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => healthService.check(),
    retry: 2,
    retryDelay: 1000,
    refetchInterval: 15000,
    staleTime: 5000,
  });
}
