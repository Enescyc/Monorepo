import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Authentication Error - VocaBuddy',
  description: 'Authentication error page',
};

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Authentication Error
        </h1>
        <p className="text-sm text-muted-foreground">
          There was an error during authentication. Please try again.
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