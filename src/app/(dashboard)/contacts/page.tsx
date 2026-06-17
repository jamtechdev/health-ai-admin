'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PageShell } from '@/components/ui/page-shell';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Reply } from 'lucide-react';
import { api } from '@/lib/api/client';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

export default function ContactsPage() {
  const queryClient = useQueryClient();
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ContactRequest | null>(null);
  const [viewing, setViewing] = useState<ContactRequest | null>(null);
  const [deleting, setDeleting] = useState<ContactRequest | null>(null);

  const { data: contacts, isLoading } = useQuery<{ data: ContactRequest[] }>({
    queryKey: ['contacts'],
    queryFn: () => api.get('/admin/contacts').then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact request deleted');
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) => 
      api.post(`/admin/contacts/${id}/reply`, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Reply sent successfully');
      setReplyingTo(null);
      setReplyMessage('');
    },
  });

  const columns = [
    { key: 'name', header: 'Name', accessorKey: 'name' },
    { key: 'email', header: 'Email', accessorKey: 'email' },
    { key: 'subject', header: 'Subject', accessorKey: 'subject' },
    { key: 'status', header: 'Status', accessorKey: 'status' },
    { 
      key: 'date', 
      header: 'Date', 
      render: (row: ContactRequest) => new Date(row.createdAt).toLocaleDateString() 
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ContactRequest) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setViewing(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(row)}>
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleting(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageShell eyebrow="System" title="Contact Requests" description="Manage user contact inquiries">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable data={contacts?.data ?? []} columns={columns} />
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-6 rounded-lg w-full max-w-lg border border-brand-border">
            <h2 className="text-lg font-bold mb-4">Contact Details</h2>
            <p className="mb-2"><strong>Name:</strong> {viewing.name}</p>
            <p className="mb-2"><strong>Email:</strong> {viewing.email}</p>
            <p className="mb-2"><strong>Subject:</strong> {viewing.subject}</p>
            <p className="mb-4"><strong>Message:</strong><br/>{viewing.message}</p>
            <div className="flex justify-end">
              <Button onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-6 rounded-lg w-full max-w-md border border-brand-border">
            <h2 className="text-lg font-bold mb-4">Reply to {replyingTo.name}</h2>
            <textarea
              className="w-full h-32 p-2 border rounded bg-surface-elevated"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your professional reply here..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
              <Button onClick={() => replyMutation.mutate({ id: replyingTo.id, reply: replyMessage })}>Send Reply</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-6 rounded-lg w-full max-w-sm border border-brand-border">
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this contact request?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => {
                deleteMutation.mutate(deleting.id);
                setDeleting(null);
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
