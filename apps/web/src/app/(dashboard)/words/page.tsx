'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Word } from '@vocabuddy/types';
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
import { 
  Plus, 
  Search, 
  SortAsc, 
  SortDesc, 
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface WordsResponse {
  data: Word[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export default function WordsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<WordsResponse>({
    queryKey: ['words', page, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        sortBy,
        sortOrder,
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

      // Invalidate and refetch words query
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
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Added</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="learning.status">Status</SelectItem>
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
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>
      </div>

      {/* Word Grid */}
      {data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No words found</h3>
          <p className="text-muted-foreground mb-4">
            Start building your vocabulary by adding new words
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