import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAccessToken, clearTokens, loadTokensFromStorage } from '@/lib/api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  status: string;
  emailVerifiedAt?: string | null;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  hydrate: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, accessToken) => {
        setAccessToken(accessToken);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },
      hydrate: () => {
        loadTokensFromStorage();
        const hasToken =
          typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
        if (!hasToken) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
        }
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'tovapulse-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.hydrate();
      },
    },
  ),
);

export function hasStoredSession(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}
