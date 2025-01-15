"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Sparkles, Languages, BookOpen, BrainCircuit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  word: z.string().min(1, 'Word is required'),
});

interface AddWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProcessingStage = 'idle' | 'analyzing' | 'translating' | 'generating' | 'saving';

export function AddWordDialog({ open, onOpenChange }: AddWordDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
    },
  });

  const stages: Record<ProcessingStage, { icon: React.ReactNode; text: string }> = {
    idle: { icon: <BookOpen className="h-4 w-4" />, text: 'Ready to add word' },
    analyzing: { icon: <BrainCircuit className="h-4 w-4" />, text: 'Analyzing word...' },
    translating: { icon: <Languages className="h-4 w-4" />, text: 'Generating translations...' },
    generating: { icon: <Sparkles className="h-4 w-4" />, text: 'Creating examples and context...' },
    saving: { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: 'Saving word...' },
  };

  const simulateAIProcessing = async () => {
    const stages: ProcessingStage[] = ['analyzing', 'translating', 'generating', 'saving'];
    for (const stage of stages) {
      setProcessingStage(stage);
      const duration = Math.random() * 1000 + 500; // Random duration between 500-1500ms
      await new Promise(resolve => setTimeout(resolve, duration));
      setProgress(prev => prev + 25);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add words',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setProgress(0);
      
      // Start AI processing simulation
      await simulateAIProcessing();

      const response = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: values.word,
        }),
      });

      if (!response.ok) throw new Error('Failed to add word');

      toast({
        title: 'Success',
        description: 'Word added successfully',
      });

      // Invalidate and refetch words query
      await queryClient.invalidateQueries({ queryKey: ['words'] });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add word',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setProcessingStage('idle');
      setProgress(0);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Add New Word
          </DialogTitle>
          <DialogDescription>
            Enter a word and our AI will automatically generate translations, examples, and context.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Enter a word..." 
                        className="pr-10" 
                        {...field} 
                        disabled={isLoading}
                      />
                      <AnimatePresence>
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <Sparkles className="h-4 w-4 text-blue-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex justify-end gap-2">
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Add Word
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