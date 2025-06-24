'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Calculator,
  Shield,
  Package,
  TrendingUp,
  Brain,
  Activity,
  Zap
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  color: string;
}

const processingSteps: ProcessingStep[] = [
  {
    id: 'upload',
    name: 'Upload',
    description: 'Enviando arquivo para o servidor',
    icon: Upload,
    status: 'pending',
    progress: 0,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'parsing',
    name: 'Parsing',
    description: 'Analisando e extraindo dados',
    icon: Database,
    status: 'pending',
    progress: 0,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'icms',
    name: 'Apuração ICMS',
    description: 'Calculando ICMS e regras fiscais',
    icon: Calculator,
    status: 'pending',
    progress: 0,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'federal',
    name: 'Apuração Federal',
    description: 'Processando PIS/COFINS/IRPJ/CSLL',
    icon: Shield,
    status: 'pending',
    progress: 0,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'estoque',
    name: 'Estoque & CIAP',
    description: 'Atualizando controle de estoque',
    icon: Package,
    status: 'pending',
    progress: 0,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'precificacao',
    name: 'Precificação',
    description: 'Analisando custos e preços',
    icon: TrendingUp,
    status: 'pending',
    progress: 0,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    description: 'Gerando relatórios finais',
    icon: Brain,
    status: 'pending',
    progress: 0,
    color: 'from-violet-500 to-purple-500'
  }
];

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    simulateUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const simulateUpload = (files: UploadedFile[]) => {
    files.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: 100, status: 'processing' }
              : f
          ));
          
          // Iniciar processamento
          if (uploadedFiles.length === 0) {
            startProcessing();
          }
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress }
              : f
          ));
        }
      }, 200);
    });
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStep(0);
    
    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        simulateStepProcessing(index);
      }, index * 1000);
    });
  };

  const simulateStepProcessing = (stepIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Atualizar status do step
        processingSteps[stepIndex].status = 'completed';
        processingSteps[stepIndex].progress = 100;
        
        // Atualizar progresso geral
        const completedSteps = processingSteps.filter(s => s.status === 'completed').length;
        const overallProgress = (completedSteps / processingSteps.length) * 100;
        setOverallProgress(overallProgress);
        
        if (completedSteps === processingSteps.length) {
          setIsProcessing(false);
          // Marcar arquivos como completados
          setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));
        }
      } else {
        processingSteps[stepIndex].progress = progress;
        const completedSteps = processingSteps.filter(s => s.status === 'completed').length;
        const overallProgress = ((completedSteps + progress / 100) / processingSteps.length) * 100;
        setOverallProgress(overallProgress);
      }
    }, 100);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload de Documentos Fiscais
          </h1>
          <p className="text-gray-600">
            Sistema 100% autônomo para processamento de documentos fiscais
          </p>
        </div>

        {/* Upload Area */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Área de Upload
            </CardTitle>
            <CardDescription>
              Arraste e solte seus documentos fiscais ou clique para selecionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Solte os arquivos aqui...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Arraste e solte arquivos aqui, ou <span className="text-blue-600">clique para selecionar</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Suporta XML, XLS, XLSX, CSV, PDF
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Arquivos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <Badge variant={file.status === 'error' ? 'destructive' : 'secondary'}>
                          {file.status === 'uploading' && 'Enviando'}
                          {file.status === 'processing' && 'Processando'}
                          {file.status === 'completed' && 'Concluído'}
                          {file.status === 'error' && 'Erro'}
                        </Badge>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Steps */}
        {isProcessing && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Processamento Automático
              </CardTitle>
              <CardDescription>
                Agentes IA processando seus documentos em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Overall Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                  <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300
                      ${index === currentStep ? 'border-blue-300 bg-blue-50' : ''}
                      ${step.status === 'completed' ? 'border-green-300 bg-green-50' : ''}
                      ${step.status === 'error' ? 'border-red-300 bg-red-50' : ''}
                      ${step.status === 'pending' ? 'border-gray-200 bg-gray-50' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${step.color}`}>
                          <step.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{step.name}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {step.status === 'processing' && <Activity className="w-5 h-5 text-blue-500 animate-spin" />}
                        {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        <Badge variant={step.status === 'error' ? 'destructive' : 'secondary'}>
                          {step.status === 'pending' && 'Pendente'}
                          {step.status === 'processing' && 'Processando'}
                          {step.status === 'completed' && 'Concluído'}
                          {step.status === 'error' && 'Erro'}
                        </Badge>
                      </div>
                    </div>
                    
                    {step.status !== 'pending' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progresso</span>
                          <span>{Math.round(step.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Documentos Processados</h3>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Cálculos Realizados</h3>
                <p className="text-2xl font-bold text-green-600">8,934</p>
                <p className="text-sm text-gray-500">Automáticos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Agentes Ativos</h3>
                <p className="text-2xl font-bold text-purple-600">12/12</p>
                <p className="text-sm text-gray-500">100% Operacional</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 