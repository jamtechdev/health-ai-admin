'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/editor/rich-text-editor';

interface PageFormProps {
  initialValues?: {
    title: string;
    slug: string;
    content: string;
    status: 'active' | 'inactive';
  };
  onSubmit: (values: { title: string; slug: string; content: string; status: 'active' | 'inactive' }) => void;
}

export function PageForm({ initialValues, onSubmit }: PageFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initialValues?.status ?? 'active');

  useEffect(() => {
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, slug, content, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-end">
            <Button type="submit">
              {initialValues ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Slug
              <span className="ml-2 rounded bg-surface-secondary px-2 py-0.5 text-[11px] text-text-muted">auto</span>
            </label>
            <Input
              value={slug}
              placeholder="auto-generated from title"
              readOnly
              className="cursor-default opacity-70"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your page content..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-green-500/40 has-[:checked]:bg-green-500/10 has-[:checked]:text-green-600">
                <input
                  type="radio"
                  name="status"
                  className="h-4 w-4 accent-green-600"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                />
                Active
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-surface/50 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-red-500/40 has-[:checked]:bg-red-500/10 has-[:checked]:text-red-600">
                <input
                  type="radio"
                  name="status"
                  className="h-4 w-4 accent-red-600"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                />
                Inactive
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
