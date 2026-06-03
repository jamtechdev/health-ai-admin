import { BaseService } from '@/lib/api/base.service';
import type { ListParams, PaginatedData } from '@/lib/api/types';
import type { AccountDeletionRequestRecord } from '@/types/account-request';

class AccountRequestsService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<AccountDeletionRequestRecord>('/admin/account-requests', params);
  }

  revert(id: string) {
    return this.post<{ message: string }>(`/admin/account-requests/${id}/revert`);
  }

  permanentDelete(id: string) {
    return this.delete<{ message: string }>(`/admin/account-requests/${id}`);
  }
}

export const accountRequestsService = new AccountRequestsService();
