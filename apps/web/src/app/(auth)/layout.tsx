import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, Brain, Languages } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center relative p-4 md:p-8">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px] animate-grid-fade" />
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute right-0 bottom-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float delay-200" />
        <div className="absolute left-1/3 -top-32 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float delay-500" />
      </div>

      {/* Logo */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          VocaBuddy
        </span>
      </Link>

      {/* Main content */}
      <div className="w-full max-w-md relative">
        {/* Card effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-3xl transform rotate-1 scale-105 blur-xl" />
        
        {/* Card */}
        <div className="relative bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
          {children}
        </div>
      </div>

      
      <div className="hidden lg:block absolute left-12 bottom-12 text-primary/20">
        <Languages className="w-24 h-24 animate-float delay-300" />
      </div>
    </div>
  );
} 