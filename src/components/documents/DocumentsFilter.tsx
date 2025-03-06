
import React from 'react';
import { Client } from '@/context/ClientContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentsFilterProps {
  clientFilter: string;
  setClientFilter: (value: string) => void;
  clients: Client[];
}

const DocumentsFilter: React.FC<DocumentsFilterProps> = ({ 
  clientFilter, 
  setClientFilter, 
  clients 
}) => {
  return (
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
  );
};

export default DocumentsFilter;
