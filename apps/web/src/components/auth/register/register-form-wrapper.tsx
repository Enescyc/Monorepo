'use client';

import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { RegisterForm } from '@/components/auth/register-form';

export function RegisterFormWrapper() {
  return (
    <AnimatedWrapper
      animation="fadeInUp"
      delay={0.2}
    >
      <RegisterForm />
    </AnimatedWrapper>
  );
} 