
import React from 'react';
import { Document } from '@/context/DocumentContext';
import { formatDistanceToNow } from 'date-fns';
import { Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentIcon from './DocumentIcon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DocumentsTableProps {
  documents: Document[];
  isAccountant: boolean;
  getClientName: (clientId: string) => string;
  formatFileSize: (bytes: number) => string;
  onDeleteDocument: (id: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  isAccountant,
  getClientName,
  formatFileSize,
  onDeleteDocument,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          {isAccountant && <TableHead>Client</TableHead>}
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id} className="transition-colors hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-3">
                <DocumentIcon document={doc} />
                <span className="font-medium">{doc.name}</span>
              </div>
            </TableCell>
            {isAccountant && (
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
                
                {isAccountant && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDocument(doc.id)}
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
  );
};

export default DocumentsTable;
