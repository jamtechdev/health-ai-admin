import type { AxiosRequestConfig } from 'axios';
import { api } from './client';
import type { ApiResponse, ListParams, PaginatedData } from './types';

export abstract class BaseService {
  protected async get<T>(url: string, params?: ListParams, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.get<ApiResponse<T>>(url, { params, ...config });
    return data.data;
  }

  protected async getPaginated<T>(
    url: string,
    params?: ListParams,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedData<T>> {
    const { data } = await api.get<ApiResponse<PaginatedData<T>>>(url, { params, ...config });
    return data.data;
  }

  protected async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.post<ApiResponse<T>>(url, body, config);
    return data.data;
  }

  protected async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.patch<ApiResponse<T>>(url, body, config);
    return data.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.delete<ApiResponse<T>>(url, config);
    return data.data;
  }

  protected async postForm<T>(url: string, form: FormData, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.post<ApiResponse<T>>(url, form, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
    });
    return data.data;
  }
}
