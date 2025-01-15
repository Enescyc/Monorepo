import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Authentication - VocaBuddy',
  description: 'Authentication pages for VocaBuddy',
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>

      {/* Right side - Hero image and text */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30">
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to VocaBuddy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-md">
            Your AI-powered language learning companion. Master vocabulary effortlessly with personalized practice sessions.
          </p>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
    </div>
  );
} 