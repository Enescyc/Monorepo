'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileLanguages } from '@/components/profile/profile-languages';
import { ProfileAchievements } from '@/components/profile/profile-achievements';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfilePremium } from '@/components/profile/profile-premium';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Trophy, Users, BookOpen, Target } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      Error: {error.message}
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen text-muted-foreground">
      No user found
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10"
      >
        <ProfileHeader user={user} />
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            <motion.div variants={item}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Progress Overview</CardTitle>
                  <Target className="w-6 h-6 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <ProfileStats progress={user.progress} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Languages</CardTitle>
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <ProfileLanguages languages={user.languages} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="stats">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            <motion.div variants={item} className="md:col-span-2">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Detailed Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileStats progress={user.progress} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="achievements">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Your Achievements</CardTitle>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <ProfileAchievements achievements={user.achievements} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            <motion.div variants={item}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <ProfilePremium user={user} />
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 