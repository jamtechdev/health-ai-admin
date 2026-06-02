'use client';

import Link from 'next/link';
import { Activity, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    logout();
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-border/80 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary sm:block">
            Operations
          </p>
          <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-brand-border/80 bg-surface/70 px-3 py-2 text-xs text-text-muted md:flex">
          <Activity className="h-3.5 w-3.5 text-brand-secondary" />
          Live
        </div>
        <Link
          href="/profile"
          className="hidden max-w-44 truncate rounded-full border border-brand-border/80 bg-surface/70 px-3 py-2 text-sm text-text-muted transition hover:text-brand-primary sm:inline"
        >
          {user?.name ?? 'Profile'}
        </Link>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
