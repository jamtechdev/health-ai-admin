'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Activity, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { hasStoredSession, useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api/response';
import { useApiHealth } from '@/hooks/api/use-health';
import { canAccessAdminPanel } from '@/lib/auth/admin-access';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [loading, setLoading] = useState(false);
  const { data: health, isLoading: healthLoading } = useApiHealth();

  useEffect(() => {
    if (hasHydrated && (isAuthenticated || hasStoredSession())) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = await authService.login(data);

      if (!canAccessAdminPanel(payload.user)) {
        try {
          await authService.logout();
        } catch {
          /* ignore */
        }
        logout();
        toast.error('Administrator access only. App users should register via the mobile API.');
        return;
      }

      setAuth(payload.user, payload.accessToken);
      toast.success(`Welcome, ${payload.user.name}`);
      router.replace('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const apiReachable = health?.reachable === true;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-primary/25 blur-[100px]" />
          <motion.div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-tertiary/20 blur-[80px]" />
        </motion.div>
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-brand-primary/20 ring-1 ring-brand-primary/30">
            <Activity className="h-5 w-5 text-brand-primary" />
          </div>
          <span className="text-lg font-semibold">
            Tova<span className="text-brand-primary">Pulse</span>
          </span>
        </Link>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold leading-tight">
            Secure access for
            <span className="block bg-gradient-to-r from-brand-primary to-brand-critical bg-clip-text text-transparent">
              biometric operations
            </span>
          </h1>
          <p className="mt-4 max-w-md text-text-secondary">
            Manage users, roles, audit logs, telemetry, and AI-driven health insights.
            End-user accounts are created through the public registration API.
          </p>
        </motion.div>
        <p className="relative z-10 text-sm text-text-muted">© TovaPulse</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-brand-primary lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand-primary/15 ring-1 ring-brand-primary/30">
            <Lock className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold">Admin sign in</h2>
          <p className="mt-2 text-text-secondary">Use your administrator credentials</p>

          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
            <span
              className={`h-2 w-2 rounded-full ${
                healthLoading ? 'bg-brand-warning' : apiReachable ? 'bg-brand-secondary' : 'bg-brand-critical'
              }`}
            />
            {healthLoading
              ? 'Checking API…'
              : apiReachable
                ? 'API connected'
                : 'Start health-api (port 4000)'}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
              <Input
                type="email"
                placeholder="admin@health.local"
                className="h-11"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-brand-critical">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-brand-critical">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !apiReachable}
              className="h-11 w-full text-base font-semibold"
            >
              {loading ? 'Signing in…' : 'Sign in to dashboard'}
            </Button>
            <Link
              href="/forgot-password"
              className="block text-center text-sm text-brand-primary/90 hover:text-brand-primary"
            >
              Forgot password?
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
