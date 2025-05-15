import { Badge } from '@/components/ui/badge';
import { type Routine } from '@shared/schema';

interface RoutineCardProps {
  routine: Routine;
  habitCount?: number;
}

const getRoutineIcon = (type: string) => {
  switch (type) {
    case 'morning':
      return (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      );
    case 'work':
      return (
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      );
    case 'evening':
      return (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

const getRoutineColor = (type: string) => {
  switch (type) {
    case 'morning':
      return 'border-green-100 bg-green-50';
    case 'work':
      return 'border-purple-100 bg-purple-50';
    case 'evening':
      return 'border-blue-100 bg-blue-50';
    default:
      return 'border-gray-100 bg-gray-50';
  }
};

export function RoutineCard({ routine, habitCount = 0 }: RoutineCardProps) {
  const colorClass = getRoutineColor(routine.type);
  
  return (
    <div className={`mb-4 p-4 border rounded-lg ${colorClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {getRoutineIcon(routine.type)}
          <h4 className="font-bold">{routine.name}</h4>
        </div>
        <div className="text-sm text-gray-600">
          {routine.timeStart} - {routine.timeEnd}
        </div>
      </div>
      
      <div className="flex flex-wrap">
        {/* Here we would map over habits associated with this routine */}
        {habitCount > 0 ? (
          <Badge variant="outline" className="mr-2 mb-2">
            {habitCount} habits
          </Badge>
        ) : (
          <Badge variant="outline" className="mr-2 mb-2">
            No habits yet
          </Badge>
        )}
      </div>
    </div>
  );
}
