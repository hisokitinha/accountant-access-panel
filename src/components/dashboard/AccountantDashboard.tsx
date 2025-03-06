
import React, { useState } from 'react';
import { useClients } from '@/context/ClientContext';
import { useDocuments } from '@/context/DocumentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FilePlus, FileText, User, Calendar, Clock, Settings, ArrowRight } from 'lucide-react';
import AddClientDialog from '@/components/shared/AddClientDialog';
import UploadDocumentDialog from '@/components/shared/UploadDocumentDialog';
import ClientList from './ClientList';
import RecentDocuments from './RecentDocuments';
import { formatDistanceToNow } from 'date-fns';

const AccountantDashboard: React.FC = () => {
  const { clients } = useClients();
  const { documents } = useDocuments();
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [uploadDocumentDialogOpen, setUploadDocumentDialogOpen] = useState(false);

  // Calculate recent activity metrics
  const recentClients = [...clients].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 3);
  const recentDocuments = [...documents].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 3);
  
  // Calculate document stats
  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.type.toLowerCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the most recent document
  const mostRecentDocument = documents.length > 0 
    ? documents.reduce((latest, current) => 
        latest.uploadedAt > current.uploadedAt ? latest : current, documents[0])
    : null;

  // Get documents by client counts
  const documentsByClient = documents.reduce((acc, doc) => {
    acc[doc.clientId] = (acc[doc.clientId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Client with most documents
  const clientWithMostDocs = Object.entries(documentsByClient).length > 0 
    ? Object.entries(documentsByClient).reduce((max, current) => 
        current[1] > max[1] ? current : max, ['', 0])
    : ['', 0];

  const topClient = clients.find(c => c.id === clientWithMostDocs[0]);

  return (
    <div className="container py-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your clients and documents
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setUploadDocumentDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FilePlus className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentClients.length > 0 
                ? `+${recentClients.length} new this month` 
                : 'No new clients'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentDocuments.length > 0 
                ? `+${recentDocuments.length} uploaded this month` 
                : 'No documents'}
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
              {mostRecentDocument 
                ? formatDistanceToNow(mostRecentDocument.uploadedAt, { addSuffix: true })
                : 'No activity'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostRecentDocument 
                ? `Last upload: ${mostRecentDocument.name.substring(0, 15)}${mostRecentDocument.name.length > 15 ? '...' : ''}`
                : 'No documents uploaded yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Client</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {topClient ? topClient.name : 'No clients'}
            </div>
            <p className="text-xs text-muted-foreground">
              {topClient ? `${clientWithMostDocs[1]} documents` : 'No documents yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7 mb-8">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>
                You have {clients.length} total clients
              </CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setAddClientDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ClientList limit={5} />
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="ghost" className="w-full text-primary" onClick={() => {}}>
              <span>View all clients</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Recently uploaded documents
              </CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setUploadDocumentDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <FilePlus className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentDocuments limit={4} />
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="ghost" className="w-full text-primary" onClick={() => {}}>
              <span>View all documents</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
            <CardDescription>
              Breakdown by file format
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(documentsByType).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(documentsByType).map(([type, count]) => (
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
        
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => setAddClientDialogOpen(true)}
              >
                <User className="h-6 w-6" />
                <span>Add Client</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => setUploadDocumentDialogOpen(true)}
              >
                <FilePlus className="h-6 w-6" />
                <span>Upload Document</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Clients</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddClientDialog 
        open={addClientDialogOpen} 
        onOpenChange={setAddClientDialogOpen} 
      />
      
      <UploadDocumentDialog 
        open={uploadDocumentDialogOpen} 
        onOpenChange={setUploadDocumentDialogOpen}
        clients={clients}
      />
    </div>
  );
};

export default AccountantDashboard;
