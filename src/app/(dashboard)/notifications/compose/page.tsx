'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Search, Send, Check, ChevronLeft, ChevronRight, X, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/ui/page-shell';
import { useUsersList } from '@/hooks/api/use-users';
import { useBroadcastNotification } from '@/hooks/api/use-notifications';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function ComposeNotificationPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useUsersList(page, search);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const broadcast = useBroadcastNotification();

  const users = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
    setSelectedIds(new Set());
  }, [searchInput]);

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length && users.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and message are required');
      return;
    }
    if (selectedIds.size === 0) {
      toast.error('Select at least one user');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await broadcast.mutateAsync({
        userIds: Array.from(selectedIds),
        title: title.trim(),
        body: body.trim(),
        type: 'admin_broadcast',
      });
      toast.success(`Sent to ${result.sent} user(s) (${result.pushSent} push delivered)`);
      setTitle('');
      setBody('');
      setSelectedIds(new Set());
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell
      eyebrow="Push Notification"
      title="Push Notification Composer"
      description="Send a push notification to one or more users. Each user will receive an in-app notification and a push alert."
      actions={
        <Button variant="outline" size="sm" onClick={() => router.push('/notifications')}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to notifications
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* User Selection */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Select Users</CardTitle>
            <CardDescription>
              {selectedIds.size > 0
                ? `${selectedIds.size} user(s) selected`
                : 'Search and select users to notify'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-brand-border accent-brand-primary"
                  checked={users.length > 0 && selectedIds.size === users.length}
                  onChange={toggleSelectAll}
                />
                Select all ({users.length})
              </label>
              {selectedIds.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:underline"
                >
                  <X className="h-3 w-3" />
                  Clear selection
                </button>
              )}
            </div>

            {isDelayedLoading ? (
              <div className="flex items-center justify-center py-12 text-text-muted">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-text-muted">No users found.</div>
            ) : (
              <div className="max-h-96 space-y-1 overflow-y-auto">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-brand-border/60 bg-surface-secondary/30 px-3 py-2.5 transition hover:bg-surface-secondary"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-brand-border accent-brand-primary"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{user.name || 'Unknown'}</p>
                        <p className="truncate text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                    {selectedIds.has(user.id) && (
                      <Check className="h-4 w-4 shrink-0 text-brand-primary" />
                    )}
                  </label>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-brand-border/60 pt-4">
                <span className="text-sm text-text-muted">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compose */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Message</CardTitle>
            <CardDescription>Compose your notification content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Title *</label>
              <Input
                placeholder="Notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
              <p className="mt-1 text-right text-xs text-text-disabled">{title.length}/120</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Message *</label>
              <textarea
                placeholder="Write your notification message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                rows={5}
                className="flex w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
              />
              <p className="mt-1 text-right text-xs text-text-disabled">{body.length}/500</p>
            </div>
            <div className="rounded-lg border border-brand-border/60 bg-surface-secondary/40 p-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Users className="h-4 w-4" />
                <span>
                  Sending to{' '}
                  <strong className="text-foreground">{selectedIds.size}</strong> user(s)
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !body.trim() || selectedIds.size === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
