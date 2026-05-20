import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import type { ApiResponse } from './types';

export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});
