'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Eye, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { usePagesList, useDeletePage } from '@/hooks/api/use-pages';
import type { PageRecord } from '@/types/page';

function ActionsRow({ row }: { row: PageRecord }) {
  const router = useRouter();
  const deletePage = useDeletePage();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePage.mutateAsync(row.id);
      toast.success('Page deleted');
    } catch {
      toast.error('Failed to delete page');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => router.push(`/pages/${row.id}`)}
        className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-gray-500"
        title="Quick view"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => router.push(`/pages/${row.id}/edit`)}
        className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-orange-500"
        title="Edit page"
      >
        <Edit className="h-4 w-4" />
      </button>
      <a
        href={`/${row.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-blue-500"
        title="Open in new tab"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        className="rounded p-1.5 cursor-pointer transition-colors hover:bg-surface-secondary text-red-500"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete page"
        description="Are you sure you want to delete this page? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}

export default function PagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePagesList(page, search);

  const columns: Column<PageRecord>[] = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => <ActionsRow row={row} />,
    },
  ];

  return (
    <PageShell
      eyebrow="Content"
      title="Pages"
      
      description="Manage CMS pages like Privacy Policy, Terms of Service, and more."
      actions={
        <Link href="/pages/create">
          <Button>
            <Plus className="h-4 w-4" />
            New Page
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No pages found"
      />
    </PageShell>
  );
}
