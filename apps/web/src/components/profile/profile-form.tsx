import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { User, LanguageType, LANGUAGES } from '@vocabuddy/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';

const profileFormSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  appLanguage: z.nativeEnum(LANGUAGES),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      appLanguage: user.appLanguage as any,
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: deleteAccount } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted successfully',
      });
      window.location.href = '/login';
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select app language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(LANGUAGES).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Profile'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                deleteAccount();
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </form>
    </Form>
  );
} 