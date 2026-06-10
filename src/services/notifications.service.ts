import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { NotificationRecord } from '@/types/notification';

class NotificationsService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<NotificationRecord>('/notifications', params);
  }

  getById(id: string) {
    return this.get<NotificationRecord>(`/notifications/${id}`);
  }

  markRead(id: string) {
    return this.patch<NotificationRecord>(`/notifications/${id}/read`);
  }

  markAllRead() {
    return this.put<{ message: string }>('/notifications/read-all');
  }
}

export const notificationsService = new NotificationsService();
