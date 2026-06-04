'use client';

import { useEffect, useState } from 'react';

interface PageData {
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function PageContent({ slug, fallbackTitle, fallbackBody }: { slug: string; fallbackTitle: string; fallbackBody: string }) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/backend/pages/slug/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-secondary" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-surface-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-secondary" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-surface-secondary" />
        </div>
      </div>
    );
  }

  const title = data?.title ?? fallbackTitle;
  const body = data?.content ?? fallbackBody;

  return (
    <div className="mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {data?.updatedAt && (
        <p className="mt-2 text-sm text-text-muted">Last updated: {new Date(data.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      )}
      <div
        className="prose prose-sm mt-8 max-w-none text-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-text-muted [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <a href="/" className="text-lg font-bold text-foreground">TovaPulse</a>
          <a href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</a>
        </div>
      </header>
      <main className="px-4">
        <PageContent
          slug="privacy-policy"
          fallbackTitle="Privacy Policy"
          fallbackBody="<p>Privacy policy content will appear here once published.</p>"
        />
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
