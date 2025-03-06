
import React, { useState } from 'react';
import { useClients } from '@/context/ClientContext';
import { useDocuments } from '@/context/DocumentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FilePlus, FileText, User } from 'lucide-react';
import AddClientDialog from '@/components/shared/AddClientDialog';
import UploadDocumentDialog from '@/components/shared/UploadDocumentDialog';
import ClientList from './ClientList';
import RecentDocuments from './RecentDocuments';

const AccountantDashboard: React.FC = () => {
  const { clients } = useClients();
  const { documents } = useDocuments();
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [uploadDocumentDialogOpen, setUploadDocumentDialogOpen] = useState(false);

  return (
    <div className="container py-8 max-w-7xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 5)} new this month
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
              +{Math.floor(Math.random() * 10)} uploaded this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Add Client</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => setAddClientDialogOpen(true)}
            >
              Add New Client
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upload Document</CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setUploadDocumentDialogOpen(true)}
            >
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>
                You have {clients.length} total clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientList limit={5} showViewAll />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Recently uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDocuments limit={5} showViewAll />
            </CardContent>
          </Card>
        </div>
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
