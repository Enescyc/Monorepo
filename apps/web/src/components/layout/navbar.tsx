'use client';

import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Words', href: '/words' },
  { name: 'Practice', href: '/practice' },
  { name: 'Profile', href: '/profile' },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              VocaBuddy
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Link href="/profile">
                <Icons.user className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm font-medium"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 