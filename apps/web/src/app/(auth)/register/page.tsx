import { RegisterForm } from '@/components/auth/register-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthBenefits } from '@/components/auth/auth-benefits';
import { motion } from 'framer-motion';
import { Metadata } from 'next';
import { RegisterFormWrapper } from '@/components/auth/register/register-form-wrapper';
import { RegisterHeader } from '@/components/auth/register/register-header';

export const metadata: Metadata = {
  title: 'Register | VocaBuddy',
  description: 'Register for a VocaBuddy account',
};

export default function RegisterPage() {
  return (
    <AuthLayout benefits={<AuthBenefits />}>
      <RegisterHeader />  
      <RegisterFormWrapper />
    </AuthLayout>
  );
} 