'use client';

import { Achievement } from '@vocabuddy/types';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Crown } from 'lucide-react';

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case '⚡️':
        return <Zap className="w-5 h-5" />;
      case '👑':
        return <Crown className="w-5 h-5" />;
      case '🎯':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getAchievementColor = (icon: string) => {
    switch (icon) {
      case '⚡️':
        return 'from-orange-500 to-red-500';
      case '👑':
        return 'from-purple-500 to-blue-500';
      case '🎯':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-yellow-500 to-amber-500';
    }
  };

  const getProgress = (achievement: Achievement) => {
    return achievement.unlockedAt ? 100 : 0;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>
        <Badge variant="secondary" className="font-medium">
          <Star className="w-4 h-4 mr-1 text-yellow-500" />
          {achievements.filter(a => a.unlockedAt).length} / {achievements.length}
        </Badge>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            variants={item}
            className={`group relative bg-card rounded-lg p-4 hover:shadow-md transition-all ${
              achievement.unlockedAt ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${getAchievementColor(achievement.icon)} bg-opacity-10`}>
                {getAchievementIcon(achievement.icon)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlockedAt && (
                    <Badge 
                      variant="secondary"
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                    >
                      Completed
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <Progress 
                    value={getProgress(achievement)}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>
                      {achievement.unlockedAt ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                {achievement.points > 0 && (
                  <Badge variant="outline" className="mt-2">
                    Reward: {achievement.points} XP
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 