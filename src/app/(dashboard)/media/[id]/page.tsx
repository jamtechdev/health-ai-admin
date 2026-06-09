'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Info, Clock, Download, ExternalLink, Shield, File, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUploadsList } from '@/hooks/api/use-uploads';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function MediaViewPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;

  const { data, isLoading } = useUploadsList(1);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const file = data?.items.find(f => f.id === fileId);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading media asset" />;
  }

  if (!file) {
    return (
      <PageShell title="Asset not found" description="This media file could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/media')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Media
        </Button>
      </PageShell>
    );
  }

  const isImage = file.mimeType.startsWith('image/');

  return (
    <PageShell
      eyebrow="Assets"
      title="Media Detail"
      description={file.originalName}
      actions={
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => router.push('/media')}>
             <ArrowLeft className="mr-2 h-4 w-4" /> Back
           </Button>
           <a href={file.url} download target="_blank" rel="noopener noreferrer">
              <Button>
                 <Download className="mr-2 h-4 w-4" /> Download File
              </Button>
           </a>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Preview Area */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="bg-surface-secondary/30 border-b border-brand-border/50">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-brand-primary" />
              Resource Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.02] min-h-[400px] p-8">
                {isImage ? (
                   <img 
                      src={file.url} 
                      alt={file.originalName} 
                      className="max-w-full max-h-[600px] object-contain rounded-lg shadow-xl ring-1 ring-black/5" 
                   />
                ) : (
                   <div className="flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-3xl bg-surface-secondary flex items-center justify-center mb-4">
                         <File className="h-12 w-12 text-text-muted" />
                      </div>
                      <p className="text-lg font-bold text-foreground capitalize">{file.mimeType.split('/')[1]} File</p>
                      <p className="text-sm text-text-muted mt-1">No visual preview available for this format.</p>
                   </div>
                )}
             </div>
          </CardContent>
        </Card>

        {/* Info Area */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Info className="h-5 w-5 text-brand-secondary" />
                 File Metadata
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div className="flex justify-between items-center py-2 border-b border-brand-border/50 text-sm">
                      <span className="text-text-muted">MIME Type</span>
                      <span className="font-mono font-medium">{file.mimeType}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-brand-border/50 text-sm">
                      <span className="text-text-muted">File Size</span>
                      <span className="font-medium">{(file.size / 1024).toFixed(2)} KB</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-brand-border/50 text-sm">
                      <span className="text-text-muted">Uploaded On</span>
                      <span className="font-medium">{new Date(file.createdAt).toLocaleString()}</span>
                   </div>
                </div>
                <div className="mt-4">
                   <p className="text-xs text-text-muted mb-2 font-bold uppercase tracking-widest">Storage URL</p>
                   <div className="flex items-center gap-2 bg-surface-secondary p-2 rounded-lg border border-brand-border/50">
                      <code className="text-[10px] font-mono truncate flex-1">{file.url}</code>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-primary/80 shrink-0">
                         <ExternalLink className="h-3 w-3" />
                      </a>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Shield className="h-5 w-5 text-text-muted" />
                 System IDs
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-3">
                   <div>
                      <span className="text-xs text-text-muted block">Asset ID</span>
                      <code className="text-[10px] font-mono bg-surface-secondary p-1 rounded block truncate mt-1">{file.id}</code>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </PageShell>
  );
}
