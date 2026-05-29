'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { heroCards, stats } from './landing-content';

export function LandingHero() {
  return (
    <div className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold text-brand-primary shadow-[0_0_24px_var(--primary-glow)]">
          <Sparkles className="h-3.5 w-3.5" />
          Health intelligence for users and operators
        </span>
        <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          A smarter health experience,
          <span className="bg-gradient-to-r from-brand-primary via-brand-critical to-brand-tertiary bg-clip-text text-transparent">
            {' '}
            from app to admin.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
          TovaPulse helps users understand their biometric journey while giving teams a secure
          command center for health profiles, wearable sync, AI insights, and support operations.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-button bg-brand-primary px-8 text-base font-semibold text-text-primary shadow-[0_0_28px_var(--primary-glow)] transition hover:-translate-y-0.5 hover:bg-brand-primary/90"
          >
            Open Admin Console
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#users"
            className="inline-flex h-12 items-center justify-center rounded-button border border-brand-border bg-surface/70 px-6 text-sm font-semibold text-text-secondary backdrop-blur transition hover:border-brand-primary/40 hover:text-text-primary"
          >
            Explore user journey
          </Link>
        </div>
        <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-card border border-brand-border bg-surface/55 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <p className="text-2xl font-bold text-text-primary">{item.value}</p>
                <span className="rounded-full bg-brand-secondary-glow px-2 py-1 text-xs font-semibold text-brand-secondary">
                  {item.trend}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative"
      >
        <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-brand-primary/20 via-brand-tertiary-glow to-brand-secondary-glow blur-2xl" />
        <div className="relative rounded-card border border-brand-border bg-surface/85 p-5 shadow-floating backdrop-blur-xl md:p-6">
          <motion.div
            className="mb-6 flex items-center justify-between"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div>
              <p className="text-sm text-text-secondary">Live health operations</p>
              <p className="mt-1 text-3xl font-bold text-foreground">Pulse overview</p>
            </div>
            <div className="rounded-button bg-brand-secondary-glow px-3 py-1 text-sm font-semibold text-brand-secondary">
              Healthy
            </div>
          </motion.div>
          <div className="rounded-card border border-brand-border bg-background/45 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Signal quality</span>
              <span className="font-semibold text-brand-secondary">94%</span>
            </div>
            <div className="mt-4 flex h-36 items-end gap-2">
              {[38, 68, 54, 86, 62, 94, 74, 88, 70].map((height, index) => (
                <motion.div
                  key={index}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-brand-primary via-brand-critical to-brand-tertiary"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.25 + index * 0.06, duration: 0.55 }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {heroCards.map((item) => (
              <div key={item.label} className="rounded-input border border-brand-border bg-surface-elevated p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-button bg-brand-primary-glow text-brand-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                <p className="mt-1 text-xs text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
