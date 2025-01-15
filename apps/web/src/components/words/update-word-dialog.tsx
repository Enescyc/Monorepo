import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Word, WordType, ProficiencyLevel } from '@vocabuddy/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, 
  Sparkles, 
  Languages, 
  BookOpen, 
  Plus,
  X,
  MessageSquare,
  Pencil,
  Save,
  Star,
  History,
  Tag,
  Zap,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  translations: z.array(z.object({
    language: z.string(),
    translation: z.string(),
  })),
  definitions: z.array(z.object({
    partOfSpeech: z.string(),
    meaning: z.string(),
  })),
  examples: z.array(z.string()),
  wordType: z.array(z.string()),
  etymology: z.object({
    origin: z.string(),
    history: z.string(),
  }).optional(),
  context: z.object({
    difficulty: z.string(),
    usageNotes: z.string().optional(),
    tags: z.array(z.string()),
  }),
  pronunciation: z.string().optional(),
});

interface UpdateWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: Word | null;
}

type ProcessingStage = 'idle' | 'updating' | 'saving';

const WORD_TYPES = Object.values(WordType);
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function UpdateWordDialog({ open, onOpenChange, word }: UpdateWordDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      translations: [],
      definitions: [],
      examples: [],
      wordType: [],
      etymology: {
        origin: '',
        history: '',
      },
      context: {
        difficulty: 'Intermediate',
        usageNotes: '',
        tags: [],
      },
      pronunciation: '',
    },
  });

  const stages: Record<ProcessingStage, { icon: React.ReactNode; text: string }> = {
    idle: { icon: <Pencil className="h-4 w-4" />, text: 'Ready to update' },
    updating: { icon: <Sparkles className="h-4 w-4" />, text: 'Updating word data...' },
    saving: { icon: <Save className="h-4 w-4 animate-spin" />, text: 'Saving changes...' },
  };

  useEffect(() => {
    if (word) {
      form.reset({
        translations: word.translations,
        definitions: word.definitions,
        examples: word.examples || [],
        wordType: word.wordType,
        etymology: word.etymology || {
          origin: '',
          history: '',
        },
        context: {
          difficulty: word.context.difficulty,
          usageNotes: word.context.usageNotes || '',
          tags: word.context.tags || [],
        },
        pronunciation: word.pronunciation || '',
      });
    }
  }, [word, form]);

  const simulateProcessing = async () => {
    const stages: ProcessingStage[] = ['updating', 'saving'];
    for (const stage of stages) {
      setProcessingStage(stage);
      const duration = Math.random() * 800 + 400;
      await new Promise(resolve => setTimeout(resolve, duration));
      setProgress(prev => prev + 50);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!word) return;

    try {
      setIsLoading(true);
      setProgress(0);
      
      await simulateProcessing();

      const response = await fetch(`/api/words/${word.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update word');

      toast({
        title: 'Success',
        description: 'Word updated successfully',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update word',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setProcessingStage('idle');
      setProgress(0);
    }
  }

  if (!word) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-blue-500" />
            Update Word: <span className="text-blue-500">{word.word}</span>
          </DialogTitle>
          <DialogDescription>
            Modify translations, definitions, examples, and other details for this word.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 px-6 pb-6 overflow-y-auto">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pronunciation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-purple-500" />
                      Pronunciation
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="IPA pronunciation..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="context.difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Difficulty
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Word Types */}
            <FormField
              control={form.control}
              name="wordType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-blue-500" />
                    Word Types
                  </FormLabel>
                  <FormControl>
                    <motion.div layout className="flex flex-wrap gap-2">
                      {WORD_TYPES.map((type) => (
                        <Button
                          key={type}
                          type="button"
                          size="sm"
                          variant={field.value.includes(type) ? "default" : "outline"}
                          onClick={() => {
                            const newTypes = field.value.includes(type)
                              ? field.value.filter(t => t !== type)
                              : [...field.value, type];
                            field.onChange(newTypes);
                          }}
                          disabled={isLoading}
                          className={cn(
                            "transition-all",
                            field.value.includes(type) && "bg-blue-500 hover:bg-blue-600"
                          )}
                        >
                          {type}
                        </Button>
                      ))}
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Translations Section */}
            <FormField
              control={form.control}
              name="translations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-blue-500" />
                    Translations
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value.map((translation, index) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >
                          <Input
                            placeholder="Language"
                            value={translation.language}
                            onChange={(e) => {
                              const newTranslations = [...field.value];
                              newTranslations[index] = {
                                ...newTranslations[index],
                                language: e.target.value,
                              };
                              field.onChange(newTranslations);
                            }}
                            disabled={isLoading}
                            className="w-1/3"
                          />
                          <Input
                            placeholder="Translation"
                            value={translation.translation}
                            onChange={(e) => {
                              const newTranslations = [...field.value];
                              newTranslations[index] = {
                                ...newTranslations[index],
                                translation: e.target.value,
                              };
                              field.onChange(newTranslations);
                            }}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => {
                              const newTranslations = field.value.filter((_, i) => i !== index);
                              field.onChange(newTranslations);
                            }}
                            className="shrink-0 hover:text-red-500 hover:border-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => {
                          field.onChange([...field.value, { language: '', translation: '' }]);
                        }}
                        className="w-full hover:bg-blue-500/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Translation
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Definitions Section */}
            <FormField
              control={form.control}
              name="definitions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Definitions
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value.map((definition, index) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >
                          <Input
                            placeholder="Part of Speech"
                            value={definition.partOfSpeech}
                            onChange={(e) => {
                              const newDefinitions = [...field.value];
                              newDefinitions[index] = {
                                ...newDefinitions[index],
                                partOfSpeech: e.target.value,
                              };
                              field.onChange(newDefinitions);
                            }}
                            disabled={isLoading}
                            className="w-1/3"
                          />
                          <Input
                            placeholder="Meaning"
                            value={definition.meaning}
                            onChange={(e) => {
                              const newDefinitions = [...field.value];
                              newDefinitions[index] = {
                                ...newDefinitions[index],
                                meaning: e.target.value,
                              };
                              field.onChange(newDefinitions);
                            }}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => {
                              const newDefinitions = field.value.filter((_, i) => i !== index);
                              field.onChange(newDefinitions);
                            }}
                            className="shrink-0 hover:text-red-500 hover:border-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => {
                          field.onChange([...field.value, { partOfSpeech: '', meaning: '' }]);
                        }}
                        className="w-full hover:bg-yellow-500/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Definition
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Examples Section */}
            <FormField
              control={form.control}
              name="examples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    Examples
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value.map((example, index) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >
                          <Input
                            value={example}
                            onChange={(e) => {
                              const newExamples = [...field.value];
                              newExamples[index] = e.target.value;
                              field.onChange(newExamples);
                            }}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => {
                              const newExamples = field.value.filter((_, i) => i !== index);
                              field.onChange(newExamples);
                            }}
                            className="shrink-0 hover:text-red-500 hover:border-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => {
                          field.onChange([...field.value, '']);
                        }}
                        className="w-full hover:bg-green-500/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Example
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Etymology Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4 text-purple-500" />
                Etymology
              </h4>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="etymology.origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Word origin..."
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="etymology.history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Historical development..."
                          className="resize-none"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Context Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Context
              </h4>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="context.usageNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add usage notes..."
                          className="resize-none"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="context.tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        Tags
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 bg-muted rounded-full px-3 py-1"
                            >
                              <span className="text-sm">{tag}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 hover:text-red-500"
                                onClick={() => {
                                  const newTags = field.value.filter((_, i) => i !== index);
                                  field.onChange(newTags);
                                }}
                                disabled={isLoading}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Input
                            placeholder="Add tag..."
                            className="w-32"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                field.onChange([...field.value, e.currentTarget.value]);
                                e.currentTarget.value = '';
                              }
                            }}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Processing Status */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {stages[processingStage].icon}
                      <span className="text-muted-foreground">
                        {stages[processingStage].text}
                      </span>
                    </div>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end gap-2 sticky bottom-0 pt-4 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 