import type { User } from '@/store/auth.store';

export interface LoginPayload {
  email: string;
  password: string;
  client?: 'admin' | 'app';
}

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken?: string;
  tokenType?: 'Bearer';
  expiresIn?: string;
  accountType?: 'admin' | 'user';
  redirectTo?: '/dashboard' | '/app';
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
