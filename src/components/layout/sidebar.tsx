'use client';

import NextImage from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Bell,
  FileText,
  History,
  Watch,
  Sparkles,
  CreditCard,
  LineChart,
  RadioTower,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
}

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
      // { href: '/roles', label: 'Roles', icon: Shield },
    ],
  },
  {
    title: 'Health AI',
    items: [
      { href: '/wearables', label: 'Wearables', icon: Watch },
      { href: '/insights', label: 'AI Insights', icon: Sparkles },
      { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
      { href: '/device-sync-logs', label: 'Sync Logs', icon: RadioTower },
    ],
  },
  {
    title: 'System',
    items: [
      // { href: '/api-logs', label: 'API Logs', icon: FileText },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/activity-logs', label: 'Activity Logs', icon: History },
      // { href: '/audit-logs', label: 'Audit Logs', icon: FileText },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-brand-border bg-surface">
      <div className="flex h-16 items-center border-b border-brand-border px-6">
        <NextImage
          src="/logo.png"
          alt="TovaPulse"
          width={142}
          height={56}
          priority
          className="h-10 w-auto rounded-md object-contain"
        />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-text-disabled">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                item.aliases?.some((alias) => pathname === alias || pathname.startsWith(`${alias}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-button px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-primary/15 text-brand-primary shadow-[0_0_24px_var(--primary-glow)]'
                      : 'text-text-secondary hover:bg-surface-secondary hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
