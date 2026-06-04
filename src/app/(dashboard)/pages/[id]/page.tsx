'use client';

import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { PageForm } from '../page-form';
import { usePage, useUpdatePage } from '@/hooks/api/use-pages';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsTableSkeleton } from '@/components/ui/vitals-loader';

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: page, isLoading } = usePage(params.id);
  const updatePage = useUpdatePage();

  if (isLoading) {
    return (
      <PageShell eyebrow="Content" title="Edit Page" description="Loading...">
        <VitalsTableSkeleton />
      </PageShell>
    );
  }

  if (!page) {
    return (
      <PageShell eyebrow="Content" title="Edit Page" description="Page not found.">
        <p className="text-text-muted">Page not found.</p>
      </PageShell>
    );
  }

  const handleSubmit = async (values: { title: string; slug: string; content: string; status: 'active' | 'inactive' }) => {
    try {
      await updatePage.mutateAsync({ id: params.id, ...values });
      toast.success('Page updated');
      router.push('/pages');
    } catch {
      toast.error('Failed to update page');
    }
  };

  return (
    <PageShell eyebrow="Content" title="Edit Page" description={`Editing: ${page.title}`}>
      <PageForm initialValues={page} onSubmit={handleSubmit} />
    </PageShell>
  );
}
