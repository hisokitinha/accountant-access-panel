
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useClients } from '@/context/ClientContext';
import { useDocuments } from '@/context/DocumentContext';
import MainNav from '@/components/shared/MainNav';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  FileText,
  Upload,
  Edit,
  Trash
} from 'lucide-react';
import DocumentsTable from '@/components/documents/DocumentsTable';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getClient, deleteClient } = useClients();
  const { documents, deleteDocument } = useDocuments();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect if not an accountant
  useEffect(() => {
    if (user && user.role !== 'accountant') {
      navigate('/dashboard');
      toast.error('Você não tem permissão para acessar esta página');
    }
  }, [user, navigate]);
  
  const client = getClient(id || '');
  
  // Redirect if client not found
  useEffect(() => {
    if (!client && user?.role === 'accountant') {
      navigate('/clients');
      toast.error('Cliente não encontrado');
    }
  }, [client, navigate, user]);
  
  if (!client) {
    return null; // Will redirect
  }
  
  const clientDocuments = documents.filter(doc => doc.clientId === client.id);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const handleDeleteClient = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      await deleteClient(client.id);
      navigate('/clients');
    }
  };
  
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 container py-8 max-w-7xl animate-fade-in">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Clientes
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <p className="text-muted-foreground">
                Cliente desde {formatDate(client.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/documents?clientId=${client.id}`)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Enviar Documento
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/clients/${client.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteClient}
            >
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                  <CardDescription>
                    Detalhes de contato e informações da empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">
                        {client.phone || 'Não informado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Empresa</p>
                      <p className="text-sm text-muted-foreground">
                        {client.company || 'Não informado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data de Cadastro</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(client.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Documentos</CardTitle>
                  <CardDescription>
                    {clientDocuments.length} documentos compartilhados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientDocuments.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-medium">Documentos Recentes</span>
                        </div>
                        <span className="text-sm">{clientDocuments.length}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {clientDocuments.slice(0, 3).map(doc => (
                          <div key={doc.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate">{doc.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(doc.uploadedAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab('documents')}
                      >
                        Ver Todos os Documentos
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Sem documentos</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mb-4">
                        Este cliente ainda não possui documentos compartilhados.
                      </p>
                      <Button
                        onClick={() => navigate(`/documents?clientId=${client.id}`)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Primeiro Documento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Documentos do Cliente</CardTitle>
                <CardDescription>
                  Todos os documentos compartilhados com {client.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientDocuments.length > 0 ? (
                  <DocumentsTable 
                    documents={clientDocuments}
                    isAccountant={true}
                    getClientName={() => client.name}
                    formatFileSize={formatFileSize}
                    onDeleteDocument={handleDeleteDocument}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Sem documentos</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                      Este cliente ainda não possui documentos compartilhados.
                    </p>
                    <Button
                      onClick={() => navigate(`/documents?clientId=${client.id}`)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Primeiro Documento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientDetails;
