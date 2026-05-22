'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/api/response';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    let active = true;

    async function verifyEmail() {
      if (!token) {
        setStatus('error');
        setMessage('This verification link is missing a token.');
        return;
      }

      try {
        const result = await authService.verifyEmail(token);
        if (!active) return;
        setStatus('success');
        setMessage(result.message);
        toast.success(result.message);
      } catch (err) {
        if (!active) return;
        const errorMessage = getApiErrorMessage(err, 'Invalid or expired verification link');
        setStatus('error');
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    }

    void verifyEmail();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{status === 'success' ? 'Email Verified' : 'Verify Email'}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'loading' && (
          <p className="text-sm text-text-secondary">Please keep this page open while we confirm your link.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-text-secondary">
            The link may have expired. Sign in and request a new verification email from your account.
          </p>
        )}
        <Link href="/login" className={`${buttonVariants()} w-full`}>
          Back to login
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<p className="text-sm text-text-secondary">Loading verification...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
