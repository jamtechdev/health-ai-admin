import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});
