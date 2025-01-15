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
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";

const languageSchema = z.object({
  code: z.string().min(2, 'Language code is required'),
  name: z.string().min(2, 'Language name is required'),
  proficiency: z.nativeEnum(ProficiencyLevel),
  native: z.boolean().default(false),
});

type LanguageFormData = z.infer<typeof languageSchema>;

interface LanguageSettingsDialogProps {
  languages: Language[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'tr', name: 'Turkish' },
];

export function LanguageSettingsDialog({
  languages,
  open,
  onOpenChange,
}: LanguageSettingsDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const { toast } = useToast();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
  });

  const onSubmit = async (data: LanguageFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/languages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          native: isNative,
          proficiency: isNative ? ProficiencyLevel.C2 : data.proficiency,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add language');
      }

      toast({
        title: "Success",
        description: "Language added successfully",
      });
      onOpenChange(false);
      // Refresh the session to get updated user data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add language",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (code: string) => {
    const language = availableLanguages.find(lang => lang.code === code);
    if (language) {
      setValue('code', language.code);
      setValue('name', language.name);
    }
  };

  const handleProficiencySelect = (level: ProficiencyLevel) => {
    setValue('proficiency', level);
  };

  const handleNativeToggle = (checked: boolean) => {
    setIsNative(checked);
    if (checked) {
      setValue('proficiency', ProficiencyLevel.C2);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Language</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <p className="text-sm font-medium">{error}</p>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label>Language</Label>
              <Select onValueChange={handleLanguageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages
                    .filter(lang => !languages.some(l => l.code === lang.code))
                    .map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="native" className="cursor-pointer">Native Language</Label>
              <Switch
                id="native"
                checked={isNative}
                onCheckedChange={handleNativeToggle}
              />
            </div>
            {!isNative && (
              <div className="grid gap-2">
                <Label>Proficiency Level</Label>
                <Select onValueChange={handleProficiencySelect}>
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
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Language
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 