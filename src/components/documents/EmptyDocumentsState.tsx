
import React from 'react';
import { FileText, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDocumentsStateProps {
  searchQuery: string;
  isAccountant: boolean;
  onUpload: () => void;
}

const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({
  searchQuery,
  isAccountant,
  onUpload,
}) => {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-1">No documents found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery 
          ? `No documents matching "${searchQuery}"` 
          : isAccountant
            ? "You haven't uploaded any documents yet"
            : "No documents have been shared with you yet"}
      </p>
      {isAccountant && (
        <Button onClick={onUpload}>
          <FilePlus className="h-4 w-4 mr-2" />
          Upload Your First Document
        </Button>
      )}
    </div>
  );
};

export default EmptyDocumentsState;
