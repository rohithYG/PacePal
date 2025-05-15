import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { RoutineCard } from '@/components/routines/routine-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Search } from 'lucide-react';

export default function Routines() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all routines for the user
  const { data: routines = [], isLoading: routinesLoading } = useQuery({
    queryKey: ['/api/routines'],
    enabled: !!user,
  });
  
  // Get all habits for the user to count habits per routine
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['/api/habits'],
    enabled: !!user,
  });
  
  // Filter routines by search query
  const filteredRoutines = routines.filter((routine: any) => 
    routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (routine.description && routine.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Count habits for each routine
  const getHabitCount = (routineId: number) => {
    return habits.filter((habit: any) => habit.routineId === routineId).length;
  };
  
  // Group routines by type
  const morningRoutines = filteredRoutines.filter((routine: any) => routine.type === 'morning');
  const workRoutines = filteredRoutines.filter((routine: any) => routine.type === 'work');
  const eveningRoutines = filteredRoutines.filter((routine: any) => routine.type === 'evening');
  const customRoutines = filteredRoutines.filter((routine: any) => routine.type === 'custom');
  
  if (routinesLoading || habitsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Routines</h1>
          <p className="text-muted-foreground mt-1">Create and manage your daily routines</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search routines..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button asChild>
            <Link href="/routines/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Routine
            </Link>
          </Button>
        </div>
      </div>
      
      {filteredRoutines.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {morningRoutines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Morning Routines</CardTitle>
              </CardHeader>
              <CardContent>
                {morningRoutines.map((routine: any) => (
                  <RoutineCard 
                    key={routine.id} 
                    routine={routine} 
                    habitCount={getHabitCount(routine.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}
          
          {workRoutines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Work Routines</CardTitle>
              </CardHeader>
              <CardContent>
                {workRoutines.map((routine: any) => (
                  <RoutineCard 
                    key={routine.id} 
                    routine={routine} 
                    habitCount={getHabitCount(routine.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}
          
          {eveningRoutines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Evening Routines</CardTitle>
              </CardHeader>
              <CardContent>
                {eveningRoutines.map((routine: any) => (
                  <RoutineCard 
                    key={routine.id} 
                    routine={routine} 
                    habitCount={getHabitCount(routine.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}
          
          {customRoutines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Routines</CardTitle>
              </CardHeader>
              <CardContent>
                {customRoutines.map((routine: any) => (
                  <RoutineCard 
                    key={routine.id} 
                    routine={routine} 
                    habitCount={getHabitCount(routine.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No Routines Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "No routines match your search criteria." 
                : "You haven't created any routines yet."}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
            ) : (
              <Button asChild>
                <Link href="/routines/new">Create Your First Routine</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-6 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/routines/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Routine
          </Link>
        </Button>
      </div>
    </div>
  );
}
