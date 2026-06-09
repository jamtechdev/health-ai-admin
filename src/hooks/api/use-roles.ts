'use client';

import { useQuery } from '@tanstack/react-query';
import { rolesService } from '@/services/roles.service';
import { queryKeys } from './query-keys';

export function useRolesList(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.roles.list(page, search),
    queryFn: () =>
      rolesService.list({ page, limit: 10, search: search || undefined }),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesService.getById(id),
    enabled: !!id,
  });
}
