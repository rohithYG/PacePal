import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { type Habit } from '@shared/schema';
import { Checkbox } from '@/components/ui/checkbox';

interface HabitCardProps {
  habit: Habit;
  isCompleted?: boolean;
  isInProgress?: boolean;
  time?: string;
  routineName?: string;
}

export function HabitCard({ habit, isCompleted = false, isInProgress = false, time, routineName }: HabitCardProps) {
  const [checked, setChecked] = useState(isCompleted);
  const queryClient = useQueryClient();
  
  const { mutate: toggleHabit, isPending } = useMutation({
    mutationFn: async () => {
      return apiRequest('PUT', `/api/habits/${habit.id}`, {
        completed: !checked
      });
    },
    onSuccess: () => {
      setChecked(!checked);
      // Invalidate queries to refresh habit list
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habit-logs'] });
    }
  });

  const getStatusDisplay = () => {
    if (checked) return <div className="text-green-600 font-medium">Completed</div>;
    if (isInProgress) return <div className="text-primary font-medium">In progress</div>;
    return <div className="text-gray-500 font-medium">Upcoming</div>;
  };

  return (
    <div 
      className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 transition ${
        isInProgress ? 'bg-primary-foreground border-primary-200' : 'border-gray-100'
      } ${checked ? 'border-green-100 bg-green-50' : ''}`}
    >
      <div className="flex-shrink-0 mr-4">
        <Checkbox 
          checked={checked} 
          onCheckedChange={() => toggleHabit()}
          disabled={isPending}
        />
      </div>
      <div className="flex-grow">
        <h4 className={`font-medium ${checked ? 'line-through' : ''}`}>{habit.name}</h4>
        <p className="text-sm text-gray-600">
          {routineName && `${routineName}`}
        </p>
      </div>
      <div className="text-right text-sm text-gray-600">
        <span>{time}</span>
        {getStatusDisplay()}
      </div>
    </div>
  );
}
