'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, ChevronRight, Shield, Clock, Trash2 } from 'lucide-react';

export default function DeleteAccountPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/public/delete-account/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason: reason || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push(`/delete-account/verify?email=${encodeURIComponent(email)}`);
      } else {
        setResult({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
          {isAuthenticated ? (
            <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
          ) : (
            <Link href="/" className="text-sm text-text-muted transition hover:text-foreground">Home</Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Delete account</h1>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              We&apos;re sorry to see you go. Once you confirm, your account and all associated data will be permanently deleted.
            </p>

            <div className="mt-8 space-y-5">
              <div className="rounded-xl border border-brand-border bg-surface/50 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                  <div>
                    <p className="font-semibold text-foreground">How it works</p>
                    <ol className="mt-1 space-y-2 text-sm text-text-muted">
                      <li className="flex items-start gap-1.5"><span className="font-bold text-foreground">1.</span>Enter your email and reason, then verify via OTP sent to your inbox.</li>
                      <li className="flex items-start gap-1.5"><span className="font-bold text-foreground">2.</span>Your request is sent to the admin panel for review.</li>
                      <li className="flex items-start gap-1.5"><span className="font-bold text-foreground">3.</span>Admin can either <span className="text-amber-500">revert</span> (restore your account) or <span className="text-red-500">permanently delete</span> your account and all data.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-brand-border bg-surface/50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold text-foreground">What you&apos;ll lose</p>
                    <ul className="mt-1 space-y-1 text-sm text-text-muted">
                      <li className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3 shrink-0" />All health metrics and wearable data</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3 shrink-0" />AI insights and personalized recommendations</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3 shrink-0" />Subscription and billing information</li>
                      <li className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3 shrink-0" />Account login and profile details</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-brand-border bg-surface/50 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Need to cancel?</p>
                    <p className="mt-1 text-sm text-text-muted">
                      Contact support immediately after submitting. Admin can revert the request before permanent deletion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-text-muted">
              Want to cancel your request?{' '}
              <a href="/#contact" className="text-brand-primary underline transition hover:text-brand-primary/80">Contact support</a>
            </p>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-brand-border bg-surface/80 p-8 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Verify your identity</h2>
                  <p className="text-sm text-text-muted">We&apos;ll send a code to your email</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="block w-full rounded-lg border border-brand-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="reason" className="mb-1.5 block text-sm font-semibold text-foreground">
                    Reason <span className="text-text-muted">(optional)</span>
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us why you&apos;re leaving…"
                    className="block w-full resize-y rounded-lg border border-brand-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="text-xs text-red-600">
                    This action is permanent and cannot be undone. You will receive a verification code via email to confirm.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Sending code…' : 'Send verification code'}
                </button>
              </form>

              {result && (
                <div className={`mt-6 rounded-lg px-4 py-3 text-sm ${
                  result.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  {result.message}
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-text-muted">
              <Link href="/" className="transition hover:text-foreground">Back to home</Link>
              <span className="mx-2">&middot;</span>
              <Link href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-brand-border py-6 text-center text-sm text-text-muted">
        <div className="mx-auto max-w-3xl px-4">
          <Link href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/terms-of-service" className="transition hover:text-foreground">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
