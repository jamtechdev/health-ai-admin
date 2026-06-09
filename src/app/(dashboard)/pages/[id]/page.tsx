'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Info, Clock, ExternalLink, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { usePagesList } from '@/hooks/api/use-pages';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import Link from 'next/link';

export default function CMSPageViewPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const { data, isLoading } = usePagesList(1, '');
  const isDelayedLoading = useDelayedLoading(isLoading);
  const cmsPage = data?.items.find(p => p.id === pageId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading page preview" />;
  }

  if (!cmsPage) {
    return (
      <PageShell title="Page not found" description="This CMS page could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/pages')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Content Management"
      title={cmsPage.title}
      description={`Slug: /${cmsPage.slug}`}
      actions={
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => router.push('/pages')}>
             <ArrowLeft className="mr-2 h-4 w-4" /> Back
           </Button>
           <a href={`/${cmsPage.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                 <ExternalLink className="mr-2 h-4 w-4" /> Live Preview
              </Button>
           </a>
           <Button onClick={() => router.push(`/pages/${cmsPage.id}/edit`)}>
             Edit Content
           </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-semibold">Page Info</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                      <span className="text-xs text-text-muted block">Status</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                        cmsPage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cmsPage.status.toUpperCase()}
                      </span>
                   </div>
                   <div>
                      <span className="text-xs text-text-muted block">Internal ID</span>
                      <code className="text-[10px] font-mono bg-surface-secondary p-1 rounded block truncate mt-1">{cmsPage.id}</code>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-semibold">Metadata</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                   <Clock className="h-4 w-4 text-text-muted" />
                   <div className="text-xs">
                      <p className="text-text-muted">Last Updated</p>
                      <p className="font-medium">{new Date(cmsPage.updatedAt).toLocaleDateString()}</p>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Content Area */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b border-brand-border/50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Page Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="prose prose-sm max-w-none dark:prose-invert bg-surface-elevated/30 p-8 rounded-2xl border border-brand-border/50 min-h-[400px]">
                <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
             </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
