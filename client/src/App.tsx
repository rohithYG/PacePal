import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <a href="/login" className="text-primary underline">Sign in</a> or{" "}
          <a href="/register" className="text-primary underline">Create an account</a>
        </p>
        <div className="mt-4">
          <p className="mb-2">Demo Navigation:</p>
          <a href="/dashboard" className="text-primary underline block mb-1">Dashboard</a>
          <a href="/habits" className="text-primary underline block mb-1">Habits</a>
          <a href="/routines" className="text-primary underline block mb-1">Routines</a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/habits" component={Habits} />
          <Route path="/routines" component={Routines} />
          <Route path="/" component={WelcomePage} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;