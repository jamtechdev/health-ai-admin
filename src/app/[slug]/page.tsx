'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PageData {
  title: string;
  content: string;
  updatedAt: string;
}

const publicPageContentClass =
  'public-page-content mt-8 max-w-none space-y-4';

export default function DynamicPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/backend/pages/slug/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) return Promise.reject();
        return r.json();
      })
      .then((res) => {
        if (res) { setData(res.data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
            <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-secondary" />
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-surface-secondary" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-surface-secondary" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-surface-secondary" />
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
            <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
          <p className="mt-2 text-text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="mt-6 inline-flex h-10 items-center justify-center rounded-button bg-brand-primary px-6 text-sm font-medium text-text-primary transition-colors hover:bg-brand-primary/90">
            Go home
          </Link>
        </main>
      </div>
    );
  }

  const title = data.title;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
          <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {data.updatedAt && (
          <p className="mt-2 text-sm text-text-muted">
            Last updated: {new Date(data.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div
          className={publicPageContentClass}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </main>
      <footer className="border-t border-brand-border py-8 text-center text-sm text-text-muted">
        <div className="mx-auto max-w-3xl px-4">
          <Link href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/terms-of-service" className="transition hover:text-foreground">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
