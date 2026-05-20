'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { queryKeys } from './query-keys';

export function useSettingsList() {
  return useQuery({
    queryKey: queryKeys.settings.list(),
    queryFn: async () => (await settingsService.list({ limit: 100 })).items,
  });
}
