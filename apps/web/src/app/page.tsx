'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  GraduationCap, 
  Brain, 
  Sparkles, 
  Target, 
  Rocket,
  Languages,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe2
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <GraduationCap className="h-6 w-6" />
            <span>VocaBuddy</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="hover:text-primary" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-background" />
        <div className="container relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative h-20 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Master Vocabulary
              </span>{' '}
              with{' '}
              <span className="inline-flex items-center relative">
                AI-Powered
                <motion.div
                  className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-blue-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Learning
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized practice sessions, smart recommendations, and effective
              learning techniques to help you learn languages faster.
            </p>
            <motion.div 
              className="flex justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" asChild>
                <Link href="/register" className="gap-2">
                  Start Learning for Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute right-1/4 top-1/4 h-64 w-64"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute left-1/3 bottom-1/3 h-48 w-48"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.4, 1],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-background via-purple-500/5 to-background">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Why Choose VocaBuddy?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the latest in AI technology with proven learning methods
              to create the most effective language learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with VocaBuddy in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 hidden md:block" />
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500" />
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 mix-blend-overlay" />
        <div className="container relative mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Your Language Learning Journey?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering new languages
              with VocaBuddy.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/register" className="gap-2">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -right-24 -top-24 h-96 w-96 opacity-30"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-white rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute -left-24 -bottom-24 h-96 w-96 opacity-30"
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-white rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-primary">VocaBuddy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VocaBuddy. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'AI-Powered Learning',
    description:
      'Our AI analyzes your progress and creates personalized learning paths to help you learn more effectively.',
    icon: Brain
  },
  {
    title: 'Smart Spaced Repetition',
    description:
      'Practice words at optimal intervals to maximize retention and minimize forgetting.',
    icon: Sparkles
  },
  {
    title: 'Progress Tracking',
    description:
      'Track your learning journey with detailed statistics and insights about your progress.',
    icon: Target
  },
  {
    title: 'Multiple Languages',
    description:
      'Learn multiple languages simultaneously with our comprehensive language support.',
    icon: Globe2
  },
  {
    title: 'Achievement System',
    description:
      'Stay motivated with our gamified learning experience and achievement system.',
    icon: Trophy
  },
  {
    title: 'Quick Results',
    description:
      'See rapid improvement in your language skills with our efficient learning methods.',
    icon: Zap
  },
];

const steps = [
  {
    title: 'Create Your Account',
    description:
      'Sign up for free and tell us which language you want to learn.',
  },
  {
    title: 'Take a Placement Test',
    description:
      'Our AI will assess your current level and create a personalized learning plan.',
  },
  {
    title: 'Start Learning',
    description:
      'Practice daily with interactive exercises and track your progress.',
  },
];
