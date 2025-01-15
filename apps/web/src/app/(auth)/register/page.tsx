'use client'
import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center space-x-2 rounded-full bg-primary/10 px-4 py-1.5">
          <Rocket className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Start your journey</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-primary to-blue-600 dark:from-white dark:via-primary dark:to-blue-400 bg-clip-text text-transparent">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join thousands of language learners today
        </p>
      </div>

      {/* Form */}
      <RegisterForm />

      {/* Footer */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>
        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 