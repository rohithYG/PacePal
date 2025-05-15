import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ component: Component }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}