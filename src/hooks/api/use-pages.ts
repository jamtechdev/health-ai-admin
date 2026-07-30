'use client';

import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { pagesService } from '@/services/pages.service';
import { queryKeys } from './query-keys';
import type { PageRecord } from '@/types/page';

export function usePagesList(page: number, search: string) {
  return useQuery({
    queryKey: queryKeys.pages.list(page, search),
    queryFn: () =>
      pagesService.list({ page, limit: 10, search: search || undefined }),
    placeholderData: keepPreviousData,
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: queryKeys.pages.detail(id),
    queryFn: () => pagesService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; slug: string; content: string; status?: 'active' | 'inactive' }) =>
      pagesService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pages.all });
    },
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Pick<PageRecord, 'title' | 'slug' | 'content' | 'status'>>) =>
      pagesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pages.all });
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pagesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pages.all });
    },
  });
}
