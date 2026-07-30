import type { User } from '@/store/auth.store';

export interface LoginPayload {
  email: string;
  password: string;
  /** Admin website must send `admin`. Mobile omits this or sends `app`. */
  client: 'admin';
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
