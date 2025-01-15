'use client';

import { motion } from 'framer-motion';
import { Brain, Target, Sparkles, Trophy } from 'lucide-react';

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function BenefitItem({ icon, title, description, delay }: BenefitItemProps) {
  return (
    <motion.div 
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-blue-100">{description}</p>
      </div>
    </motion.div>
  );
}

export function AuthBenefits() {
  const benefits = [
    {
      icon: <Brain className="h-6 w-6 text-blue-300" />,
      title: "AI-Powered Learning",
      description: "Our AI analyzes your progress and creates personalized learning paths.",
      delay: 0.6
    },
    {
      icon: <Target className="h-6 w-6 text-purple-300" />,
      title: "Smart Progress Tracking",
      description: "Track your learning journey with detailed insights and statistics.",
      delay: 0.8
    },
    {
      icon: <Sparkles className="h-6 w-6 text-pink-300" />,
      title: "Efficient Learning",
      description: "Learn faster with our proven spaced repetition system.",
      delay: 1.0
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-300" />,
      title: "Achievement System",
      description: "Stay motivated with rewards and track your milestones.",
      delay: 1.2
    }
  ];

  return (
    <>
      <motion.h2 
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        Why Choose VocaBuddy?
      </motion.h2>
      <div className="space-y-6">
        {benefits.map((benefit) => (
          <BenefitItem key={benefit.title} {...benefit} />
        ))}
      </div>
    </>
  );
} 