import Link from 'next/link';
import { Icons } from '@/components/ui/icons';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Words', href: '/words' },
  { name: 'Practice', href: '/practice' },
  { name: 'Profile', href: '/profile' },
];

export function Navbar() {
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
          <div className="flex items-center">
            <Link
              href="/profile"
              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Icons.user className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 