'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Password reset links have been replaced with one-time email codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Request a code with your email, then enter the code and your new password on the reset form.
          </p>
          <Link href="/forgot-password" className={`${buttonVariants()} w-full`}>
            Request reset code
          </Link>
          <Link href="/login" className="block text-center text-sm text-brand-primary hover:underline">
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
