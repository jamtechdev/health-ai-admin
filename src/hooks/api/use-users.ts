'use client';

import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { queryKeys } from './query-keys';

export function useUsersList(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.users.list(page, search),
    queryFn: () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (search) params.search = search;
      return usersService.list(params);
    },
  });
}
