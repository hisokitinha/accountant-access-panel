
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Clock, Bell, Download, Calendar, Eye } from 'lucide-react';
import RecentDocuments from './RecentDocuments';
import { formatDistanceToNow } from 'date-fns';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getClientDocuments } = useDocuments();
  
  const clientDocuments = user ? getClientDocuments(user.id) : [];
  const hasUnreadNotifications = Math.random() > 0.5; // Random for demo
  
  // Get the most recent document
  const mostRecentDocument = clientDocuments.length > 0 
    ? clientDocuments.reduce((latest, current) => 
        latest.uploadedAt > current.uploadedAt ? latest : current, clientDocuments[0])
    : null;

  // Get documents by type counts
  const documentTypeCounts = clientDocuments.reduce((counts, doc) => {
    const type = doc.type.toLowerCase();
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="container py-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your documents today
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostRecentDocument 
                ? formatDistanceToNow(mostRecentDocument.uploadedAt, { addSuffix: true })
                : 'No activity'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostRecentDocument 
                ? `Last document: ${mostRecentDocument.name.substring(0, 20)}${mostRecentDocument.name.length > 20 ? '...' : ''}`
                : 'No recent documents'}
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
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">{user?.email}</div>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role} Account
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Documents shared with you by your accountant
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientDocuments.length > 0 ? (
              <RecentDocuments clientId={user?.id} showViewAll limit={5} />
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

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Document Overview</CardTitle>
            <CardDescription>
              Document types breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(documentTypeCounts).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(documentTypeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
                      {type === 'xlsx' && <FileText className="h-4 w-4 text-green-500" />}
                      {type === 'docx' && <FileText className="h-4 w-4 text-blue-500" />}
                      {!['pdf', 'xlsx', 'docx'].includes(type) && <FileText className="h-4 w-4 text-gray-500" />}
                      <span className="text-sm font-medium capitalize">{type} files</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-between">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>View All</span>
                  </Button>
                  
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download All</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No document statistics available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
