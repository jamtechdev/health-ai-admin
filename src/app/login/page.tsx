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
    <div className="flex min-h-screen bg-slate-950 text-white">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-500/25 blur-[100px]" />
          <motion.div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-500/20 blur-[80px]" />
        </motion.div>
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/30">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-lg font-semibold">Health Admin</span>
        </Link>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold leading-tight">
            Secure access for
            <span className="block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              administrators
            </span>
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Manage users, roles, audit logs, and system settings. End-user accounts are created
            through the public registration API.
          </p>
        </motion.div>
        <p className="relative z-10 text-sm text-slate-500">© Health Admin</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Admin sign in</h2>
          <p className="mt-2 text-slate-400">Use your administrator credentials</p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span
              className={`h-2 w-2 rounded-full ${
                healthLoading ? 'bg-amber-400' : apiReachable ? 'bg-emerald-400' : 'bg-red-400'
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
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <Input
                type="email"
                placeholder="admin@health.local"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !apiReachable}
              className="h-11 w-full rounded-xl bg-emerald-500 text-base font-semibold text-slate-950 hover:bg-emerald-400"
            >
              {loading ? 'Signing in…' : 'Sign in to dashboard'}
            </Button>
            <Link
              href="/forgot-password"
              className="block text-center text-sm text-emerald-400/90 hover:text-emerald-300"
            >
              Forgot password?
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
