import { useState } from 'react';
import { Language, ProficiencyLevel } from '@vocabuddy/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const editLanguageSchema = z.object({
  proficiency: z.nativeEnum(ProficiencyLevel),
});

type EditLanguageData = z.infer<typeof editLanguageSchema>;

interface EditLanguageDialogProps {
  language: Language | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLanguageDialog({
  language,
  open,
  onOpenChange,
}: EditLanguageDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditLanguageData>({
    resolver: zodResolver(editLanguageSchema),
    defaultValues: {
      proficiency: language?.proficiency || ProficiencyLevel.A1,
    },
  });

  const onSubmit = async (data: EditLanguageData) => {
    if (!language) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/languages/${language.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update language');
      }

      onOpenChange(false);
      // Refresh the session to get updated user data
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProficiencySelect = (level: ProficiencyLevel) => {
    setValue('proficiency', level);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language?.name ? `Edit ${language.name}` : 'Add New Language'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <p className="text-sm font-medium">{error}</p>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label>Proficiency Level</Label>
              <Select
                defaultValue={language?.proficiency || ProficiencyLevel.A1}
                onValueChange={handleProficiencySelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProficiencyLevel).map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {language ? 'Save Changes' : 'Add Language'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 