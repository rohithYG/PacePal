import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const habitSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  routineId: z.string().optional(),
  timeOfDay: z.string().min(1, 'Time of day is required'),
  frequency: z.array(z.string()).min(1, 'Select at least one day'),
  reminderEnabled: z.boolean().default(true),
});

type HabitFormValues = z.infer<typeof habitSchema>;

export function HabitForm() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch routines for dropdown
  const { data: routines } = useQuery({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      description: '',
      routineId: '',
      timeOfDay: '',
      frequency: ['monday', 'wednesday', 'friday'],
      reminderEnabled: true,
    },
  });

  const createHabit = useMutation({
    mutationFn: async (data: HabitFormValues) => {
      if (!user) throw new Error('You must be logged in');
      
      // Convert routineId to number or null
      const routineId = data.routineId ? parseInt(data.routineId) : null;
      
      return apiRequest('POST', '/api/habits', {
        userId: user.id,
        name: data.name,
        description: data.description || '',
        routineId,
        timeOfDay: data.timeOfDay,
        startDate: new Date().toISOString(),
        frequency: data.frequency,
        reminderEnabled: data.reminderEnabled,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Habit created',
        description: 'Your new habit has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      setLocation('/habits');
    },
    onError: () => {
      toast({
        title: 'Failed to create habit',
        description: 'There was an error creating your habit',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: HabitFormValues) => {
    setIsLoading(true);
    createHabit.mutate(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Habit</h1>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Morning Meditation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your habit..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="routineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routine</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a routine (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {routines?.map((routine: any) => (
                        <SelectItem key={routine.id} value={routine.id.toString()}>
                          {routine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Associate this habit with a routine
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    When do you want to perform this habit?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={() => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.value}
                          checked={form.watch('frequency').includes(day.value)}
                          onCheckedChange={(checked) => {
                            const currentValues = form.watch('frequency');
                            const updatedValues = checked
                              ? [...currentValues, day.value]
                              : currentValues.filter((value) => value !== day.value);
                            form.setValue('frequency', updatedValues, { shouldValidate: true });
                          }}
                        />
                        <label
                          htmlFor={day.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select the days of the week for this habit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reminderEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SMS Reminders</FormLabel>
                    <FormDescription>
                      Receive text message reminders for this habit
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setLocation('/habits')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || createHabit.isPending}>
                {(isLoading || createHabit.isPending) ? 'Creating...' : 'Create Habit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
