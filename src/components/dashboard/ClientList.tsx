
import React from 'react';
import { useClients } from '@/context/ClientContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

interface ClientListProps {
  limit?: number;
  showViewAll?: boolean;
}

const ClientList: React.FC<ClientListProps> = ({ limit, showViewAll = false }) => {
  const { clients } = useClients();
  const navigate = useNavigate();
  
  // Sort by newest first and limit if needed
  const displayClients = [...clients]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      {displayClients.length > 0 ? (
        <>
          <div className="space-y-3">
            {displayClients.map((client) => (
              <div 
                key={client.id}
                className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {showViewAll && clients.length > (limit || 0) && (
            <Button 
              variant="ghost" 
              className="w-full text-primary"
              onClick={() => navigate('/clients')}
            >
              View all clients
            </Button>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No clients yet</p>
        </div>
      )}
    </div>
  );
};

export default ClientList;
