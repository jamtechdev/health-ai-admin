'use client';

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
  Image,
  Watch,
  Sparkles,
  CreditCard,
  LineChart,
  RadioTower,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
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
      { href: '/users', label: 'Users & App Users', icon: Users, aliases: ['/consumers', '/profile'] },
      { href: '/roles', label: 'Roles', icon: Shield },
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
      { href: '/api-logs', label: 'API Logs', icon: FileText },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/activity-logs', label: 'Activity Logs', icon: History },
      { href: '/audit-logs', label: 'Audit Logs', icon: FileText },
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/media', label: 'Media', icon: Image },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <span className="text-lg font-bold text-emerald-600">Health Admin</span>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
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
