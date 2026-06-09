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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,67,67,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(71,209,168,0.08),transparent_28%)]" />
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:relative lg:block`}>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 h-full">
          <Sidebar onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header title="Admin Panel" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
