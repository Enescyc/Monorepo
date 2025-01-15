import { User } from '@vocabuddy/types';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
  }
} 