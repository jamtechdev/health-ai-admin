'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { hasStoredSession, useAuthStore } from '@/store/auth.store';
import { loadTokensFromStorage } from '@/lib/api/client';
import { authService } from '@/services/auth.service';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, hydrate, setAuth, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    hydrate();
    loadTokensFromStorage();
    queueMicrotask(() => {
      if (mounted) setReady(true);
    });

    const hasToken = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken');
    if (!hasToken) {
      return () => {
        mounted = false;
      };
    }

    authService
      .me()
      .then((user) => setAuth(user))
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
      });
    return () => {
      mounted = false;
    };
  }, [hydrate, setAuth, logout]);

  const sessionActive = isAuthenticated || hasStoredSession();

  useEffect(() => {
    if (!ready || !hasHydrated) return;
    if (!sessionActive) {
      router.replace('/login');
    }
  }, [ready, hasHydrated, sessionActive, router]);

  if (!ready || !hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!sessionActive) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:relative lg:block`}>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 h-full">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Admin Panel" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
