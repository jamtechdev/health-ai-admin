'use client';

import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';
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
    <header className="flex h-16 items-center justify-between border-b border-brand-border bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/profile" className="hidden text-sm text-text-muted hover:text-brand-primary sm:inline">
          {user?.name}
        </Link>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
