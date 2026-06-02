import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '@/constants/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  }
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('refreshToken', token);
    else localStorage.removeItem('refreshToken');
  }
}

export function setTokens(nextAccessToken: string | null, nextRefreshToken?: string | null) {
  setAccessToken(nextAccessToken);
  if (nextRefreshToken !== undefined) {
    setRefreshToken(nextRefreshToken);
  }
}

export function loadTokensFromStorage() {
  if (typeof window === 'undefined') return;
  accessToken = localStorage.getItem('accessToken');
  refreshToken = localStorage.getItem('refreshToken');
}

export function clearTokens() {
  setTokens(null, null);
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken && typeof window !== 'undefined') {
    refreshToken = localStorage.getItem('refreshToken');
  }

  if (!refreshToken) return null;

  refreshPromise ??= axios
    .post<RefreshResponse>(`${API_URL}/auth/refresh`, { refreshToken })
    .then((response) => {
      const nextAccessToken = response.data.data.accessToken;
      setTokens(nextAccessToken, response.data.data.refreshToken ?? refreshToken);
      return nextAccessToken;
    })
    .catch(() => {
      clearTokens();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
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
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      const nextAccessToken = await refreshAccessToken();
      if (nextAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return api(originalRequest);
      }
    }

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
