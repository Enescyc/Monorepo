'use client';

import { UserProgress } from '@vocabuddy/types';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Brain, Target, Trophy, Zap, Clock, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  progress: UserProgress;
}

export function ProfileStats({ progress }: ProfileStatsProps) {
  const { overall, streak, xp } = progress;

  const stats = [
    {
      title: 'Words Learned',
      value: overall.totalWords,
      target: overall.totalWords + overall.wordsInProgress,
      icon: <Brain className="w-4 h-4" />,
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Daily Streak',
      value: streak.current,
      target: streak.longest,
      icon: <Zap className="w-4 h-4" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Study Time',
      value: Math.round(overall.totalStudyTime / 60),
      target: 120, // 2 hours daily goal
      icon: <Clock className="w-4 h-4" />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Mastery Score',
      value: overall.masteredWords,
      target: overall.totalWords,
      icon: <Trophy className="w-4 h-4" />,
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                {stat.icon}
              </div>
              <span className="font-medium">{stat.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">/ {stat.target}</span>
            </div>
          </div>
          <div className="space-y-1">
            <Progress 
              value={(stat.value / stat.target) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round((stat.value / stat.target) * 100)}%</span>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-4 mt-4 border-t"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Overall Progress</span>
          </div>
          <span className="font-medium">
            Level {xp.level}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
} 