
import React from 'react';
import { useDocuments, Document } from '@/context/DocumentContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { File, FileSpreadsheet, FileText, Download } from 'lucide-react';

interface RecentDocumentsProps {
  limit?: number;
  showViewAll?: boolean;
  clientId?: string;
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ 
  limit, 
  showViewAll = false,
  clientId,
}) => {
  const { documents } = useDocuments();
  const navigate = useNavigate();
  
  // Filter by client if specified, then sort by newest first and limit
  const filteredDocuments = clientId 
    ? documents.filter(doc => doc.clientId === clientId)
    : documents;
    
  const displayDocuments = [...filteredDocuments]
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(0, limit);

  const getDocumentIcon = (doc: Document) => {
    switch (doc.type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {displayDocuments.length > 0 ? (
        <>
          <div className="space-y-3">
            {displayDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc)}
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {showViewAll && filteredDocuments.length > (limit || 0) && (
            <Button 
              variant="ghost" 
              className="w-full text-primary"
              onClick={() => navigate('/documents')}
            >
              View all documents
            </Button>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No documents yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentDocuments;
