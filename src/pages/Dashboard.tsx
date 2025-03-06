
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountantDashboard from '@/components/dashboard/AccountantDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import MainNav from '@/components/shared/MainNav';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MainNav />
        <div className="flex-1 container py-8 max-w-7xl">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full rounded-lg lg:col-span-2" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1">
        {user.role === 'accountant' ? (
          <AccountantDashboard />
        ) : (
          <ClientDashboard />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
