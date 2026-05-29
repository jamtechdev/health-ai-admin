'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMarkNotificationRead, useNotificationsList } from '@/hooks/api/use-notifications';

export default function NotificationsPage() {
  const { data, isLoading } = useNotificationsList();
  const markRead = useMarkNotificationRead();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className="text-text-muted">Your notification center</p>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((n) => (
            <Card key={n.id} className={!n.readAt ? 'border-brand-primary/50 shadow-[0_0_24px_var(--primary-glow)]' : ''}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-text-muted">{n.body}</p>
                  <p className="mt-1 text-xs text-text-disabled">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.readAt && (
                  <Button size="sm" variant="outline" onClick={() => markRead.mutate(n.id)}>
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {!data?.length && <p className="text-text-muted">No notifications</p>}
        </div>
      )}
    </div>
  );
}
