'use client';

import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { LoginForm } from '@/components/auth/login-form';

export function LoginFormWrapper() {
  return (
    <AnimatedWrapper
      animation="fadeInUp"
      delay={0.2}
    >
      <LoginForm />
    </AnimatedWrapper>
  );
} 