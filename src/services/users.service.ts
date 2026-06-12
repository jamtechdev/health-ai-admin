import { BaseService } from '@/lib/api/base.service';
import type { ListParams, PaginatedData } from '@/lib/api/types';
import type { CreateUserPayload, UpdateUserPayload, UserRecord } from '@/types/user';

class UsersService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<UserRecord>('/users', params);
  }

  getById(id: string) {
    return this.get<UserRecord>(`/users/${id}`);
  }

  create(payload: CreateUserPayload) {
    return this.post<UserRecord>('/users', payload);
  }

  update(id: string, payload: UpdateUserPayload) {
    return this.patch<UserRecord>(`/users/${id}`, payload);
  }

  remove(id: string, action?: 'soft' | 'hard', reason?: string) {
    const config: Record<string, unknown> = {};
    if (action || reason) {
      (config as Record<string, unknown>).data = { action, reason };
    }
    return this.delete<{ message: string }>(`/users/${id}`, config as Record<string, unknown>);
  }

  revert(id: string) {
    return this.post<{ message: string }>(`/users/${id}/revert`);
  }

  bulk(ids: string[], action: string) {
    return this.post<{ message: string }>('/users/bulk', { ids, action });
  }

  listConsumers(params?: ListParams) {
    return this.getPaginated<UserRecord>('/users', { ...params, 'filter[role]': 'user' });
  }

  async fetchAllConsumerIds(): Promise<string[]> {
    let allUsers: { id: string; name: string; email: string }[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await this.listConsumers({ page, limit: 100 });
      allUsers = allUsers.concat(res.items);
      totalPages = res.meta.totalPages;
      page++;
    }

    return allUsers.map((u) => u.id);
  }
}

export const usersService = new UsersService();

export type { UserRecord, PaginatedData };
