import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@vocabuddy/types';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user = session?.user as User | undefined;
  const isAuthenticated = !!session?.user;
  const isLoading = status === 'loading';

  const redirectToLogin = () => {
    router.push('/login');
  };

  const redirectToDashboard = () => {
    router.push('/dashboard');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    status,
    update,
    redirectToLogin,
    redirectToDashboard,
  };
} 