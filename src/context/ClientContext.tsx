
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: Date;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

// Mock clients for demo purposes
const mockClients: Client[] = [
  {
    id: '2',
    name: 'Client User',
    email: 'client@example.com',
    phone: '(123) 456-7890',
    company: 'Client Company Inc.',
    createdAt: new Date('2023-01-01'),
  },
];

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if client with this email already exists
      if (clients.some(c => c.email === client.email)) {
        throw new Error('A client with this email already exists');
      }
      
      const newClient: Client = {
        ...client,
        id: (clients.length + 1).toString(),
        createdAt: new Date(),
      };
      
      setClients([...clients, newClient]);
      toast.success('Client added successfully');
    } catch (error) {
      toast.error('Failed to add client: ' + (error as Error).message);
      throw error;
    }
  };

  const updateClient = async (id: string, clientUpdate: Partial<Client>) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClients(clients.map(client => 
        client.id === id ? { ...client, ...clientUpdate } : client
      ));
      
      toast.success('Client updated successfully');
    } catch (error) {
      toast.error('Failed to update client: ' + (error as Error).message);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClients(clients.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client: ' + (error as Error).message);
      throw error;
    }
  };

  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClient }}>
      {children}
    </ClientContext.Provider>
  );
};
