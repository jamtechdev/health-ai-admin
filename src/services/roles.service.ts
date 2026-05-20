import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { RoleRecord } from '@/types/role';

class RolesService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<RoleRecord>('/roles', params);
  }

  getById(id: string) {
    return this.get<RoleRecord>(`/roles/${id}`);
  }

  create(payload: { name: string; slug: string; description?: string; permissionIds?: string[] }) {
    return this.post<RoleRecord>('/roles', payload);
  }

  update(
    id: string,
    payload: { name?: string; slug?: string; description?: string; permissionIds?: string[] },
  ) {
    return this.patch<RoleRecord>(`/roles/${id}`, payload);
  }

  remove(id: string) {
    return this.delete<{ message: string }>(`/roles/${id}`);
  }
}

export const rolesService = new RolesService();
