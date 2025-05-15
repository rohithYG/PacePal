import { ProgressRing } from '@/components/ui/progress-ring';

interface ProgressChartProps {
  weekData: {
    day: string;
    percentage: number;
  }[];
}

export function ProgressChart({ weekData }: ProgressChartProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="font-medium mb-4">Daily Completion</div>
        <div className="flex justify-between space-x-1">
          {weekData.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-1">{day.day}</div>
              <div 
                className={`w-full ${day.percentage > 0 ? 'bg-primary' : 'bg-gray-300'} rounded-t-lg`} 
                style={{ height: `${Math.max(5, day.percentage / 2)}px` }}
              ></div>
              <div className="text-xs font-medium mt-1">
                {day.percentage > 0 ? `${day.percentage}%` : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProgressSummaryProps {
  completed: number;
  total: number;
  label: string;
}

export function ProgressSummary({ completed, total, label }: ProgressSummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="flex items-center">
      <ProgressRing 
        progress={percentage} 
        size={64} 
        strokeWidth={8}
        label={<span className="text-lg font-bold">{percentage}%</span>}
      />
      <div className="ml-4">
        <h4 className="font-bold">{label}</h4>
        <p className="text-sm text-muted-foreground">
          {completed} of {total} habits completed
        </p>
      </div>
    </div>
  );
}
