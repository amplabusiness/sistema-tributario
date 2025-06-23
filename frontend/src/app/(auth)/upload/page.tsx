'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Eye,
  Download,
  Trash2,
  File,
  FileSpreadsheet,
  FileArchive,
  Image,
  Video,
  Music
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  preview?: string;
  error?: string;
}

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('xml')) return <FileText className="w-8 h-8 text-blue-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-8 h-8 text-orange-500" />;
    if (type.includes('image')) return <Image className="w-8 h-8 text-purple-500" />;
    if (type.includes('video')) return <Video className="w-8 h-8 text-red-500" />;
    if (type.includes('audio')) return <Music className="w-8 h-8 text-pink-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simular upload progressivo
    newFiles.forEach((file, index) => {
      simulateUpload(file.id, index * 500);
    });
  };

  const simulateUpload = (fileId: string, delay: number) => {
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'processing' as const }
            : file
        )
      );

      // Simular progresso
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, progress: 100, status: 'completed' as const }
                : file
            )
          );
        } else {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, progress }
                : file
            )
          );
        }
      }, 200);
    }, delay);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-orange-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Enviando...';
      case 'processing':
        return 'Processando...';
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Upload className="w-10 h-10 text-blue-600" />
          Upload de Documentos
        </h1>
        <p className="text-gray-600 mt-2">
          Arraste e solte seus documentos fiscais ou clique para selecionar
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            accept=".xml,.txt,.csv,.xlsx,.xls,.pdf,.zip,.rar"
          />
          
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isDragOver ? 'Solte os arquivos aqui' : 'Arraste e solte arquivos aqui'}
              </h3>
              <p className="text-gray-600 mb-4">
                ou clique para selecionar arquivos
              </p>
              <p className="text-sm text-gray-500">
                Suporta: XML, TXT, CSV, Excel, PDF, ZIP, RAR (máx. 100MB por arquivo)
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Arquivos ({uploadedFiles.length})
            </h3>
            
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          {getStatusIcon(file.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {getStatusText(file.status)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && (
                        <>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {file.status === 'uploading' || file.status === 'processing' ? (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : file.status === 'error' ? (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{file.error || 'Erro no processamento'}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Summary */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Upload</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadedFiles.length}
                </div>
                <div className="text-sm text-gray-600">Total de Arquivos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploadedFiles.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Concluídos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {uploadedFiles.filter(f => f.status === 'processing' || f.status === 'uploading').length}
                </div>
                <div className="text-sm text-gray-600">Em Processamento</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {uploadedFiles.filter(f => f.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Com Erro</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 