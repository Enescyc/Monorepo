import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Verify Email - VocaBuddy',
  description: 'Verify your email address',
};

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <Icons.mail className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent you a verification link. Please check your email to verify your account.
        </p>
      </div>

      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
} 