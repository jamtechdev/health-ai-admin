'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactsService } from '@/services/contacts.service';
import { queryKeys } from './query-keys';
import type { ContactRequestRecord } from '@/types/contact';

export function useContacts() {
  return useQuery({
    queryKey: queryKeys.contacts.all,
    queryFn: () => contactsService.list(),
  });
}

export function useReplyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }: { id: number; reply: string }) => contactsService.reply(id, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ContactRequestRecord['status'] }) =>
      contactsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}
