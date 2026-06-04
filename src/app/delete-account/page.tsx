'use client';

import { useState } from 'react';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/public/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason: reason || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: 'success', message: data.message || 'Request submitted. Check your email for next steps.' });
        setEmail('');
        setReason('');
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
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <a href="/" className="text-lg font-bold text-foreground">TovaPulse</a>
          <a href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</a>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">Delete Account</h1>
        <p className="mt-2 text-sm text-text-muted">
          Enter your registered email to request account deletion. We will process your request within 14 days.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="block w-full rounded-lg border border-brand-border bg-surface/40 px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <div>
            <label htmlFor="reason" className="mb-1.5 block text-sm font-semibold text-foreground">
              Reason <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you&apos;re leaving…"
              className="block w-full resize-y rounded-lg border border-brand-border bg-surface/40 px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-button bg-brand-critical text-sm font-medium text-text-primary transition-colors hover:bg-brand-critical/90 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Request Deletion'}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm ${
              result.type === 'success'
                ? 'bg-green-500/10 text-green-600'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {result.message}
          </div>
        )}
      </main>
      <footer className="border-t border-brand-border py-8 text-center text-sm text-text-muted">
        <div className="mx-auto max-w-3xl px-4">
          <a href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</a>
          <span className="mx-3">&middot;</span>
          <a href="/terms-of-service" className="transition hover:text-foreground">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
