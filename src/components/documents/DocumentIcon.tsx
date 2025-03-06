
import React from 'react';
import { FileText, FileSpreadsheet, File, FileImage, FileCode } from 'lucide-react';
import { Document } from '@/context/DocumentContext';

interface DocumentIconProps {
  document: Document;
  size?: number;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ document, size = 5 }) => {
  // Get the file extension from the name if type is not provided
  const fileType = document.type.toLowerCase();
  
  switch (fileType) {
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
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FileImage className={`h-${size} w-${size} text-purple-500`} />;
    case 'html':
    case 'css':
    case 'js':
    case 'json':
    case 'xml':
      return <FileCode className={`h-${size} w-${size} text-yellow-500`} />;
    default:
      return <File className={`h-${size} w-${size} text-gray-500`} />;
  }
};

export default DocumentIcon;
