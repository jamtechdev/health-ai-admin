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
  const { isAuthenticated, hydrate, setAuth, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    hydrate();
    loadTokensFromStorage();

    const hasToken = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken');
    if (!hasToken) return;

    authService
      .me()
      .then((user) => setAuth(user))
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
      });
  }, [hydrate, setAuth, logout]);

  const sessionActive = isAuthenticated || hasStoredSession();

  useEffect(() => {
    if (!sessionActive) {
      router.replace('/login');
    }
  }, [sessionActive, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,67,67,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(71,209,168,0.06),transparent_30%)]" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar shell — no fixed inset on desktop (that caused the messy corner/scrollbar) */}
      <div
        className={
          sidebarOpen
            ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] lg:static lg:z-20 lg:block lg:w-72 lg:max-w-none'
            : 'hidden lg:static lg:z-20 lg:block lg:w-72'
        }
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title="Admin Panel" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative z-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
