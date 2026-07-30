'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { useUnreadNotificationsCount } from '@/hooks/api/use-notifications';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: unreadCount } = useUnreadNotificationsCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    logout();
    router.push('/login');
  };

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center justify-between border-b border-brand-border bg-background px-4 sm:px-6">
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

      <div className="relative z-40 flex items-center gap-2 sm:gap-3">
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/80 bg-surface/70 text-text-secondary transition hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {!!unreadCount && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(220,38,38,0.35)]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="relative z-50" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/80 bg-surface/70 text-text-secondary transition hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open profile menu"
            title={user?.name ?? 'Profile'}
          >
            <UserRound className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-[100] mt-2 w-56 overflow-hidden rounded-2xl border border-brand-border bg-surface shadow-[0_18px_48px_rgba(0,0,0,0.55)]"
            >
              <div className="border-b border-brand-border/70 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-foreground">{user?.name ?? 'Admin'}</p>
                <p className="truncate text-xs text-text-muted">{user?.email ?? ''}</p>
              </div>
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-secondary hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Profile Setting
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-secondary hover:text-brand-primary"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
