import { BaseService } from '@/lib/api/base.service';
import type { ListParams } from '@/lib/api/types';
import type { UploadRecord } from '@/types/upload';

class UploadsService extends BaseService {
  list(params?: ListParams) {
    return this.getPaginated<UploadRecord>('/uploads', params);
  }

  upload(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.postForm<UploadRecord>('/uploads', form);
  }

  remove(id: string) {
    return this.delete<{ message: string }>(`/uploads/${id}`);
  }
}

export const uploadsService = new UploadsService();
