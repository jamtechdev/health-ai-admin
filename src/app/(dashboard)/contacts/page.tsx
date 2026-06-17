'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  Eye,
  Mail,
  MessageSquareReply,
  Reply,
  Trash2,
  X,
  CheckCircle2,
  Clock3,
  Inbox,
} from 'lucide-react';
import { PageShell } from '@/components/ui/page-shell';
import { DataTable, type Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useContacts,
  useDeleteContact,
  useReplyContact,
  useUpdateContactStatus,
} from '@/hooks/api/use-contacts';
import type { ContactRequestRecord, ContactStatus } from '@/types/contact';

const statusStyles: Record<ContactStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700',
  replied: 'bg-emerald-500/15 text-emerald-700',
  closed: 'bg-slate-500/15 text-slate-700',
};

function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function ContactStats({ contacts }: { contacts: ContactRequestRecord[] }) {
  const pending = contacts.filter((item) => item.status === 'pending').length;
  const replied = contacts.filter((item) => item.status === 'replied').length;
  const closed = contacts.filter((item) => item.status === 'closed').length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Total inquiries', value: contacts.length, icon: Inbox },
        { label: 'Pending', value: pending, icon: Clock3 },
        { label: 'Replied', value: replied, icon: MessageSquareReply },
        { label: 'Closed', value: closed, icon: CheckCircle2 },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">{item.label}</CardTitle>
              <Icon className="h-5 w-5 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ContactThread({ contact }: { contact: ContactRequestRecord }) {
  return (
    <div className="space-y-4">
      <div className="rounded-card border border-brand-border/80 bg-surface-elevated/60 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          <Mail className="h-4 w-4" />
          Original message
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{contact.message}</p>
        <p className="mt-3 text-xs text-text-muted">
          Received {new Date(contact.createdAt).toLocaleString()}
        </p>
      </div>

      {contact.adminReply && (
        <div className="rounded-card border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <MessageSquareReply className="h-4 w-4" />
            Admin reply
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{contact.adminReply}</p>
          {contact.repliedAt && (
            <p className="mt-3 text-xs text-text-muted">
              Sent {new Date(contact.repliedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[24px] border border-brand-border bg-surface shadow-soft sm:rounded-card ${wide ? 'max-w-3xl' : 'max-w-lg'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const replyMutation = useReplyContact();
  const deleteMutation = useDeleteContact();
  const statusMutation = useUpdateContactStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactStatus>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ContactRequestRecord | null>(null);
  const [viewing, setViewing] = useState<ContactRequestRecord | null>(null);
  const [deleting, setDeleting] = useState<ContactRequestRecord | null>(null);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      const matchesSearch =
        !query ||
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        (contact.subject ?? '').toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query) ||
        (contact.adminReply ?? '').toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [contacts, search, statusFilter]);

  const tableRows = filteredContacts.map((contact) => ({
    ...contact,
    id: String(contact.id),
  }));

  const handleReply = async () => {
    if (!replyingTo || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await replyMutation.mutateAsync({ id: replyingTo.id, reply: replyMessage.trim() });
      toast.success('Reply sent successfully');
      setReplyingTo(null);
      setReplyMessage('');
    } catch {
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Contact request deleted');
      setDeleting(null);
    } catch {
      toast.error('Failed to delete contact request');
    }
  };

  const columns: Column<(typeof tableRows)[number]>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          {row.company && <p className="text-xs text-text-muted">{row.company}</p>}
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => row.subject || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'reply',
      header: 'Reply',
      render: (row) =>
        row.adminReply ? (
          <span className="line-clamp-2 max-w-[220px] text-xs text-text-secondary">{row.adminReply}</span>
        ) : (
          <span className="text-xs text-text-muted">No reply yet</span>
        ),
    },
    {
      key: 'date',
      header: 'Received',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        const contact = contacts.find((item) => item.id === Number(row.id));
        if (!contact) return null;

        return (
          <div className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" onClick={() => setViewing(contact)} aria-label="View">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(contact)} aria-label="Reply">
              <Reply className="h-4 w-4" />
            </Button>
            {contact.status !== 'closed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => statusMutation.mutate({ id: contact.id, status: 'closed' })}
                aria-label="Close"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={() => setDeleting(contact)}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell
      eyebrow="System"
      title="Contact Requests"
      description="Review inquiries, send branded replies, and track every admin response in one place."
    >
      <ContactStats contacts={contacts} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'replied', 'closed'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <div className="w-full lg:max-w-sm">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, message, or reply..."
            className="h-11"
          />
        </div>
      </div>

      <div className="hidden md:block">
        <DataTable
          data={tableRows}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No contact requests match your filters."
        />
      </div>

      <div className="space-y-4 md:hidden">
        {isLoading ? (
          <div className="rounded-card border border-brand-border bg-surface p-6 text-sm text-text-muted">
            Loading contact requests...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="rounded-card border border-dashed border-brand-border bg-surface p-8 text-center text-sm text-text-muted">
            No contact requests match your filters.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{contact.name}</CardTitle>
                    <p className="text-sm text-text-muted">{contact.email}</p>
                  </div>
                  <StatusBadge status={contact.status} />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{contact.subject || 'No subject'}</p>
                  <p className="mt-2 line-clamp-3 text-text-secondary">{contact.message}</p>
                </div>
                {contact.adminReply && (
                  <div className="rounded-card border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Admin reply</p>
                    <p className="mt-2 line-clamp-4 text-text-secondary">{contact.adminReply}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setViewing(contact)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button size="sm" onClick={() => setReplyingTo(contact)}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                {contact.status !== 'closed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => statusMutation.mutate({ id: contact.id, status: 'closed' })}
                  >
                    Close
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => setDeleting(contact)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {viewing && (
        <ModalShell title="Contact conversation" onClose={() => setViewing(null)} wide>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Name</p>
                <p className="text-sm font-medium">{viewing.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Email</p>
                <p className="text-sm font-medium">{viewing.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Subject</p>
                <p className="text-sm font-medium">{viewing.subject || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Status</p>
                <div className="mt-1"><StatusBadge status={viewing.status} /></div>
              </div>
              {viewing.company && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Company</p>
                  <p className="text-sm font-medium">{viewing.company}</p>
                </div>
              )}
            </div>
            <ContactThread contact={viewing} />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => {
                setReplyingTo(viewing);
                setViewing(null);
              }}>
                Reply
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {replyingTo && (
        <ModalShell title={`Reply to ${replyingTo.name}`} onClose={() => setReplyingTo(null)}>
          <div className="space-y-4">
            <div className="rounded-card border border-brand-border/80 bg-surface-elevated/60 p-4 text-sm text-text-secondary">
              <p className="font-medium text-foreground">{replyingTo.subject || 'No subject'}</p>
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap">{replyingTo.message}</p>
            </div>
            <textarea
              className="min-h-40 w-full rounded-card border border-brand-border bg-surface-elevated p-3 text-sm outline-none ring-brand-primary focus:ring-2"
              value={replyMessage}
              onChange={(event) => setReplyMessage(event.target.value)}
              placeholder="Write a professional reply. The user will receive a branded TovaPulse email."
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
              <Button onClick={handleReply} disabled={replyMutation.isPending}>
                {replyMutation.isPending ? 'Sending...' : 'Send reply'}
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {deleting && (
        <ModalShell title="Delete contact request" onClose={() => setDeleting(null)}>
          <p className="text-sm text-text-secondary">
            Are you sure you want to permanently delete the inquiry from <strong>{deleting.name}</strong>?
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </ModalShell>
      )}
    </PageShell>
  );
}
