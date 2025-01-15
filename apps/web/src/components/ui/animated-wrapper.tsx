'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown';
  delay?: number;
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
};

export function AnimatedWrapper({
  children,
  animation = 'fadeIn',
  delay = 0,
  className,
  ...props
}: AnimatedWrapperProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
} 