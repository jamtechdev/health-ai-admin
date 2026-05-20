import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '@/constants/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  }
}

export function loadTokensFromStorage() {
  if (typeof window === 'undefined') return;
  accessToken = localStorage.getItem('accessToken');
}

export function clearTokens() {
  setAccessToken(null);
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!accessToken && typeof window !== 'undefined') {
    loadTokensFromStorage();
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearTokens();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export type { ApiResponse, PaginatedData, PaginationMeta, ListParams } from './types';
