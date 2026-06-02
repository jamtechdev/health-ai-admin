'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, navItems } from './landing-content';

type LandingHeaderProps = {
  showApiStatus?: boolean;
};

export function LandingHeader({ showApiStatus = false }: LandingHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-border/60 bg-background/85 shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="TovaPulse"
            width={164}
            height={64}
            priority
            className="h-12 w-auto rounded-md object-contain"
          />
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-brand-border bg-surface/55 p-1 text-sm text-text-secondary xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-surface-elevated hover:text-text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showApiStatus && (
            <motion.div
              className="hidden items-center gap-2 rounded-full border border-brand-border bg-surface/70 px-3 py-1.5 text-xs text-text-secondary backdrop-blur-md sm:flex"
              {...fadeUp}
            >
              <span className="h-2 w-2 rounded-full bg-brand-secondary" />
              API connected
            </motion.div>
          )}
          <Link
            href="/login"
            className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/20"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
