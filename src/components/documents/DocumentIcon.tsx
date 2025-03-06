
import React from 'react';
import { FileText, FileSpreadsheet, File } from 'lucide-react';
import { Document } from '@/context/DocumentContext';

interface DocumentIconProps {
  document: Document;
  size?: number;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ document, size = 5 }) => {
  switch (document.type.toLowerCase()) {
    case 'pdf':
      return <FileText className={`h-${size} w-${size} text-red-500`} />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className={`h-${size} w-${size} text-green-500`} />;
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className={`h-${size} w-${size} text-blue-500`} />;
    default:
      return <File className={`h-${size} w-${size} text-gray-500`} />;
  }
};

export default DocumentIcon;
