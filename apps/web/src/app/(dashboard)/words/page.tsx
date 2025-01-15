'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Word, WordType, LearningStatus } from '@vocabuddy/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WordCard } from '@/components/words/word-card';
import { AddWordDialog } from '@/components/words/add-word-dialog';
import { UpdateWordDialog } from '@/components/words/update-word-dialog';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type CheckedState } from "@radix-ui/react-checkbox";
import { 
  Plus, 
  Search, 
  SortAsc, 
  SortDesc, 
  BookOpen,
  Loader2,
  AlertCircle,
  LayoutGrid,
  List,
  Filter,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface WordsResponse {
  data: Word[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

type ViewMode = 'grid' | 'list';

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function WordsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState({
    status: [] as LearningStatus[],
    difficulty: [] as string[],
    wordTypes: [] as WordType[],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<WordsResponse>({
    queryKey: ['words', page, search, sortBy, sortOrder, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        sortBy,
        sortOrder,
        ...(filters.status.length && { status: filters.status.join(',') }),
        ...(filters.difficulty.length && { difficulty: filters.difficulty.join(',') }),
        ...(filters.wordTypes.length && { wordTypes: filters.wordTypes.join(',') }),
      });
      const res = await fetch(`/api/words?${params}`);
      if (!res.ok) throw new Error('Failed to fetch words');
      return res.json();
    },
  });

  const handleDelete = async (wordId: string) => {
    try {
      const res = await fetch(`/api/words/${wordId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete word');

      toast({
        title: 'Success',
        description: 'Word deleted successfully',
      });

      await queryClient.invalidateQueries({ queryKey: ['words'] });
    } catch (error) {
      console.error('Error deleting word:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete word',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (
    type: 'status' | 'difficulty' | 'wordTypes',
    value: string,
    checked: boolean | CheckedState
  ) => {
    if (typeof checked === 'boolean') {
      setFilters(prev => ({
        ...prev,
        [type]: checked
          ? [...prev[type], value]
          : prev[type].filter(v => v !== value)
      }));
      setPage(1); // Reset to first page when filters change
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      difficulty: [],
      wordTypes: [],
    });
    setPage(1);
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const renderWordsList = () => (
    <div className="space-y-2">
      {data?.data.map((word) => (
        <motion.div
          key={word.id}
          variants={item}
          className="bg-card hover:bg-accent/50 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{word.word}</h3>
                <p className="text-sm text-muted-foreground">
                  {word.translations[0]?.translation}
                </p>
              </div>
              <Badge 
                variant="default"
                className={cn(
                  "transition-colors font-medium",
                  word.learning.status === LearningStatus.NEW && "bg-blue-500",
                  word.learning.status === LearningStatus.LEARNING && "bg-yellow-500",
                  word.learning.status === LearningStatus.MASTERED && "bg-green-500"
                )}
              >
                {word.learning.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-blue-500"
                onClick={() => {
                  setSelectedWord(word);
                  setIsUpdateDialogOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-red-500"
                onClick={() => handleDelete(word.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading words...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] text-destructive">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6" />
        <span>Error: {error.message}</span>
      </div>
    </div>
  );

  const activeFiltersCount = 
    filters.status.length + 
    filters.difficulty.length + 
    filters.wordTypes.length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Word Collection
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and organize your vocabulary with ease
          </p>
          {data && (
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <div>Total Words: {data.meta.totalItems}</div>
              <div>•</div>
              <div>Page {page} of {data.meta.totalPages}</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your word list using multiple criteria
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-6 pt-4">
                  {/* Learning Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Learning Status</Label>
                      {filters.status.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFilterChange('status', '', false)}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      {Object.values(LearningStatus).map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={status}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('status', status, checked as boolean)
                            }
                          />
                          <Label htmlFor={status} className="text-sm font-normal">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Difficulty */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Difficulty</Label>
                      {filters.difficulty.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFilterChange('difficulty', '', false)}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      {DIFFICULTY_LEVELS.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={filters.difficulty.includes(level)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('difficulty', level, checked as boolean)
                            }
                          />
                          <Label htmlFor={level} className="text-sm font-normal">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Word Types */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Word Types</Label>
                      {filters.wordTypes.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFilterChange('wordTypes', '', false)}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      {Object.values(WordType).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={filters.wordTypes.includes(type)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('wordTypes', type, checked as boolean)
                            }
                          />
                          <Label htmlFor={type} className="text-sm font-normal">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              {activeFiltersCount > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Added</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="learning.status">Status</SelectItem>
              <SelectItem value="learning.strength">Progress</SelectItem>
              <SelectItem value="context.difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(order => order === 'ASC' ? 'DESC' : 'ASC')}
            className="shrink-0"
          >
            {sortOrder === 'ASC' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>

          <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as ViewMode)}>
            <TabsList className="grid w-[100px] grid-cols-2">
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.status.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:text-destructive"
                onClick={() => handleFilterChange('status', status, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.difficulty.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {level}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:text-destructive"
                onClick={() => handleFilterChange('difficulty', level, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.wordTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {type}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:text-destructive"
                onClick={() => handleFilterChange('wordTypes', type, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Word Grid/List */}
      {data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No words found</h3>
          <p className="text-muted-foreground mb-4">
            {activeFiltersCount > 0
              ? "Try adjusting your filters or"
              : "Start building your vocabulary by"} adding new words
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Word
          </Button>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data?.data.map((word) => (
              <motion.div key={word.id} variants={item}>
                <WordCard
                  word={word}
                  onUpdate={() => {
                    setSelectedWord(word);
                    setIsUpdateDialogOpen(true);
                  }}
                  onDelete={() => handleDelete(word.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          renderWordsList()
        )
      )}

      {/* Pagination */}
      {data && data.data.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Dialogs */}
      <AddWordDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <UpdateWordDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        word={selectedWord}
      />
    </div>
  );
}