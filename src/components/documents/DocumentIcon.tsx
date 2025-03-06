
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
  
  // Define icon styles with fixed sizes
  const iconStyle = { 
    width: `${size * 4}px`, 
    height: `${size * 4}px` 
  };
  
  switch (fileType) {
    case 'pdf':
      return <FileText style={iconStyle} className="text-red-500" />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet style={iconStyle} className="text-green-500" />;
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText style={iconStyle} className="text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FileImage style={iconStyle} className="text-purple-500" />;
    case 'html':
    case 'css':
    case 'js':
    case 'json':
    case 'xml':
      return <FileCode style={iconStyle} className="text-yellow-500" />;
    default:
      return <File style={iconStyle} className="text-gray-500" />;
  }
};

export default DocumentIcon;
