'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Flame,
  Languages,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  User,
  UserProgress,
  PracticeSession,
  Language,
  PracticeSessionType,
  LanguageProgress,
} from '@vocabuddy/types';

// Extended Language type for the dashboard
interface DashboardLanguage extends Language {
  progress: LanguageProgress;
}

// Mock data based on our types
const mockUser: Partial<User> = {
  name: 'John Doe',
  progress: {
    overall: {
      totalWords: 450,
      masteredWords: 280,
      wordsInProgress: 170,
      totalStudyTime: 3600 * 24, // 24 hours
    },
    streak: {
      current: 7,
      longest: 14,
      lastStudyDate: new Date(),
    },
    xp: {
      total: 2750,
      level: 12,
      currentLevelProgress: 75,
    },
  } as UserProgress,
  languages: [
    { name: 'Spanish', code: 'es', progress: 65 },
    { name: 'French', code: 'fr', progress: 35 },
  ] as DashboardLanguage[],
};

const mockRecentSessions: Partial<PracticeSession>[] = [
  {
    sessionType: PracticeSessionType.FLASHCARD,
    duration: 900, // 15 minutes
    score: 85,
    results: {
      totalWords: 50,
      correctWords: 42,
      incorrectWords: 8,
      accuracy: 0.84,
      averageTimePerWord: 18,
      streak: 12,
      xpEarned: 120,
    },
  },
  {
    sessionType: PracticeSessionType.QUIZ,
    duration: 600, // 10 minutes
    score: 92,
    results: {
      totalWords: 30,
      correctWords: 28,
      incorrectWords: 2,
      accuracy: 0.93,
      averageTimePerWord: 20,
      streak: 15,
      xpEarned: 150,
    },
  },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {mockUser.name}! 👋</h1>
          <p className="text-muted-foreground">Here's your learning progress overview</p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600" asChild>
          <Link href="/practice">
            Start Practice
            <Zap className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current Streak"
          value={`${mockUser.progress?.streak.current} days`}
          icon={Flame}
          description="Keep it up!"
          trend="+2 from last week"
        />
        <StatsCard
          title="Words Mastered"
          value={mockUser.progress?.overall.masteredWords.toString() || '0'}
          icon={Brain}
          description="Total words learned"
          trend="+15 this week"
        />
        <StatsCard
          title="XP Points"
          value={mockUser.progress?.xp.total.toString() || '0'}
          icon={Star}
          description={`Level ${mockUser.progress?.xp.level}`}
          trend="+350 this week"
        />
        <StatsCard
          title="Study Time"
          value={formatTime(mockUser.progress?.overall.totalStudyTime || 0)}
          icon={Clock}
          description="Total time spent learning"
          trend="+2.5 hours this week"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Language Progress</h2>
              <p className="text-sm text-muted-foreground">Track your language learning journey</p>
            </div>
            <Languages className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-6">
            {(mockUser.languages as DashboardLanguage[])?.map((language) => (
              <div key={language.code} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-muted-foreground">{language.progress}%</span>
                </div>
                <Progress value={language.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Your latest practice sessions</p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-4">
            {mockRecentSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 mr-4">
                  {session.sessionType === PracticeSessionType.FLASHCARD ? (
                    <BookOpen className="w-5 h-5 text-primary" />
                  ) : (
                    <Target className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{formatSessionType(session.sessionType!)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.results?.correctWords} correct out of {session.results?.totalWords} words
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{session.score}%</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDuration(session.duration!)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Recent Achievements</h2>
            <p className="text-sm text-muted-foreground">Your latest milestones</p>
          </div>
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AchievementCard
            title="7 Day Streak"
            description="Practice consistently for 7 days"
            icon={Flame}
            date="Today"
            xp={50}
          />
          <AchievementCard
            title="Word Master"
            description="Master 250 words"
            icon={Brain}
            date="Yesterday"
            xp={100}
          />
          <AchievementCard
            title="Perfect Score"
            description="Get 100% in a practice session"
            icon={Target}
            date="2 days ago"
            xp={75}
          />
          <AchievementCard
            title="Level Up"
            description="Reach Level 10"
            icon={Award}
            date="3 days ago"
            xp={150}
          />
        </div>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  description: string;
  trend: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm font-medium text-green-600 dark:text-green-400">{trend}</p>
      </div>
    </Card>
  );
}

function AchievementCard({
  title,
  description,
  icon: Icon,
  date,
  xp,
}: {
  title: string;
  description: string;
  icon: any;
  date: string;
  xp: number;
}) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors">
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center mt-2 text-sm">
          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{date}</span>
          <div className="ml-4 flex items-center text-yellow-600 dark:text-yellow-400">
            <Star className="w-4 h-4 mr-1" />
            <span>{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  return `${hours} hours`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
}

function formatSessionType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + ' Practice';
}