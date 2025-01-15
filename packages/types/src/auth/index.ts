import { User } from '../user';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
  }
}

export interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: User;
} 