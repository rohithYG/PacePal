import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';

export default function Calendar() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Get all habits for the user
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['/api/habits'],
    enabled: !!user,
  });
  
  // Get all habit logs for the user
  const { data: habitLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['/api/habit-logs'],
    enabled: !!user,
  });
  
  // Get all routines for the user
  const { data: routines = [], isLoading: routinesLoading } = useQuery({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });
  
  // Get habits for selected date
  const getHabitsForDate = (date: Date) => {
    if (!date) return [];
    
    // In a real implementation, we would filter habits based on frequency
    // and check habit logs to see if they've been completed
    return habits.filter((habit: any) => {
      // Convert frequency array to lowercase day names
      const frequency = habit.frequency;
      const dayName = format(date, 'EEEE').toLowerCase();
      
      // Check if the habit is scheduled for this day of the week
      return frequency.includes(dayName);
    });
  };
  
  // Get logs for selected date
  const getLogsForDate = (date: Date) => {
    if (!date) return [];
    
    return habitLogs.filter((log: any) => {
      return isSameDay(new Date(log.date), date);
    });
  };
  
  // Get habit completion status for a specific date
  const getCompletionStatus = (habitId: number, date: Date) => {
    const logs = getLogsForDate(date);
    const habitLog = logs.find((log: any) => log.habitId === habitId);
    return habitLog ? habitLog.completed : false;
  };
  
  // Get routines for a specific day
  const getRoutinesForDay = (dayName: string) => {
    // In a real app we might have specific days for routines
    // For this demo, we'll just return all routines
    return routines;
  };
  
  // Get selected date's habit data
  const selectedDateHabits = date ? getHabitsForDate(date) : [];
  const selectedDayName = date ? format(date, 'EEEE') : '';
  const selectedRoutines = date ? getRoutinesForDay(selectedDayName.toLowerCase()) : [];
  
  // Create dates for calendar highlighting
  const habitDates = habits.flatMap((habit: any) => {
    // For each habit, create a highlighted date for each day in its frequency
    // In a real app, this would be more sophisticated with actual dates
    return [];
  });
  
  if (habitsLoading || logsLoading || routinesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Habit Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Habits for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateHabits.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateHabits.map((habit: any) => (
                    <div key={habit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="text-sm text-muted-foreground">{habit.timeOfDay}</p>
                      </div>
                      <div>
                        {date && date <= new Date() ? (
                          <Badge variant={getCompletionStatus(habit.id, date) ? "success" : "secondary"}>
                            {getCompletionStatus(habit.id, date) ? "Completed" : "Pending"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No habits scheduled for this date.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Routines for {selectedDayName}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRoutines.length > 0 ? (
                <div className="space-y-4">
                  {selectedRoutines.map((routine: any) => (
                    <div key={routine.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {routine.timeStart} - {routine.timeEnd}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">{routine.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No routines for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
