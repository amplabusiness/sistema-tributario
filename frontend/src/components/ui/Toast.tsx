import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, type = 'info' }: ToastProps) {
  const color =
    type === 'success' ? 'bg-green-100 text-green-800' :
    type === 'error' ? 'bg-red-100 text-red-800' :
    'bg-blue-100 text-blue-800';
  return (
    <div className={`px-4 py-2 rounded shadow ${color} mb-2`}>
      {message}
    </div>
  );
} 