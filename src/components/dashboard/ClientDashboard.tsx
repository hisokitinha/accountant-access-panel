
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Bell } from 'lucide-react';
import RecentDocuments from './RecentDocuments';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getClientDocuments } = useDocuments();
  
  const clientDocuments = user ? getClientDocuments(user.id) : [];
  const hasUnreadNotifications = Math.random() > 0.5; // Random for demo
  
  return (
    <div className="container py-8 max-w-7xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Welcome, {user?.name}</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              {clientDocuments.length > 0 
                ? `${Math.min(clientDocuments.length, 3)} new this month` 
                : 'No documents yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientDocuments.length > 0 
                ? new Date(
                    Math.max(
                      ...clientDocuments.map(d => d.uploadedAt.getTime())
                    )
                  ).toLocaleDateString()
                : 'No activity'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last document uploaded
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasUnreadNotifications ? 'New' : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasUnreadNotifications 
                ? 'You have unread notifications' 
                : 'No new notifications'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              Documents shared with you by your accountant
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientDocuments.length > 0 ? (
              <RecentDocuments clientId={user?.id} showViewAll />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No documents yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Your accountant hasn't shared any documents with you yet. They'll appear here when available.
                </p>
                <Button variant="outline">Refresh</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
