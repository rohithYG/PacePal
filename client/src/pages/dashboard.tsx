import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { HabitCard } from '@/components/habits/habit-card';
import { RoutineCard } from '@/components/routines/routine-card';
import { ReminderCard } from '@/components/reminders/reminder-card';
import { ProgressSummary, ProgressChart } from '@/components/habits/progress-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Calendar, CheckSquare, Clock, BarChart2 } from 'lucide-react';

// Mock data for demonstration
const mockUser = {
  id: 1,
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@example.com'
};

const mockWeekData = [
  { day: 'Mon', percentage: 90 },
  { day: 'Tue', percentage: 80 },
  { day: 'Wed', percentage: 95 },
  { day: 'Thu', percentage: 70 },
  { day: 'Fri', percentage: 65 },
  { day: 'Sat', percentage: 50 },
  { day: 'Sun', percentage: 85 },
];

export default function Dashboard() {
  const [completedToday, setCompletedToday] = useState(3);
  const [totalToday, setTotalToday] = useState(5);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {mockUser.firstName}!</h1>
          <p className="text-muted-foreground">Today is {format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link href="/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/habits">
              <CheckSquare className="mr-2 h-4 w-4" />
              Habits
            </Link>
          </Button>
          <Button asChild>
            <Link href="/habits?new=true">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Habit
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressSummary 
              completed={completedToday} 
              total={totalToday} 
              label="habits completed today" 
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart weekData={mockWeekData} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CheckSquare className="mr-2 h-5 w-5" />
            Today's Habits
          </h2>
          
          <div className="space-y-4">
            <HabitCard 
              habit={{
                id: 1,
                name: "Morning Meditation",
                description: "10 minutes of mindfulness",
                frequency: "daily",
                userId: 1,
                timeOfDay: "morning",
                routineId: 1
              }}
              isCompleted={true}
              time="8:00 AM"
              routineName="Morning Routine"
            />
            
            <HabitCard 
              habit={{
                id: 2,
                name: "Drink Water",
                description: "At least 8 glasses throughout the day",
                frequency: "daily",
                userId: 1,
                timeOfDay: "all-day",
                routineId: null
              }}
              isInProgress={true}
              time="All day"
            />
            
            <HabitCard 
              habit={{
                id: 3,
                name: "Evening Walk",
                description: "30 minute walk around the neighborhood",
                frequency: "daily",
                userId: 1,
                timeOfDay: "evening",
                routineId: 2
              }}
              time="7:00 PM"
              routineName="Evening Routine"
            />
            
            <div className="text-center mt-4">
              <Button variant="ghost" asChild>
                <Link href="/habits">View all habits</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Your Routines
            </h2>
            
            <div className="space-y-4">
              <RoutineCard
                routine={{
                  id: 1,
                  name: "Morning Routine",
                  description: "Start the day right",
                  userId: 1,
                  timeOfDay: "morning"
                }}
                habitCount={3}
              />
              
              <RoutineCard
                routine={{
                  id: 2,
                  name: "Evening Routine",
                  description: "Wind down and prepare for sleep",
                  userId: 1,
                  timeOfDay: "evening"
                }}
                habitCount={4}
              />
              
              <div className="text-center mt-4">
                <Button variant="ghost" asChild>
                  <Link href="/routines">View all routines</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Reminders
            </h2>
            
            <div className="space-y-4">
              <ReminderCard
                notification={{
                  id: 1,
                  userId: 1,
                  type: "reminder",
                  message: "Don't forget your evening meditation",
                  relatedId: 3,
                  status: "pending",
                  scheduledFor: new Date().toISOString(),
                  createdAt: new Date().toISOString()
                }}
              />
              
              <div className="text-center mt-4">
                <Button variant="ghost" asChild>
                  <Link href="/notifications">View all reminders</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}