import type { User } from '@/store/auth.store';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  accessToken: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
