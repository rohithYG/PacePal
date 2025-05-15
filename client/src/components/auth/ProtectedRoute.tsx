import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated && location !== '/login') {
    setLocation('/login');
    return null;
  }

  return <>{children}</>;
}