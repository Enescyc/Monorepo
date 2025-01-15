"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { 
  BookOpen, 
  BrainCircuit, 
  Headphones, 
  MessageSquare, 
  Pencil,
  Trophy,
  TrendingUp,
  Flame,
  Star,
  Clock,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PracticePage = () => {
  const { data: practiceData } = useQuery({
    queryKey: ["practice-stats"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        streak: 7,
        xp: 2450,
        dailyGoal: 65,
        lastPracticed: "2 hours ago",
        recommendedMode: "Flashcards"
      };
    },
  });

  const practiceCards = [
    {
      title: "Flashcards",
      description: "Master vocabulary through spaced repetition",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-500",
      progress: 75,
      features: ["AI-powered", "Personalized"],
      recommended: true,
    },
    {
      title: "Quiz Challenge",
      description: "Test your knowledge with adaptive quizzes",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "bg-purple-500",
      progress: 60,
      features: ["AI-generated", "Multiple modes"],
    },
    {
      title: "Writing Lab",
      description: "Get instant AI feedback on your writing",
      icon: <Pencil className="w-6 h-6" />,
      color: "bg-green-500",
      progress: 45,
      features: ["Real-time feedback", "Context-aware"],
    },
    {
      title: "Speaking Studio",
      description: "Perfect your pronunciation with AI",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-orange-500",
      progress: 30,
      features: ["Voice recognition", "Accent analysis"],
    },
    {
      title: "Listening Room",
      description: "Improve comprehension with native audio",
      icon: <Headphones className="w-6 h-6" />,
      color: "bg-red-500",
      progress: 55,
      features: ["Native speakers", "Real scenarios"],
    },
  ];

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Practice Arena
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Level up your language skills with AI-powered practice modes
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              Last practiced {practiceData?.lastPracticed}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Target className="w-4 h-4 mr-1" />
              Recommended: {practiceData?.recommendedMode}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
      >
        <motion.div variants={item}>
          <Card className="p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-red-100">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Streak</p>
              <h3 className="text-2xl font-bold">{practiceData?.streak} Days</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <h3 className="text-2xl font-bold">{practiceData?.xp}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Today's Goal</p>
              <Badge variant="secondary">{practiceData?.dailyGoal}%</Badge>
            </div>
            <Progress value={practiceData?.dailyGoal} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground text-right">
              {100 - (practiceData?.dailyGoal || 0)}% to go
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Practice Modes Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Modes</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {practiceCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <Card className={cn(
                    "relative overflow-hidden hover:shadow-xl transition-all duration-300",
                    card.recommended && "ring-2 ring-purple-500 ring-opacity-50"
                  )}>
                    <div className={cn(
                      "absolute top-0 right-0 w-32 h-32 rounded-bl-full",
                      card.color,
                      "opacity-10"
                    )} />
                    {card.recommended && (
                      <Badge 
                        className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500"
                      >
                        Recommended
                      </Badge>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={cn(
                          "p-3 rounded-lg",
                          card.color,
                          "bg-opacity-10"
                        )}>
                          {card.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{card.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{card.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {card.features.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <Progress value={card.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Mastery</span>
                          <span className="text-sm font-medium">{card.progress}%</span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          Start Practice
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </TabsContent>

        <TabsContent value="recommended">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {practiceCards.filter(card => card.recommended).map((card, index) => (
              <motion.div key={card.title} variants={item}>
                <Card className={cn(
                  "relative overflow-hidden hover:shadow-xl transition-all duration-300",
                  card.color,
                  "ring-2 ring-purple-500 ring-opacity-50"
                )}>
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 rounded-bl-full",
                    card.color,
                    "opacity-10"
                  )} />
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        card.color,
                        "bg-opacity-10"
                      )}>
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{card.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <Progress value={card.progress} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mastery</span>
                        <span className="text-sm font-medium">{card.progress}%</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Start Practice
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="recent">
          {/* Recent practice modes would be populated from user history */}
          <p className="text-muted-foreground text-center py-8">No recent practice sessions</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PracticePage;