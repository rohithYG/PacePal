import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// Simple landing page component
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
      </div>
    </div>
  );
}

// Placeholder login page
function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login Page</h1>
        <p className="mb-4">This is a placeholder for the login page</p>
        <a href="/" className="text-primary underline">Back to home</a>
      </div>
    </div>
  );
}

// Placeholder register page
function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Register Page</h1>
        <p className="mb-4">This is a placeholder for the registration page</p>
        <a href="/" className="text-primary underline">Back to home</a>
      </div>
    </div>
  );
}

// Not found page
function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-primary underline">Back to home</a>
      </div>
    </div>
  );
}

// Main app component
export default function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/" component={WelcomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}