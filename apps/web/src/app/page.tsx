'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  Brain, 
  GraduationCap, 
  Languages, 
  Sparkles,
  Star,
  Users,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              VocaBuddy
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px] animate-grid-fade" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8 relative z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Language Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-primary to-blue-600 dark:from-white dark:via-primary dark:to-blue-400 bg-clip-text text-transparent">
              Master Languages<br />with Intelligence
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners using AI-powered personalized practice sessions
              to master new languages faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 min-w-[200px]" asChild>
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose VocaBuddy?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven learning methods
              to help you achieve fluency faster.
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How VocaBuddy Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with VocaBuddy in three simple steps and begin your
              language learning journey today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  <div className="mt-4 flex items-center text-primary">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{step.benefit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/90 to-blue-600/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl font-bold">
              Ready to Start Your Language Learning Journey?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering new languages
              with VocaBuddy's AI-powered platform.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Twitter</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">LinkedIn</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold">VocaBuddy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} VocaBuddy. All rights reserved.
              </p>
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
    description: 'Our advanced AI analyzes your progress and creates personalized learning paths tailored to your needs.',
    icon: Brain,
  },
  {
    title: 'Smart Repetition',
    description: 'Practice words at optimal intervals using our scientifically-proven spaced repetition system.',
    icon: Zap,
  },
  {
    title: 'Progress Tracking',
    description: 'Track your learning journey with detailed analytics and insights about your progress.',
    icon: GraduationCap,
  },
];

const steps = [
  {
    title: 'Create Your Account',
    description: 'Sign up for free and tell us which language you want to master.',
    benefit: 'No credit card required',
  },
  {
    title: 'Take Assessment',
    description: 'Our AI evaluates your current level and creates a personalized plan.',
    benefit: 'Tailored to your goals',
  },
  {
    title: 'Start Learning',
    description: 'Practice daily with interactive exercises and track your progress.',
    benefit: 'Learn at your own pace',
  },
];

const stats = [
  {
    value: '50K+',
    label: 'Active Learners',
  },
  {
    value: '30+',
    label: 'Languages',
  },
  {
    value: '95%',
    label: 'Success Rate',
  },
  {
    value: '4.9/5',
    label: 'User Rating',
  },
];
