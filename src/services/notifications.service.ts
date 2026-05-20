import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { NotificationRecord } from '@/types/notification';

class NotificationsService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<NotificationRecord>('/notifications', params);
  }

  markRead(id: string) {
    return this.patch<NotificationRecord>(`/notifications/${id}/read`);
  }

  markAllRead() {
    return this.patch<{ message: string }>('/notifications/read-all');
  }
}

export const notificationsService = new NotificationsService();
