
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { useClients } from '@/context/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNav from '@/components/shared/MainNav';
import UploadDocumentDialog from '@/components/shared/UploadDocumentDialog';
import { Search, FilePlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DocumentsTable from '@/components/documents/DocumentsTable';
import EmptyDocumentsState from '@/components/documents/EmptyDocumentsState';
import DocumentsFilter from '@/components/documents/DocumentsFilter';

const Documents = () => {
  const { user } = useAuth();
  const { documents, deleteDocument } = useDocuments();
  const { clients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromQuery = queryParams.get('clientId');
  
  useEffect(() => {
    if (clientIdFromQuery) {
      setClientFilter(clientIdFromQuery);
      setUploadDialogOpen(true);
    }
  }, [clientIdFromQuery]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = clientFilter === 'all' || doc.clientId === clientFilter;
    
    if (user?.role === 'client') {
      return matchesSearch && doc.clientId === user.id;
    }
    
    return matchesSearch && matchesClient;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  const isAccountant = user?.role === 'accountant';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 container py-8 max-w-7xl animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              {isAccountant 
                ? 'Manage and share documents with your clients' 
                : 'View documents shared with you'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isAccountant && (
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                className="whitespace-nowrap"
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        </div>

        {isAccountant && (
          <DocumentsFilter 
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            clients={clients}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {clientFilter !== 'all'
                ? `Documents for ${getClientName(clientFilter)}`
                : 'All Documents'}
            </CardTitle>
            <CardDescription>
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length > 0 ? (
              <DocumentsTable 
                documents={filteredDocuments}
                isAccountant={isAccountant}
                getClientName={getClientName}
                formatFileSize={formatFileSize}
                onDeleteDocument={handleDeleteDocument}
              />
            ) : (
              <EmptyDocumentsState 
                searchQuery={searchQuery}
                isAccountant={isAccountant}
                onUpload={() => {
                  setSearchQuery('');
                  setUploadDialogOpen(true);
                }}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {isAccountant && (
        <UploadDocumentDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen}
          clients={clients}
          clientId={clientFilter !== 'all' ? clientFilter : undefined}
        />
      )}
    </div>
  );
};

export default Documents;
