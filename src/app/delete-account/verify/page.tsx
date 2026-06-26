'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyDeleteAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.replace('/delete-account');
    }
  }, [email, router]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setSubmitting(true);
    setResult(null);
    setResendMsg(null);

    try {
      const res = await fetch('/api/public/delete-account/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ type: 'success', message: data.message || 'Account deletion confirmed.' });
      } else {
        setResult({ type: 'error', message: data.message || 'Invalid or expired code.' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await fetch('/api/public/delete-account/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendMsg('A new code has been sent to your email.');
        setCooldown(10);
      } else {
        setResendMsg(data.message || 'Failed to resend code.');
      }
    } catch {
      setResendMsg('Network error. Try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          {result?.type === 'success' ? (
            <div className="rounded-2xl border border-brand-border bg-surface/80 p-8 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Deletion confirmed</h2>
              <p className="mt-2 text-sm text-text-muted">{result.message}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/" className="text-sm text-brand-primary underline transition hover:text-brand-primary/80">Back to home</Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-border bg-surface/80 p-8 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Verify your identity</h2>
                  <p className="text-sm text-text-muted">Enter the 6-digit code sent to your email</p>
                </div>
              </div>

              <div className="mb-4 rounded-lg bg-surface-secondary/50 px-4 py-2.5 text-center text-sm text-text-muted">
                Code sent to: <span className="font-medium text-foreground">{email}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="h-12 w-10 rounded-lg border border-brand-border bg-background/50 text-center text-lg font-bold text-foreground focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:h-14 sm:w-12 sm:text-xl"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting || otp.join('').length !== 6}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Verifying…' : 'Confirm deletion'}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-text-muted">Code expires in 10 minutes. Resending will invalidate the previous code.</p>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="text-sm text-brand-primary underline transition hover:text-brand-primary/80 disabled:opacity-50"
                >
                  {resending ? 'Resending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
                {resendMsg && (
                  <span className="text-xs text-text-muted">{resendMsg}</span>
                )}
              </div>

              {result && (
                <div className={`mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${
                  result.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'
                }`}>
                  {result.type === 'error' ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  {result.message}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/delete-account"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to delete account
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default function VerifyDeleteAccountPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    }>
      <VerifyDeleteAccountForm />
    </Suspense>
  );
}
