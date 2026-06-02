'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUploadFile, useUploadsList } from '@/hooks/api/use-uploads';
import { getApiErrorMessage } from '@/lib/api/response';

export default function MediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [page] = useState(1);
  const { data, isLoading } = useUploadsList(page);
  const uploadMutation = useUploadFile();

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
                  onSuccess: () => toast.success('File uploaded'),
                  onError: (err) => toast.error(getApiErrorMessage(err, 'Upload failed')),
                });
              }
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </>
      }
    >

      {isLoading ? (
        <VitalsLoader label="Loading media assets" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(data?.items ?? []).map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <p className="truncate font-medium">{file.originalName}</p>
                <p className="text-xs text-text-muted">
                  {(file.size / 1024).toFixed(1)} KB · {file.mimeType}
                </p>
              </CardContent>
            </Card>
          ))}
          {!data?.items?.length && (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center text-text-muted">No files uploaded yet.</CardContent>
            </Card>
          )}
        </div>
      )}
    </PageShell>
  );
}
