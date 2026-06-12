'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageForm } from '../../page-form';
import { usePage, useUpdatePage } from '@/hooks/api/use-pages';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditCMSPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const { data: page, isLoading } = usePage(pageId);
  const updatePage = useUpdatePage();
  const isDelayedLoading = useDelayedLoading(isLoading);

  const handleSubmit = async (values: { title: string; slug: string; content: string; status: 'active' | 'inactive' }) => {
    try {
      await updatePage.mutateAsync({ id: pageId, ...values });
      toast.success('Page updated successfully');
      router.push(`/pages/${pageId}`);
    } catch {
      toast.error('Failed to update page');
    }
  };

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading page details" />;
  }

  if (!page) {
    return (
      <PageShell title="Page not found" description="The page you are trying to edit does not exist.">
        <Button variant="outline" onClick={() => router.push('/pages')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell 
      eyebrow="Content Management" 
      title={`Edit: ${page.title}`} 
      description="Update page content and settings."
      actions={
        <Button variant="outline" onClick={() => router.push(`/pages/${pageId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>
      }
    >
      <PageForm 
        initialValues={{
          title: page.title,
          slug: page.slug,
          content: page.content,
          status: page.status as 'active' | 'inactive'
        }} 
        onSubmit={handleSubmit} 
      />
    </PageShell>
  );
}
