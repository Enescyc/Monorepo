'use client';

import { AnimatedWrapper } from '@/components/ui/animated-wrapper';

export function LoginHeader() {
  return (
    <AnimatedWrapper 
      className="flex flex-col space-y-2 text-center"
      animation="fadeInDown"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground">
        Continue your language learning journey
      </p>
    </AnimatedWrapper>
  );
} 