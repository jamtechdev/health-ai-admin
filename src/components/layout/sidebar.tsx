'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  History,
  Watch,
  Sparkles,
  CreditCard,
  LineChart,
  RadioTower,
  X,
  AlertTriangle,
  FileText,
  Send,
  Mail,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnreadNotificationsCount } from '@/hooks/api/use-notifications';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
}

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { data: unreadCount } = useUnreadNotificationsCount();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    logout();
    onNavigate?.();
    router.push('/login');
  };

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Overview',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/analytics', label: 'Analytics', icon: LineChart },
      ],
    },
    {
      title: 'People',
      items: [
        { href: '/users', label: 'Users', icon: Users, aliases: ['/consumers', '/profile'] },
        { href: '/account-requests', label: 'Account Requests', icon: AlertTriangle },
      ],
    },
    {
      title: 'Health AI',
      items: [
        { href: '/wearables', label: 'Wearables', icon: Watch },
        { href: '/health-history', label: 'Health History', icon: BarChart3 },
        { href: '/insights', label: 'AI Insights', icon: Sparkles },
        { href: '/subscriptions', label: 'Plans', icon: CreditCard },
        { href: '/device-sync-logs', label: 'Sync Logs', icon: RadioTower },
      ],
    },
    {
      title: 'System',
      items: [
        { href: '/pages', label: 'Pages', icon: FileText },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/notifications/compose', label: 'Push Notification', icon: Send },
        { href: '/contacts', label: 'Contact Requests', icon: Mail },
        { href: '/activity-logs', label: 'Activity Logs', icon: History },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-72 max-w-[86vw] flex-col overflow-hidden border-r border-brand-border bg-background lg:w-72">
      {/* Match main header height (h-16) so the top seam aligns cleanly */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-brand-border px-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="TovaPulse"
            className="h-9 w-9 shrink-0 rounded-xl"
          />
          <div className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight text-foreground">
              TovaPulse
            </span>
            <span className="block truncate text-[11px] font-medium text-text-muted">
              Admin Control Center
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-text-muted transition hover:bg-surface-secondary hover:text-foreground lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="sidebar-scroll flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-disabled">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const siblingHrefs = navGroups.flatMap((g) => g.items.map((i) => i.href));
              const active =
                pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) &&
                  !siblingHrefs.some(
                    (s) =>
                      s !== item.href &&
                      (pathname === s || pathname.startsWith(`${s}/`)),
                  )) ||
                item.aliases?.some((alias) => pathname === alias || pathname.startsWith(`${alias}/`));

              const isNotifications = item.href === '/notifications';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-brand-primary/15 text-brand-primary'
                      : 'text-text-secondary hover:bg-surface-secondary/80 hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
                      active
                        ? 'border-brand-primary/30 bg-brand-primary/15 text-brand-primary'
                        : 'border-brand-border/70 bg-surface/50 text-text-muted group-hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{item.label}</span>
                  {isNotifications && !!unreadCount && unreadCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {active && (
                    <span className="absolute inset-y-3 right-2 w-1 rounded-full bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-brand-border p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-primary to-[#b91c1c] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(220,38,38,0.28)] transition hover:brightness-110 active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
