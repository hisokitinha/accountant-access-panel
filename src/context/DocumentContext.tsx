
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  clientId: string;
  url: string;
}

interface DocumentContextType {
  documents: Document[];
  uploadDocument: (file: File, clientId: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getClientDocuments: (clientId: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

// Mock documents for demo purposes
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Invoice - January 2023',
    type: 'pdf',
    size: 342000,
    uploadedAt: new Date('2023-01-15'),
    clientId: '2',
    url: '#',
  },
  {
    id: '2',
    name: 'Tax Return 2022',
    type: 'pdf',
    size: 1240000,
    uploadedAt: new Date('2023-02-10'),
    clientId: '2',
    url: '#',
  },
  {
    id: '3',
    name: 'Financial Statement Q1',
    type: 'xlsx',
    size: 654000,
    uploadedAt: new Date('2023-03-20'),
    clientId: '2',
    url: '#',
  },
];

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const { user } = useAuth();

  const uploadDocument = async (file: File, clientId: string) => {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDocument: Document = {
        id: (documents.length + 1).toString(),
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        uploadedAt: new Date(),
        clientId,
        url: URL.createObjectURL(file), // In real app, this would be an actual URL
      };
      
      setDocuments([...documents, newDocument]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Upload failed: ' + (error as Error).message);
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Deletion failed: ' + (error as Error).message);
      throw error;
    }
  };

  const getClientDocuments = (clientId: string) => {
    return documents.filter(doc => doc.clientId === clientId);
  };

  return (
    <DocumentContext.Provider value={{ documents, uploadDocument, deleteDocument, getClientDocuments }}>
      {children}
    </DocumentContext.Provider>
  );
};
