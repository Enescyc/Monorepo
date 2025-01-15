import { AuthResponse, User } from '@vocabuddy/types';
import { jwtDecode } from 'jwt-decode';
import { NextAuthOptions, Session, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          console.log('Attempting login with:', { email: credentials.email });

          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          console.log('Login response:', { status: response.status, data });

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          const { user, access_token } = data as AuthResponse;

          if (!user || !access_token) {
            throw new Error('Invalid response from server');
          }

          return {
            ...user,
            accessToken: access_token,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
    verifyRequest: '/verify',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // Initial sign in
        if (account.type === 'credentials') {
          token.accessToken = (user as any).accessToken;
          token.user = user as User;
        } else if (account.type === 'oauth') {
          // Handle OAuth sign in/up
          try {
            const response = await fetch(`${BACKEND_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: account.access_token,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'OAuth authentication failed');
            }

            token.accessToken = data.access_token;
            token.user = data.user;
          } catch (error) {
            console.error('OAuth error:', error);
            return token;
          }
        }
      }

      // Check if token needs refresh
      if (token.accessToken) {
        const decodedToken = jwtDecode<{ exp?: number }>(token.accessToken as string);
        const expirationTime = decodedToken.exp! * 1000;
        
        if (Date.now() > expirationTime) {
          try {
            const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token.accessToken}`,
              },
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Token refresh failed');
            }

            console.log('data', data);
            token.accessToken = data.access_token;
            token.user = data.user;
          } catch (error) {
            console.error('Token refresh error:', error);
            return token;
          }
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token.user) {
        session.user = token.user as User;
      }
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions); 