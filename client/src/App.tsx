import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "wouter";

// Auth components
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Habits from "@/pages/habits";
import Routines from "@/pages/routines";

function WelcomePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">PacePal</h1>
        <p className="mb-6">Personal Habit & Routine Builder</p>
        <p>
          <Link href="/login" className="text-primary underline">Sign in</Link> or{" "}
          <Link href="/register" className="text-primary underline">Create an account</Link>
        </p>
        <div className="mt-4">
          <p className="mb-2">Demo Navigation:</p>
          <Link href="/dashboard" className="text-primary underline block mb-1">Dashboard</Link>
          <Link href="/habits" className="text-primary underline block mb-1">Habits</Link>
          <Link href="/routines" className="text-primary underline block mb-1">Routines</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/habits">
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            </Route>
            <Route path="/routines">
              <ProtectedRoute>
                <Routines />
              </ProtectedRoute>
            </Route>
            <Route path="/" component={WelcomePage} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;