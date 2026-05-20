'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadsService } from '@/services/uploads.service';
import { queryKeys } from './query-keys';

export function useUploadsList(page: number) {
  return useQuery({
    queryKey: queryKeys.uploads.list(page),
    queryFn: () => uploadsService.list({ page, limit: 12 }),
  });
}

export function useUploadFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadsService.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.uploads.all }),
  });
}
