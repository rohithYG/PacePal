import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ProgressRing } from '@/components/ui/progress-ring';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  
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
  
  // For demo purposes, we'll generate sample data
  // In a real app, this would be calculated from habit logs
  
  // Daily completion rate data
  const completionData = [
    { name: 'Mon', completion: 80 },
    { name: 'Tue', completion: 100 },
    { name: 'Wed', completion: 90 },
    { name: 'Thu', completion: 70 },
    { name: 'Fri', completion: 85 },
    { name: 'Sat', completion: 60 },
    { name: 'Sun', completion: 75 },
  ];
  
  // Habit type distribution
  const habitTypeData = [
    { name: 'Morning', value: 30 },
    { name: 'Work', value: 40 },
    { name: 'Evening', value: 20 },
    { name: 'Custom', value: 10 },
  ];
  
  // Habit streak data
  const streakData = [
    { name: 'Exercise', currentStreak: 12, longestStreak: 21 },
    { name: 'Reading', currentStreak: 8, longestStreak: 14 },
    { name: 'Meditation', currentStreak: 5, longestStreak: 30 },
    { name: 'Journaling', currentStreak: 3, longestStreak: 7 },
  ];
  
  // Calculate overall completion rate
  const totalLogs = habitLogs.length;
  const completedLogs = habitLogs.filter((log: any) => log.completed).length;
  const overallCompletionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;
  
  // Calculate current streak
  // In a real app, this would be a more complex calculation based on consecutive days
  const currentStreak = 12; // Placeholder value
  
  if (habitsLoading || logsLoading || routinesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Habit Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your progress and understand your habits</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Tabs defaultValue="week" onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <ProgressRing 
                progress={overallCompletionRate} 
                size={60}
                label={<span className="text-lg font-bold">{overallCompletionRate}%</span>}
              />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
                <p className="text-2xl font-bold">{overallCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-foreground text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-foreground text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Habits</h3>
                <p className="text-2xl font-bold">{habits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-foreground text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Active Routines</h3>
                <p className="text-2xl font-bold">{routines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={completionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habit Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={habitTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {habitTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Habit Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={streakData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentStreak" fill="#6366f1" name="Current Streak" />
                <Bar dataKey="longestStreak" fill="#10b981" name="Longest Streak" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
