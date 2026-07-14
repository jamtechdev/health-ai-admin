'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Activity,
  X,
  AlertTriangle,
  FileText,
  Send,
  Mail,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnreadNotificationsCount } from '@/hooks/api/use-notifications';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
}

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { data: unreadCount } = useUnreadNotificationsCount();

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
        // { href: '/api-logs', label: 'API Logs', icon: FileText },
        { href: '/pages', label: 'Pages', icon: FileText },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/notifications/compose', label: 'Push Notification', icon: Send },
        { href: '/contacts', label: 'Contacts', icon: Mail },
        { href: '/activity-logs', label: 'Activity Logs', icon: History },
        // { href: '/audit-logs', label: 'Audit Logs', icon: FileText },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-72 max-w-[86vw] flex-col border-r border-brand-border/80 bg-background/95 shadow-[24px_0_80px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:w-72">
      <div className="border-b border-brand-border/70 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/logo.png" alt="TovaPulse" className="h-11 w-11 shrink-0 rounded-2xl shadow-[0_16px_34px_rgba(220,38,38,0.24)]" />
            <div className="min-w-0">
              <span className="block truncate text-lg font-bold tracking-tight text-foreground">TovaPulse</span>
              <span className="text-xs font-medium text-text-muted">Admin Control Center</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-text-muted transition hover:bg-surface-secondary hover:text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
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
                      ? 'bg-brand-primary/15 text-brand-primary shadow-[0_18px_42px_rgba(220,38,38,0.14)]'
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
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(220,38,38,0.3)]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {active && <span className="absolute inset-y-3 right-2 w-1 rounded-full bg-brand-primary" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-brand-border/70 p-4">
        <div className="rounded-2xl border border-brand-border/80 bg-surface/70 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-brand-primary" />
            Live Operations
          </div>
          <p className="mt-1 text-xs leading-5 text-text-muted">API, users, wearables, and insights are managed here.</p>
        </div>
      </div>
    </aside>
  );
}
