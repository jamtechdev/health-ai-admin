'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUploadFile, useUploadsList } from '@/hooks/api/use-uploads';
import { getApiErrorMessage } from '@/lib/api/response';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function MediaPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUploadsList(page);
  const isDelayedLoading = useDelayedLoading(isLoading);
  const uploadMutation = useUploadFile();

  const files = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <PageShell
      eyebrow="Assets"
      title="Media Manager"
      description="Upload and manage media assets, documents, and health-related files."
      actions={
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadMutation.mutate(file, {
                  onSuccess: () => {
                    toast.success('File uploaded');
                    setPage(1);
                  },
                  onError: (err) => toast.error(getApiErrorMessage(err, 'Upload failed')),
                });
              }
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
            <Upload className="mr-2 h-4 w-4" />
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </>
      }
    >

      {isDelayedLoading ? (
        <VitalsLoader label="Loading media assets" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <Card key={file.id} className="group relative overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-surface-secondary">
                    {file.mimeType.startsWith('image/') ? (
                      <img src={file.url} alt={file.originalName} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xl font-bold text-text-muted">{file.mimeType.split('/')[1].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                      <button
                        onClick={() => router.push(`/media/${file.id}`)}
                        className="rounded-full bg-surface p-2 text-foreground shadow-sm transition-transform hover:scale-110"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="truncate font-medium">{file.originalName}</p>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024).toFixed(1)} KB · {file.mimeType}
                  </p>
                </CardContent>
              </Card>
            ))}
            {files.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-12 text-center text-text-muted">No files uploaded yet.</CardContent>
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
