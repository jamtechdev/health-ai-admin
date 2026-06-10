'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsList,
  useUnreadNotificationsCount,
} from '@/hooks/api/use-notifications';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import { ChevronLeft, ChevronRight, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsList(page);
  const { data: unreadCount } = useUnreadNotificationsCount();
  const isDelayedLoading = useDelayedLoading(isLoading);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <PageShell
      eyebrow="Alerts"
      title="Notifications"
      description="Operational notifications, user health reminders, and admin alerts."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllRead.mutate()}
          disabled={!unreadCount || unreadCount === 0 || markAllRead.isPending}
        >
          <CheckCheck className="mr-2 h-4 w-4 text-brand-secondary" />
          Mark all as read
        </Button>
      }
    >
      {isDelayedLoading ? (
        <VitalsLoader label="Loading notifications" />
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card key={n.id} className={!n.readAt ? 'border-brand-primary/50 shadow-[0_0_24px_var(--primary-glow)]' : ''}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      {n.User && (
                        <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-semibold text-text-muted border border-brand-border/50">
                          To: {n.User.name} ({n.User.email})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted line-clamp-1">{n.body}</p>
                    <p className="mt-1 text-xs text-text-disabled">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/notifications/${n.id}`)}
                      className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {!n.readAt && (
                      <Button size="sm" variant="outline" onClick={() => markRead.mutate(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-text-muted">
                  No notifications yet.
                </CardContent>
              </Card>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 rounded-card border border-brand-border/80 bg-surface/70 p-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-text-muted">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
