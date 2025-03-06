import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments, Document } from '@/context/DocumentContext';
import { useClients } from '@/context/ClientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNav from '@/components/shared/MainNav';
import UploadDocumentDialog from '@/components/shared/UploadDocumentDialog';
import { formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  FilePlus, 
  Download, 
  Trash, 
  FileText, 
  FileSpreadsheet,
  File
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  
  React.useEffect(() => {
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

  const getDocumentIcon = (doc: Document) => {
    switch (doc.type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 container py-8 max-w-7xl animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              {user?.role === 'accountant' 
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
            {user?.role === 'accountant' && (
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

        {user?.role === 'accountant' && (
          <div className="mb-6">
            <Select 
              value={clientFilter} 
              onValueChange={setClientFilter}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    {user?.role === 'accountant' && <TableHead>Client</TableHead>}
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(doc)}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      {user?.role === 'accountant' && (
                        <TableCell>{getClientName(doc.clientId)}</TableCell>
                      )}
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          {user?.role === 'accountant' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No documents matching "${searchQuery}"` 
                    : user?.role === 'accountant'
                      ? "You haven't uploaded any documents yet"
                      : "No documents have been shared with you yet"}
                </p>
                {user?.role === 'accountant' && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setUploadDialogOpen(true);
                    }}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Upload Your First Document
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {user?.role === 'accountant' && (
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
