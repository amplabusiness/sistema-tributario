'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Upload, 
  Database, 
  Calculator, 
  Shield, 
  Package, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  Settings, 
  Code, 
  Users,
  Download,
  Eye,
  Activity,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  icon: any;
  status: 'online' | 'offline' | 'processing' | 'error';
  progress: number;
  lastActivity: string;
  tasks: number;
  errors: number;
  color: string;
}

const agents: Agent[] = [
  {
    id: 1,
    name: 'Upload & Entrada',
    description: 'Monitora pastas, emails e APIs para upload automático de documentos fiscais',
    icon: Upload,
    status: 'online',
    progress: 85,
    lastActivity: '2 min atrás',
    tasks: 12,
    errors: 0,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Parsing & Leitura',
    description: 'Analisa e extrai dados de XML, SPED, ECD, ECF automaticamente',
    icon: Database,
    status: 'processing',
    progress: 67,
    lastActivity: '1 min atrás',
    tasks: 8,
    errors: 1,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    name: 'Apuração ICMS',
    description: 'Calcula ICMS com regras dinâmicas, base reduzida, crédito outorgado',
    icon: Calculator,
    status: 'online',
    progress: 92,
    lastActivity: '30 seg atrás',
    tasks: 15,
    errors: 0,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 4,
    name: 'Apuração Federal',
    description: 'Processa PIS/COFINS/IRPJ/CSLL com benefícios fiscais automáticos',
    icon: Shield,
    status: 'online',
    progress: 78,
    lastActivity: '45 seg atrás',
    tasks: 10,
    errors: 0,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 5,
    name: 'Estoque & CIAP',
    description: 'Controla estoque, movimentações e cálculo de custo médio',
    icon: Package,
    status: 'processing',
    progress: 45,
    lastActivity: '3 min atrás',
    tasks: 6,
    errors: 2,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 6,
    name: 'Precificação',
    description: 'Analisa custos e sugere preços de venda otimizados',
    icon: TrendingUp,
    status: 'online',
    progress: 88,
    lastActivity: '1 min atrás',
    tasks: 9,
    errors: 0,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 7,
    name: 'Relatórios',
    description: 'Gera relatórios automáticos e dashboards interativos',
    icon: FileText,
    status: 'online',
    progress: 95,
    lastActivity: '15 seg atrás',
    tasks: 14,
    errors: 0,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 8,
    name: 'Correção de Testes',
    description: 'Monitora e corrige automaticamente falhas nos testes',
    icon: Code,
    status: 'error',
    progress: 23,
    lastActivity: '5 min atrás',
    tasks: 3,
    errors: 5,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 9,
    name: 'Desenvolvimento',
    description: 'Cria componentes e interfaces automaticamente',
    icon: Users,
    status: 'online',
    progress: 76,
    lastActivity: '2 min atrás',
    tasks: 7,
    errors: 1,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 10,
    name: 'Qualidade',
    description: 'Analisa código e aplica padrões de qualidade',
    icon: Settings,
    status: 'online',
    progress: 89,
    lastActivity: '1 min atrás',
    tasks: 11,
    errors: 0,
    color: 'from-gray-500 to-slate-500'
  },
  {
    id: 11,
    name: 'DevOps',
    description: 'Gerencia deploy, monitoramento e infraestrutura',
    icon: Zap,
    status: 'online',
    progress: 82,
    lastActivity: '30 seg atrás',
    tasks: 8,
    errors: 0,
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 12,
    name: 'Coordenador',
    description: 'Orquestra todos os agentes e gerencia o fluxo de trabalho',
    icon: Brain,
    status: 'online',
    progress: 100,
    lastActivity: 'Agora',
    tasks: 25,
    errors: 0,
    color: 'from-violet-500 to-purple-500'
  }
];

export default function DashboardPage() {
  const [selectedCompany, setSelectedCompany] = useState('Todas as Empresas');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [systemStatus, setSystemStatus] = useState('online');
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);

  useEffect(() => {
    // Simular dados em tempo real
    const interval = setInterval(() => {
      setTotalTasks(agents.reduce((sum, agent) => sum + agent.tasks, 0));
      setTotalErrors(agents.reduce((sum, agent) => sum + agent.errors, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'processing': return 'Processando';
      case 'error': return 'Erro';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema Tributário 100% IA
            </h1>
            <p className="text-gray-600">
              Primeiro sistema tributário brasileiro totalmente autônomo
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus)} animate-pulse`}></div>
              <span className="text-sm font-medium text-gray-700">
                Sistema {getStatusText(systemStatus)}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">12/12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erros Detectados</p>
                <p className="text-2xl font-bold text-gray-900">{totalErrors}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Empresa:</label>
          <select 
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Todas as Empresas</option>
            <option>Empresa A</option>
            <option>Empresa B</option>
            <option>Empresa C</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Mês:</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Janeiro 2025</option>
            <option>Dezembro 2024</option>
            <option>Novembro 2024</option>
          </select>
        </div>
      </div>

      {/* Neural Network Map */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Mapa Neural dos Agentes IA
          </CardTitle>
          <CardDescription>
            Visualização em tempo real da rede neural de agentes autônomos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="relative group cursor-pointer"
                title={agent.description}
              >
                <div className={`
                  p-4 rounded-lg border-2 transition-all duration-300
                  ${agent.status === 'online' ? 'border-green-200 bg-green-50' : ''}
                  ${agent.status === 'processing' ? 'border-blue-200 bg-blue-50' : ''}
                  ${agent.status === 'error' ? 'border-red-200 bg-red-50' : ''}
                  ${agent.status === 'offline' ? 'border-gray-200 bg-gray-50' : ''}
                  group-hover:scale-105 group-hover:shadow-lg
                `}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${agent.color}`}>
                      <agent.icon className="w-4 h-4 text-white" />
                    </div>
                    <Badge 
                      variant={agent.status === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {getStatusText(agent.status)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {agent.name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progresso</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${agent.color} transition-all duration-500`}
                        style={{ width: `${agent.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{agent.tasks} tarefas</span>
                      <span>{agent.errors} erros</span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      {agent.lastActivity}
                    </p>
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                  {agent.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload de Documentos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Faça upload de XML, SPED, ECD, ECF e outros documentos fiscais
            </p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Processar
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Apuração Tributária</h3>
            <p className="text-sm text-gray-600 mb-4">
              Execute cálculos de ICMS, PIS/COFINS, IRPJ/CSLL automaticamente
            </p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Gerar
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Relatórios</h3>
            <p className="text-sm text-gray-600 mb-4">
              Visualize relatórios detalhados e dashboards interativos
            </p>
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 