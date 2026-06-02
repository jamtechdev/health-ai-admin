'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { hasStoredSession, useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api/response';
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
      const payload = await authService.login({ ...data, client: 'admin' });

      if (payload.accountType !== 'admin' && !canAccessAdminPanel(payload.user)) {
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-primary-glow blur-[120px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-brand-tertiary-glow blur-[110px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-brand-border/80 bg-surface-elevated/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent" />

        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-7 inline-flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="TovaPulse"
              width={160}
              height={64}
              priority
              className="h-14 w-auto rounded-md object-contain"
            />
          </Link>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-primary/30 bg-brand-primary-glow ring-1 ring-brand-primary/20">
            <Lock className="h-6 w-6 text-brand-primary" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
            Secure access for biometric operations and admin management.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
            <Input
              type="email"
              placeholder="admin@tovapulse.com"
              autoComplete="email"
              className="h-12 border-brand-border/80 bg-background/50"
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
              autoComplete="current-password"
              className="h-12 border-brand-border/80 bg-background/50"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-brand-critical">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full text-base font-semibold shadow-[0_14px_30px_rgba(220,38,38,0.18)]"
          >
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </Button>

          <Link
            href="/forgot-password"
            className="block text-center text-sm text-brand-primary/90 transition hover:text-brand-primary"
          >
            Forgot password?
          </Link>
        </form>

        <p className="mt-8 text-center text-xs text-text-muted">
          Admin access only. App users should sign in from the mobile app.
        </p>
      </motion.div>

      <motion.p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        © TovaPulse
      </motion.p>
    </div>
  );
}
