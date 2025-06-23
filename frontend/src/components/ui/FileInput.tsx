import React from 'react';

interface FileInputProps {
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function FileInput({ onChange, accept }: FileInputProps) {
  return (
    <input
      type="file"
      accept={accept}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      onChange={e => onChange(e.target.files?.[0] || null)}
    />
  );
} 