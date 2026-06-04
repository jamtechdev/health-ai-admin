'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageForm } from '../page-form';
import { useCreatePage } from '@/hooks/api/use-pages';
import { PageShell } from '@/components/ui/page-shell';

export default function CreatePage() {
  const router = useRouter();
  const createPage = useCreatePage();

  const handleSubmit = async (values: { title: string; slug: string; content: string; status: 'active' | 'inactive' }) => {
    try {
      await createPage.mutateAsync(values);
      toast.success('Page created');
      router.push('/pages');
    } catch {
      toast.error('Failed to create page');
    }
  };

  return (
    <PageShell eyebrow="Content" title="Create Page" description="Create a new CMS page.">
      <PageForm onSubmit={handleSubmit} />
    </PageShell>
  );
}
