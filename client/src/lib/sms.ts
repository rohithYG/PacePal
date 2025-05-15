import { apiRequest } from './queryClient';

export interface SmsNotification {
  phone: string;
  message: string;
}

export const sendTestSms = async (notification: SmsNotification): Promise<void> => {
  await apiRequest('POST', '/api/sms/test', notification);
};

// In a real implementation, this would integrate with a proper SMS provider
// Like Twilio or a similar service
export const scheduleSmsNotification = async (habitId: number, message: string, scheduledTime: Date): Promise<void> => {
  await apiRequest('POST', '/api/notifications', {
    habitId,
    message,
    scheduledTime: scheduledTime.toISOString(),
  });
};
