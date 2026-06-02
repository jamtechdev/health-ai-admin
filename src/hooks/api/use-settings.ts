'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { queryKeys } from './query-keys';

export function useSettingsList() {
  return useQuery({
    queryKey: queryKeys.settings.list(),
    queryFn: async () => (await settingsService.list({ limit: 100 })).items,
  });
}

export function useUpsertSetting() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => settingsService.upsert(key, value),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}
