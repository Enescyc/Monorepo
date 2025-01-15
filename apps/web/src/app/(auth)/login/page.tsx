

import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthBenefits } from '@/components/auth/auth-benefits';
import { LoginHeader } from '@/components/auth/login/login-header';
import { LoginFormWrapper } from '@/components/auth/login/login-form-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | VocaBuddy',
  description: 'Login to your VocaBuddy account',
};

export default function LoginPage() {
  return (
    <AuthLayout benefits={<AuthBenefits />}>
      <LoginHeader />
      <LoginFormWrapper />
    </AuthLayout>
  );
} 