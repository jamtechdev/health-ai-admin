import { BaseService } from '@/lib/api/base.service';
import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResult,
  UpdateProfilePayload,
} from '@/types/auth';
import type { User } from '@/store/auth.store';

class AuthService extends BaseService {
  login(payload: LoginPayload) {
    return this.post<LoginResult>('/auth/login', payload);
  }

  logout() {
    return this.post<null>('/auth/logout');
  }

  me() {
    return this.get<User>('/auth/me');
  }

  forgotPassword(email: string) {
    return this.post<{ message: string }>('/auth/forgot-password', { email });
  }

  resetPassword(email: string, otp: string, password: string) {
    return this.post<{ message: string }>('/auth/reset-password', { email, otp, password });
  }

  verifyEmail(token: string) {
    return this.post<{ message: string }>('/auth/verify-email', { token });
  }

  updateProfile(payload: UpdateProfilePayload) {
    return this.patch<User>('/auth/profile', payload);
  }

  changePassword(payload: ChangePasswordPayload) {
    return this.patch<{ message: string }>('/auth/change-password', payload);
  }
}

export const authService = new AuthService();
