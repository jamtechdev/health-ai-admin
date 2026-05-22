'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Lock,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { useApiHealth } from '@/hooks/api/use-health';

const features = [
  {
    icon: BarChart3,
    title: 'Live Dashboard',
    description: 'Real-time metrics, user growth charts, and activity feeds in one place.',
  },
  {
    icon: Users,
    title: 'User & Role Control',
    description: 'Manage accounts, roles, and permissions with enterprise-grade RBAC.',
  },
  {
    icon: Shield,
    title: 'Audit & Compliance',
    description: 'Full activity and audit logs for security and accountability.',
  },
  {
    icon: Lock,
    title: 'Secure Sessions',
    description: 'Token-based auth with instant logout and session destruction.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function LandingPage() {
  const { data: health, isLoading: healthLoading } = useApiHealth();
  const apiOnline = health?.reachable === true;

  return (
    <motion.div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-brand-primary/20 blur-[120px]" />
        <motion.div
          className="absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-brand-tertiary/15 blur-[100px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute bottom-0 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-t from-background to-transparent" />
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-brand-primary/20 ring-1 ring-brand-primary/30">
            <Activity className="h-5 w-5 text-brand-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Tova<span className="text-brand-primary">Pulse</span>
          </span>
        </div>
        <motion.div
          className="flex items-center gap-2 rounded-full border border-brand-border bg-surface/70 px-3 py-1.5 text-xs text-text-secondary backdrop-blur-md"
          {...fadeUp}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              healthLoading ? 'bg-brand-warning' : apiOnline ? 'bg-brand-secondary' : 'bg-brand-critical'
            }`}
          />
          {healthLoading ? 'Checking API…' : apiOnline ? 'API connected' : 'API offline'}
        </motion.div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8 md:pt-16">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary">
              <Zap className="h-3.5 w-3.5" />
              Biometric Intelligence Portal
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Biometric operations,
              <span className="bg-gradient-to-r from-brand-primary to-brand-critical bg-clip-text text-transparent">
                {' '}
                in pulse.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              Premium admin dashboard for live telemetry, user health, AI insights, roles,
              settings, and system operations.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-brand-primary px-8 text-base font-semibold text-white shadow-[0_0_24px_rgba(217,67,67,0.18)] transition hover:bg-[#c83e3e]"
              >
                Admin Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <p className="text-sm text-text-muted">
                App users: <span className="text-text-secondary">POST /api/v1/auth/register</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-[24px] border border-brand-border bg-surface/80 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <motion.div
                className="mb-6 flex items-center justify-between"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div>
                  <p className="text-sm text-text-secondary">Active biometrics</p>
                  <p className="text-3xl font-bold text-foreground">1,248</p>
                </motion.div>
                <motion.div className="rounded-lg bg-brand-secondary/20 px-3 py-1 text-sm font-medium text-brand-secondary">
                  +12.4%
                </motion.div>
              </motion.div>
              <div className="flex h-32 items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-primary to-brand-critical"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {['Users', 'Roles', 'Logs', 'Media'].map((label) => (
                  <div
                    key={label}
                    className="rounded-[16px] border border-brand-border bg-surface-elevated px-4 py-3 text-sm text-text-secondary"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section
          className="mt-28"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        >
          <h2 className="text-center text-2xl font-semibold md:text-3xl">Everything admins need</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
            Biometric telemetry, AI recommendations, and operational controls in one premium console.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-[24px] border border-brand-border bg-surface/70 p-6 backdrop-blur-sm transition hover:border-brand-primary/40 hover:bg-surface-elevated"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px] bg-brand-primary/15 text-brand-primary transition group-hover:bg-brand-primary/25">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-brand-border py-8 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} TovaPulse · Administrator access only
      </footer>
    </motion.div>
  );
}
