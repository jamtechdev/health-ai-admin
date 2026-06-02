import axios from 'axios';
import { API_URL } from '@/constants/api';

export const publicClient = axios.create({
  baseURL: API_URL,
  timeout: 8000,
});
