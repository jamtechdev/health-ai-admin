'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Info, Clock, User, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useNotificationsList } from '@/hooks/api/use-notifications';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function NotificationViewPage() {
  const params = useParams();
  const router = useRouter();
  const notificationId = params.id as string;

  const { data, isLoading } = useNotificationsList(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const notification = data?.items.find(n => n.id === notificationId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading notification" />;
  }

  if (!notification) {
    return (
      <PageShell title="Notification not found" description="This notification could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/notifications')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notifications
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Alerts"
      title={notification.title}
      description={`Sent on ${new Date(notification.createdAt).toLocaleString()}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/notifications')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-brand-border/50">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-brand-primary" />
              Notification Message
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="p-6 rounded-2xl bg-surface-secondary border border-brand-border/50 shadow-inner">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                   {notification.body}
                </p>
             </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <div className="lg:col-span-1 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Info className="h-5 w-5 text-brand-secondary" />
                 Delivery Info
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                      <span className="text-xs text-text-muted block">Type</span>
                      <span className="font-bold uppercase tracking-wider text-sm">{notification.type}</span>
                   </div>
                   <div>
                      <span className="text-xs text-text-muted block">Status</span>
                      <div className="flex items-center gap-2 mt-1">
                         {notification.readAt ? (
                            <>
                               <CheckCircle className="h-4 w-4 text-brand-secondary" />
                               <span className="text-sm font-medium text-brand-secondary">Read</span>
                            </>
                         ) : (
                            <>
                               <Clock className="h-4 w-4 text-amber-500" />
                               <span className="text-sm font-medium text-amber-500">Unread</span>
                            </>
                         )}
                      </div>
                   </div>
                   {notification.readAt && (
                      <div>
                         <span className="text-xs text-text-muted block">Read At</span>
                         <span className="text-xs font-medium">{new Date(notification.readAt).toLocaleString()}</span>
                      </div>
                   )}
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Clock className="h-5 w-5 text-text-muted" />
                 Internal Data
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-2">
                   <span className="text-xs text-text-muted block">Notification ID</span>
                   <code className="text-[10px] font-mono bg-surface-secondary p-1 rounded block truncate">
                      {notification.id}
                   </code>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </PageShell>
  );
}
