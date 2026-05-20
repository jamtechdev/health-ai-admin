import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { SettingRecord } from '@/types/setting';

class SettingsService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<SettingRecord>('/settings', params);
  }

  getByKey(key: string) {
    return this.get<SettingRecord>(`/settings/${key}`);
  }

  upsert(key: string, value: unknown) {
    return this.post<SettingRecord>('/settings', { key, value });
  }
}

export const settingsService = new SettingsService();
