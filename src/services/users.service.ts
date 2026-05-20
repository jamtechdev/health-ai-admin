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

  remove(id: string) {
    return this.delete<{ message: string }>(`/users/${id}`);
  }

  bulk(ids: string[], action: string) {
    return this.post<{ message: string }>('/users/bulk', { ids, action });
  }
}

export const usersService = new UsersService();

export type { UserRecord, PaginatedData };
