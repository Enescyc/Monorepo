import { Metadata } from 'next';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Dashboard | VocaBuddy',
  description: 'Your language learning dashboard',
};

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

export default function DashboardPage() {
  return (
    <motion.div 
      className="flex-1 space-y-8 p-8 pt-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <motion.h2 
          className="text-3xl font-bold tracking-tight"
          variants={item}
        >
          Dashboard
        </motion.h2>
        <motion.div 
          className="flex items-center space-x-2"
          variants={item}
        >
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search Words
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add New Word
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={item}
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +12 from last week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Best streak: 15 days
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastery Score</CardTitle>
            <Brain className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="h-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2h</div>
            <p className="text-xs text-muted-foreground">
              +1.2h from last week
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-500"
          >
            <Target className="h-6 w-6" />
            <span>Daily Goals</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-500"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Progress Report</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-yellow-500 hover:text-yellow-500"
          >
            <Trophy className="h-6 w-6" />
            <span>Achievements</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:text-green-500"
          >
            <Sparkles className="h-6 w-6" />
            <span>Practice Mode</span>
          </Button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Added new word: "Serendipity"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}