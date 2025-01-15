'use client';

import { User } from '@vocabuddy/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditProfileDialog } from './edit-profile-dialog';
import { motion } from 'framer-motion';
import { Crown, Mail, MapPin, Calendar, Globe2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarImage src={user.settings?.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </motion.div>

      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 space-y-3"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.premium?.isActive && (
            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
          {user.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
          )}
          {user.settings?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {user.settings.location}
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
          {user.settings?.nativeLanguage && (
            <div className="flex items-center gap-1">
              <Globe2 className="w-4 h-4" />
              Native: {user.settings.nativeLanguage}
            </div>
          )}
        </div>

        {user.settings?.bio && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-2"
          >
            {user.settings.bio}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          onClick={() => setIsEditDialogOpen(true)}
          variant="outline"
          className="hover:bg-muted"
        >
          Edit Profile
        </Button>
      </motion.div>

      <EditProfileDialog 
        user={user} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </div>
  );
} 