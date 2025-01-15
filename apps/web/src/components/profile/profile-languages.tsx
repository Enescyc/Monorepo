'use client';

import { useState } from 'react';
import { Language } from '@vocabuddy/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EditLanguageDialog } from './edit-language-dialog';
import { LanguageSettingsDialog } from './language-settings-dialog';
import { 
  Globe2, 
  Plus, 
  Settings, 
  ChevronRight, 
  Star,
  BookOpen,
  Brain,
  Target
} from 'lucide-react';

interface ProfileLanguagesProps {
  languages: Language[];
}

export function ProfileLanguages({ languages }: ProfileLanguagesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

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
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Learning Languages</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedLanguage(null);
              setShowEditDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        <AnimatePresence>
          {languages.map((language) => (
            <motion.div
              key={language.code}
              variants={item}
              className="group relative bg-card rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold">{language.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {language.proficiency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {language.native ? 'Native' : `Started ${new Date(language.startedAt).toLocaleDateString()}`}
                    </div>
                    {!language.native && (
                      <>
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4" />
                          Last studied: {new Date(language.lastStudied).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {!language.native && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedLanguage(language);
                      setShowEditDialog(true);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {!language.native && (
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Proficiency Level</span>
                    <span className="font-medium">{language.proficiency}</span>
                  </div>
                  <Progress 
                    value={getProficiencyProgress(language.proficiency)} 
                    className="h-2"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <EditLanguageDialog
        language={selectedLanguage}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <LanguageSettingsDialog
        languages={languages}
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />
    </div>
  );
}

function getProficiencyProgress(level: string): number {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const index = levels.indexOf(level);
  return ((index + 1) / levels.length) * 100;
} 