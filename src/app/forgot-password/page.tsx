'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/api/response';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async () => {
    await authService.forgotPassword(email);
    setStep('otp');
    toast.success('If the email exists, a reset code was sent');
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    await authService.resetPassword(email, otp, password);
    toast.success('Password reset successful');
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (step === 'email') {
        await requestCode();
      } else {
        await resetPassword();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your email and we will send a one-time reset code.'
              : 'Enter the code from your email and choose a new password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === 'otp'}
              required
            />
            {step === 'otp' && (
              <>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  minLength={6}
                  maxLength={6}
                  required
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : step === 'email' ? 'Send reset code' : 'Reset password'}
            </Button>
            {step === 'otp' && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                Use a different email
              </Button>
            )}
            <Link href="/login" className="block text-center text-sm text-brand-primary hover:underline">
              Back to login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
