'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, Info, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useAccountRequests } from '@/hooks/api/use-account-requests';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function AccountRequestViewPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  // Note: Assuming useAccountRequests can fetch by ID or we filter from the list
  // For simplicity and based on existing hooks, I'll filter from the list for now
  // In a real app, a useAccountRequest(id) hook should exist.
  const { data, isLoading } = useAccountRequests(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const request = data?.items.find(r => r.id === requestId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading request details" />;
  }

  if (!request) {
    return (
      <PageShell title="Request not found" description="This account request could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/account-requests')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="People"
      title="Request Details"
      description={`ID: ${request.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/account-requests')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-primary" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold">
                  {request.user?.name?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="font-bold text-lg">{request.user?.name || 'Unknown User'}</p>
                  <p className="text-sm text-text-muted">{request.user?.email || 'No email'}</p>
               </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-brand-border/50">
               <div className="flex justify-between">
                  <span className="text-sm text-text-muted">User ID</span>
                  <code className="text-xs font-mono bg-surface-secondary px-2 py-1 rounded">{request.user?.id}</code>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-brand-secondary" />
              Request Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-surface-secondary/50 border border-brand-border/50">
                  <span className="text-xs text-text-muted block mb-1">Action Type</span>
                  <span className="font-semibold capitalize">{request.action.replace('_', ' ')}</span>
               </div>
               <div className="p-4 rounded-xl bg-surface-secondary/50 border border-brand-border/50">
                  <span className="text-xs text-text-muted block mb-1">Current Status</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    request.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
               </div>
            </div>
            <div className="p-4 rounded-xl bg-brand-critical/5 border border-brand-critical/20 flex items-start gap-3">
               <AlertTriangle className="h-5 w-5 text-brand-critical mt-0.5" />
               <div>
                  <p className="text-sm font-semibold text-brand-critical">Deletion Reason</p>
                  <p className="text-sm text-text-secondary mt-1">{request.reason || "No reason provided."}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-text-muted" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-surface-secondary flex items-center justify-center">
                <Calendar className="h-4 w-4 text-text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium">Requested On</p>
                <p className="text-xs text-text-muted">{request.createdAt ? new Date(request.createdAt).toLocaleString() : '—'}</p>
              </div>
            </div>
            {request.deletedAt && (
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-brand-critical/10 flex items-center justify-center text-brand-critical">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-critical">Deleted On</p>
                  <p className="text-xs text-text-muted">{new Date(request.deletedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
