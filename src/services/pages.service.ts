import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { PageRecord } from '@/types/page';

class PagesService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<PageRecord>('/pages', params);
  }

  getById(id: string) {
    return this.get<PageRecord>(`/pages/${id}`);
  }

  create(payload: { title: string; slug: string; content: string; status?: 'active' | 'inactive' }) {
    return this.post<PageRecord>('/pages', payload);
  }

  update(id: string, payload: { title?: string; slug?: string; content?: string; status?: 'active' | 'inactive' }) {
    return this.patch<PageRecord>(`/pages/${id}`, payload);
  }

  remove(id: string) {
    return this.delete<{ message: string }>(`/pages/${id}`);
  }
}

export const pagesService = new PagesService();
