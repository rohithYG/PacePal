import { type Notification } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface ReminderCardProps {
  notification: Notification;
}

export function ReminderCard({ notification }: ReminderCardProps) {
  const timeString = formatDistanceToNow(new Date(notification.scheduledTime), { addSuffix: true });
  
  return (
    <div className="flex items-center p-4 border border-gray-100 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center mr-3 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{notification.message}</h4>
        <p className="text-sm text-gray-600">
          {notification.habitId ? 'Habit reminder' : 'Routine reminder'}
        </p>
      </div>
      <div className="text-right text-sm">
        <span className="text-gray-600">{timeString}</span>
      </div>
    </div>
  );
}
