import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const routineSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  timeStart: z.string().min(1, 'Start time is required'),
  timeEnd: z.string().min(1, 'End time is required'),
}).refine(data => data.timeStart < data.timeEnd, {
  message: "End time must be after start time",
  path: ['timeEnd'],
});

type RoutineFormValues = z.infer<typeof routineSchema>;

export function RoutineForm() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'custom',
      timeStart: '',
      timeEnd: '',
    },
  });

  const createRoutine = useMutation({
    mutationFn: async (data: RoutineFormValues) => {
      if (!user) throw new Error('You must be logged in');
      
      return apiRequest('POST', '/api/routines', {
        userId: user.id,
        name: data.name,
        description: data.description || '',
        type: data.type,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Routine created',
        description: 'Your new routine has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      setLocation('/routines');
    },
    onError: () => {
      toast({
        title: 'Failed to create routine',
        description: 'There was an error creating your routine',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RoutineFormValues) => {
    setIsLoading(true);
    createRoutine.mutate(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Routine</h1>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routine Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Morning Routine"
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
                      placeholder="Describe your routine..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routine Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a routine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorize your routine
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setLocation('/routines')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || createRoutine.isPending}>
                {(isLoading || createRoutine.isPending) ? 'Creating...' : 'Create Routine'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
