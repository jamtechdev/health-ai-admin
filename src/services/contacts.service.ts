import { api } from '@/lib/api/client';
import type { ContactRequestRecord } from '@/types/contact';

export const contactsService = {
  list() {
    return api.get<{ data: ContactRequestRecord[] }>('/admin/contacts').then((res) => res.data.data);
  },

  reply(id: number, reply: string) {
    return api.post(`/admin/contacts/${id}/reply`, { reply }).then((res) => res.data);
  },

  updateStatus(id: number, status: ContactRequestRecord['status']) {
    return api.patch(`/admin/contacts/${id}`, { status }).then((res) => res.data);
  },

  remove(id: number) {
    return api.delete(`/admin/contacts/${id}`).then((res) => res.data);
  },
};
