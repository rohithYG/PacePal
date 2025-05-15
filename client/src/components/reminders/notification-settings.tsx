import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sendTestSms } from '@/lib/sms';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const settingsSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  notificationsEnabled: z.boolean(),
});

type NotificationSettingsValues = z.infer<typeof settingsSchema>;

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testSending, setTestSending] = useState(false);

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      phone: user?.phone || '',
      notificationsEnabled: user?.notificationsEnabled !== false,
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: NotificationSettingsValues) => {
      if (!user) throw new Error('You must be logged in');
      
      return apiRequest('PUT', `/api/users/${user.id}`, {
        phone: data.phone,
        notificationsEnabled: data.notificationsEnabled,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Settings updated',
        description: 'Your notification settings have been updated',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: () => {
      toast({
        title: 'Failed to update settings',
        description: 'There was an error updating your settings',
        variant: 'destructive',
      });
    },
  });

  const handleSendTest = async () => {
    if (!user) return;
    
    setTestSending(true);
    try {
      await sendTestSms({
        phone: form.getValues('phone'),
        message: 'This is a test message from PacePal!',
      });
      
      toast({
        title: 'Test message sent',
        description: 'A test SMS has been sent to your phone number',
      });
    } catch (error) {
      toast({
        title: 'Failed to send test',
        description: 'There was an error sending the test message',
        variant: 'destructive',
      });
    } finally {
      setTestSending(false);
    }
  };

  const onSubmit = (data: NotificationSettingsValues) => {
    updateSettings.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive SMS notifications for your habits and routines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(123) 456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We'll send habit and routine reminders to this number
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notificationsEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SMS Notifications</FormLabel>
                    <FormDescription>
                      Enable or disable all SMS notifications
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
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                type="button" 
                variant="outline" 
                disabled={testSending}
                onClick={handleSendTest}
              >
                {testSending ? 'Sending...' : 'Send Test Message'}
              </Button>
              
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
