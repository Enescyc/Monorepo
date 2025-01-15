'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  benefits?: React.ReactNode;
}

export function AuthLayout({ children, benefits }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Benefits */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500" />
        <motion.div 
          className="relative z-20 flex items-center text-lg font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GraduationCap className="mr-2 h-6 w-6" />
          VocaBuddy
        </motion.div>

        {/* Benefits Section */}
        {benefits && (
          <div className="relative z-20 mt-auto">
            {benefits}
          </div>
        )}

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute right-1/4 top-1/4 h-32 w-32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full" />
          </motion.div>
          <motion.div
            className="absolute left-1/3 bottom-1/3 h-24 w-24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.4, 1],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-sm space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
} 