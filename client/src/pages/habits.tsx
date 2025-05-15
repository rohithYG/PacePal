import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { HabitCard } from '@/components/habits/habit-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Search } from 'lucide-react';

export default function Habits() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all habits for the user
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['/api/habits'],
    enabled: !!user,
  });
  
  // Get all routines for the user (for routine names)
  const { data: routines = [] } = useQuery({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });
  
  // Filter habits by search query
  const filteredHabits = habits.filter((habit: any) => 
    habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get active habits (not completed)
  const activeHabits = filteredHabits.filter((habit: any) => !habit.completed);
  
  // Get completed habits
  const completedHabits = filteredHabits.filter((habit: any) => habit.completed);
  
  // Get routine name by id
  const getRoutineName = (routineId: number) => {
    const routine = routines.find((r: any) => r.id === routineId);
    return routine ? routine.name : 'No Routine';
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Habits</h1>
          <p className="text-muted-foreground mt-1">Track and manage your daily habits</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search habits..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button asChild>
            <Link href="/habits/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Habit
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active ({activeHabits.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedHabits.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              <CardContent className="space-y-4 pt-2">
                {activeHabits.length > 0 ? (
                  activeHabits.map((habit: any) => (
                    <HabitCard 
                      key={habit.id} 
                      habit={habit} 
                      isCompleted={false}
                      isInProgress={new Date(habit.timeOfDay).getHours() <= new Date().getHours()}
                      time={habit.timeOfDay}
                      routineName={getRoutineName(habit.routineId)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active habits found.</p>
                    {searchQuery ? (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
                    ) : (
                      <Button asChild>
                        <Link href="/habits/new">Create a Habit</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <CardContent className="space-y-4 pt-2">
                {completedHabits.length > 0 ? (
                  completedHabits.map((habit: any) => (
                    <HabitCard 
                      key={habit.id} 
                      habit={habit} 
                      isCompleted={true}
                      time={habit.timeOfDay}
                      routineName={getRoutineName(habit.routineId)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No completed habits found.</p>
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
