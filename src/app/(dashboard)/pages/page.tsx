'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/data-table';
import { PageShell } from '@/components/ui/page-shell';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { usePagesList, useDeletePage } from '@/hooks/api/use-pages';
import type { PageRecord } from '@/types/page';

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
    header: '',
    render: (row) => <ActionsRow row={row} />,
  },
];

function ActionsRow({ row }: { row: PageRecord }) {
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
    <div className="flex items-center gap-2">
      <Link
        href={`/pages/${row.id}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-secondary hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <a
        href={`/${row.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-secondary hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-50 hover:text-red-600"
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
