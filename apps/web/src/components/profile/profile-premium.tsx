'use client';

import { User, PremiumFeature } from '@vocabuddy/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  Brain, 
  Sparkles,
  MessageSquare,
  Infinity,
  Check
} from 'lucide-react';

interface ProfilePremiumProps {
  user: User;
}

export function ProfilePremium({ user }: ProfilePremiumProps) {
  const premiumFeatures = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI Tutor",
      description: "Get personalized learning recommendations",
      feature: PremiumFeature.AI_SUGGESTIONS,
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Unlimited Words",
      description: "Create and manage unlimited word lists",
      feature: PremiumFeature.UNLIMITED_WORDS,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Enhanced Practice",
      description: "Access advanced practice modes",
      feature: PremiumFeature.ENHANCED_PRACTICE,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Priority Support",
      description: "Get 24/7 priority customer support",
      feature: PremiumFeature.PRIORITY_SUPPORT,
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

  const hasFeature = (feature: PremiumFeature) => {
    return user?.premium?.features?.includes(feature) || false;
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 via-blue-500/20 to-transparent rounded-bl-full" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <CardTitle>Premium Features</CardTitle>
          </div>
          {user.premium?.isActive && (
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {user.premium?.plan?.charAt(0).toUpperCase() + user.premium.plan.slice(1)} Plan
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <div className="grid gap-4">
            {premiumFeatures?.map((feature) => (
              <motion.div
                key={feature.feature}
                variants={item}
                className="flex items-start gap-4"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                {hasFeature(feature.feature) && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </motion.div>
            ))}
          </div>

          {!user.premium?.isActive && (
            <motion.div
              variants={item}
              className="pt-4 border-t"
            >
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Cancel anytime · 30-day money-back guarantee
              </p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
} 