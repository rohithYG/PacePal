import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { HabitCard } from '@/components/habits/habit-card';
import { RoutineCard } from '@/components/routines/routine-card';
import { ReminderCard } from '@/components/reminders/reminder-card';
import { ProgressSummary, ProgressChart } from '@/components/habits/progress-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Calendar, CheckSquare, Clock, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [currentDate] = useState(new Date());
  const formattedDate = format(currentDate, "EEEE, MMMM d");
  
  // Get all habits for the user
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['/api/habits'],
    enabled: !!user,
  });
  
  // Get all routines for the user
  const { data: routines = [], isLoading: routinesLoading } = useQuery({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });
  
  // Get all notifications for the user
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
  });
  
  // Get habit logs for stats
  const { data: habitLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['/api/habit-logs'],
    enabled: !!user,
  });
  
  // Calculate stats
  const totalHabitsToday = habits.length;
  const completedHabitsToday = habits.filter((habit: any) => habit.completed).length;
  
  // Prepare week data for chart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = weekDays.map(day => {
    // In a real app, we would calculate actual percentages for each day from habitLogs
    const percentage = Math.floor(Math.random() * 100); // This is just for demonstration
    return { day, percentage };
  });
  
  // Group habits by routine
  const getHabitsByRoutine = (routineId: number) => {
    return habits.filter((habit: any) => habit.routineId === routineId);
  };
  
  if (habitsLoading || routinesLoading || notificationsLoading || logsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="dashboard-content">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.firstName || 'User'}!</h2>
          <p className="text-muted-foreground mt-1">Here's an overview of your habit progress</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="mr-4 text-muted-foreground">
            <span className="font-bold text-primary">Today:</span> 
            <span> {formattedDate}</span>
          </div>
          
          <Button asChild>
            <Link href="/habits/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Habit</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Today's Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ProgressSummary 
              completed={completedHabitsToday} 
              total={totalHabitsToday} 
              label="Daily Completion" 
            />
            
            {routines.slice(0, 3).map((routine: any) => {
              const routineHabits = getHabitsByRoutine(routine.id);
              const completedCount = routineHabits.filter((habit: any) => habit.completed).length;
              
              return (
                <div className="flex items-center" key={routine.id}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 
                    ${routine.type === 'morning' ? 'bg-green-100 text-green-600' : 
                      routine.type === 'work' ? 'bg-purple-100 text-purple-600' : 
                      'bg-blue-100 text-blue-600'}`}
                  >
                    <Clock className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold">{routine.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {routineHabits.length} completed
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Habit Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Habits to Complete */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Habits to Complete</CardTitle>
              <Button variant="ghost" asChild>
                <Link href="/habits">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits.length > 0 ? (
                habits.slice(0, 5).map((habit: any) => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    isCompleted={habit.completed}
                    isInProgress={!habit.completed && new Date(habit.timeOfDay).getHours() <= new Date().getHours()}
                    time={habit.timeOfDay}
                    routineName={routines.find((r: any) => r.id === habit.routineId)?.name}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any habits yet.</p>
                  <Button asChild>
                    <Link href="/habits/new">Create Your First Habit</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Habit Completion</div>
                <div className="text-sm text-muted-foreground">85%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Streak</div>
                <div className="text-sm text-muted-foreground">12 days</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
            
            <ProgressChart weekData={weekData} />
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/analytics">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Full Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Routines and Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Routines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Routines</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/routines">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {routines.length > 0 ? (
              <>
                {routines.slice(0, 3).map((routine: any) => (
                  <RoutineCard 
                    key={routine.id} 
                    routine={routine} 
                    habitCount={getHabitsByRoutine(routine.id).length}
                  />
                ))}
                
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/routines/new">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add New Routine
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't created any routines yet.</p>
                <Button asChild>
                  <Link href="/routines/new">Create Your First Routine</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming SMS Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming SMS Reminders</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/notifications">Settings</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <>
                <div className="space-y-4">
                  {notifications.slice(0, 4).map((notification: any) => (
                    <ReminderCard key={notification.id} notification={notification} />
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/settings">
                    <Clock className="mr-2 h-4 w-4" />
                    Manage SMS Notifications
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming SMS reminders.</p>
                <Button asChild>
                  <Link href="/settings">Configure Notification Settings</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
