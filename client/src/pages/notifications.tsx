import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ReminderCard } from '@/components/reminders/reminder-card';
import { NotificationSettings } from '@/components/reminders/notification-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Notifications() {
  const { user } = useAuth();
  
  // Get all notifications for the user
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
  });
  
  // Separate upcoming (not sent) and sent notifications
  const upcomingNotifications = notifications.filter((notification: any) => !notification.sent);
  const sentNotifications = notifications.filter((notification: any) => notification.sent);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Notifications</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <NotificationSettings />
        
        <Card>
          <CardHeader>
            <CardTitle>SMS Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">Upcoming ({upcomingNotifications.length})</TabsTrigger>
                <TabsTrigger value="sent">Sent ({sentNotifications.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingNotifications.map((notification: any) => (
                      <ReminderCard key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming notifications.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sent">
                {sentNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {sentNotifications.map((notification: any) => (
                      <ReminderCard key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No sent notifications.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
