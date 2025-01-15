'use client';

import { AnimatedWrapper } from '@/components/ui/animated-wrapper';

export function RegisterHeader() {
  return (
    <AnimatedWrapper 
      className="flex flex-col space-y-2 text-center"
      animation="fadeInDown"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="text-sm text-muted-foreground">
        Start your language learning journey today
      </p>
    </AnimatedWrapper>
  );
} 