
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountantDashboard from '@/components/dashboard/AccountantDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import MainNav from '@/components/shared/MainNav';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
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
