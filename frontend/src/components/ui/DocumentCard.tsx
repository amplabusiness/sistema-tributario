import React from 'react';

interface DocumentCardProps {
  fileName: string;
  fileType: string;
  status: string;
  processedAt: string;
  onClick?: () => void;
}

export default function DocumentCard({ fileName, fileType, status, processedAt, onClick }: DocumentCardProps) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer bg-white" onClick={onClick}>
      <div className="font-bold text-blue-700 mb-1">{fileName}</div>
      <div className="text-xs text-gray-500 mb-2">{fileType} • {new Date(processedAt).toLocaleString()}</div>
      <div className={`inline-block px-2 py-1 rounded text-xs ${status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{status}</div>
    </div>
  );
} 