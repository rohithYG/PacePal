
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  relatedId: number;
  status: string;
  scheduledFor: string;
  createdAt: string;
}

interface ReminderCardProps {
  notification: Notification;
}

export function ReminderCard({ notification }: ReminderCardProps) {
  const getTimeString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {getTimeString(notification.scheduledFor)}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {notification.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
