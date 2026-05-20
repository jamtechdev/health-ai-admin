import type { AxiosError } from 'axios';
import type { ApiResponse, PaginatedData } from './types';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: unknown[];
    }>;
    const msg = axiosError.response?.data?.message;
    if (msg) return msg;
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Cannot reach API. Start health-api with: npm run dev (port 4000)';
    }
  }
  return fallback;
}

export function unwrapData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function unwrapPaginated<T>(
  response: { data: ApiResponse<PaginatedData<T>> },
): PaginatedData<T> {
  return response.data.data;
}
