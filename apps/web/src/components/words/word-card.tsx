import { Word, WordType, LearningStatus } from '@vocabuddy/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  Volume2,
  Bookmark,
  GraduationCap,
  Tag,
  History,
  Lightbulb,
  RefreshCw,
  Star,
  Languages,
  Sparkles,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WordCardProps {
  word: Word;
  onUpdate: () => void;
  onDelete: () => void;
}

export function WordCard({ word, onUpdate, onDelete }: WordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getStatusColor = (status: LearningStatus) => {
    switch (status) {
      case LearningStatus.NEW:
        return 'from-blue-500 to-cyan-500';
      case LearningStatus.LEARNING:
        return 'from-yellow-500 to-orange-500';
      case LearningStatus.MASTERED:
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusBadgeVariant = (status: LearningStatus) => {
    switch (status) {
      case LearningStatus.NEW:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
      case LearningStatus.LEARNING:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0';
      case LearningStatus.MASTERED:
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      default:
        return 'default';
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simulate audio playing
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.h3 
                className="text-xl font-bold"
                layout="position"
              >
                {word.word}
              </motion.h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 transition-colors",
                  isPlaying ? "text-blue-500" : "hover:text-blue-500"
                )}
                onClick={handlePlayAudio}
                disabled={isPlaying}
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="playing"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="volume"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="default"
                className={cn(
                  "transition-colors font-medium",
                  getStatusBadgeVariant(word.learning.status)
                )}
              >
                {word.learning.status}
              </Badge>
              <motion.div 
                initial={false}
                animate={{ width: 'auto' }}
                className="overflow-hidden"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:text-blue-500 hover:bg-blue-500/10" 
                    onClick={onUpdate}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:text-red-500 hover:bg-red-500/10" 
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Learning Progress</span>
              <span className="font-medium">{Math.round(word.learning.strength * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn(
                  "h-full bg-gradient-to-r",
                  getStatusColor(word.learning.status)
                )}
                initial={{ width: 0 }}
                animate={{ width: `${word.learning.strength * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Last: {formatDate(word.learning.lastStudied)}</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Next: {formatDate(word.learning.nextReview)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Languages className="h-4 w-4" />
              <span>{word.wordType.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>{word.context.difficulty}</span>
            </div>
          </div>

          {/* Translations */}
          <div className="flex flex-wrap gap-2">
            {word.translations.map((translation, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-colors cursor-default"
              >
                {translation.translation} ({translation.language})
              </Badge>
            ))}
          </div>

          {/* Expandable Content */}
          <motion.div
            className="grid"
            animate={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-hidden space-y-4">
              {/* Definitions */}
              {word.definitions.length > 0 && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Definitions
                  </h4>
                  <ul className="space-y-2">
                    {word.definitions.map((def, index) => (
                      <motion.li 
                        key={index} 
                        className="text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="font-medium text-muted-foreground">{def.partOfSpeech}:</span>{' '}
                        <span>{def.meaning}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Examples */}
              {word.examples.length > 0 && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-500" />
                    Examples
                  </h4>
                  <ul className="space-y-1">
                    {word.examples.map((example, index) => (
                      <motion.li 
                        key={index} 
                        className="text-sm text-muted-foreground pl-4 border-l-2 border-blue-500/20"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {example}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Context & Notes */}
              {word.context.usageNotes && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Usage Notes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {word.context.usageNotes}
                  </p>
                </motion.div>
              )}

              {/* Etymology */}
              {word.etymology && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-500" />
                    Etymology
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">Origin:</span> {word.etymology.origin}</p>
                    <p><span className="font-medium">History:</span> {word.etymology.history}</p>
                  </div>
                </motion.div>
              )}

              {/* Tags */}
              {word.context.tags.length > 0 && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {word.context.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="text-xs hover:bg-muted transition-colors"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Expand Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full hover:bg-muted/50" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
} 