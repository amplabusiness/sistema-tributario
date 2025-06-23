'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Calculator, 
  TrendingUp, 
  Package, 
  DollarSign, 
  BarChart3, 
  Bug, 
  Code, 
  CheckCircle, 
  Settings, 
  Users,
  Activity,
  Zap,
  Brain,
  Target
} from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  progress: number;
  icon: React.ReactNode;
  color: string;
  lastActivity: string;
  documentsProcessed: number;
  efficiency: number;
}

interface DashboardStats {
  totalDocuments: number;
  documentsProcessed: number;
  documentsPending: number;
  totalICMS: number;
  totalFederal: number;
  systemEfficiency: number;
  activeAgents: number;
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    documentsProcessed: 0,
    documentsPending: 0,
    totalICMS: 0,
    totalFederal: 0,
    systemEfficiency: 0,
    activeAgents: 0
  });

  const agentConfigs = [
    {
      id: 1,
      name: 'Upload & Entrada',
      description: 'Monitoramento automático de pastas, e-mails e APIs',
      icon: <Upload className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Parsing & Leitura',
      description: 'Leitura e parser automático de XML, SPED, ECD, ECF',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Apuração ICMS',
      description: 'Cálculo automático de ICMS com regras dinâmicas',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Apuração Federal',
      description: 'Cálculo de PIS/COFINS/IRPJ/CSLL',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      name: 'Estoque & CIAP',
      description: 'Controle automático de estoque e CIAP',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-teal-500'
    },
    {
      id: 6,
      name: 'Precificação & Margem',
      description: 'Análise de precificação e margens',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-emerald-500'
    },
    {
      id: 7,
      name: 'Interface & Reporting',
      description: 'Dashboard dinâmico e relatórios',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: 8,
      name: 'Correção de Testes',
      description: 'Análise e correção automática de testes',
      icon: <Bug className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 9,
      name: 'Desenvolvimento Frontend',
      description: 'Geração automática de componentes',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      id: 10,
      name: 'Qualidade de Código',
      description: 'Análise e aplicação de padrões',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-cyan-500'
    },
    {
      id: 11,
      name: 'DevOps Automatizado',
      description: 'CI/CD e monitoramento',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      id: 12,
      name: 'Coordenador',
      description: 'Orquestração de todos os agentes',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-violet-500'
    }
  ];

  useEffect(() => {
    // Simular dados em tempo real dos agentes
    const initializeAgents = () => {
      const initialAgents = agentConfigs.map(config => ({
        ...config,
        status: (Math.random() > 0.3 ? 'active' : 'idle') as 'active' | 'idle' | 'processing' | 'error',
        progress: Math.floor(Math.random() * 100),
        lastActivity: new Date().toLocaleTimeString(),
        documentsProcessed: Math.floor(Math.random() * 1000),
        efficiency: Math.floor(Math.random() * 40) + 60
      }));
      setAgents(initialAgents);
    };

    initializeAgents();

    // Atualizar dados a cada 3 segundos
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: (Math.random() > 0.2 ? 'active' : 'idle') as 'active' | 'idle' | 'processing' | 'error',
        progress: Math.floor(Math.random() * 100),
        lastActivity: new Date().toLocaleTimeString(),
        documentsProcessed: agent.documentsProcessed + Math.floor(Math.random() * 10),
        efficiency: Math.max(60, Math.min(100, agent.efficiency + (Math.random() - 0.5) * 10))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calcular estatísticas baseadas nos agentes
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const totalDocuments = agents.reduce((sum, agent) => sum + agent.documentsProcessed, 0);
    const systemEfficiency = agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length;

    setStats({
      totalDocuments,
      documentsProcessed: Math.floor(totalDocuments * 0.85),
      documentsPending: Math.floor(totalDocuments * 0.15),
      totalICMS: Math.floor(totalDocuments * 125.50),
      totalFederal: Math.floor(totalDocuments * 82.70),
      systemEfficiency: Math.floor(systemEfficiency),
      activeAgents
    });
  }, [agents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'processing': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100';
      case 'processing': return 'bg-blue-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-10 h-10 text-blue-600" />
              Sistema Tributário IA
            </h1>
            <p className="text-gray-600 mt-2">Dashboard em tempo real dos 12 agentes IA autônomos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Sistema Online</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">{stats.activeAgents}/12 Agentes Ativos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Documentos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ICMS Total</p>
              <p className="text-3xl font-bold text-green-600">R$ {stats.totalICMS.toLocaleString()}</p>
            </div>
            <Calculator className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Federal Total</p>
              <p className="text-3xl font-bold text-orange-600">R$ {stats.totalFederal.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Eficiência do Sistema</p>
              <p className="text-3xl font-bold text-purple-600">{stats.systemEfficiency}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                {agent.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(agent.status)} ${getStatusColor(agent.status)}`}>
                {agent.status}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{agent.description}</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-semibold">{agent.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${agent.color} transition-all duration-1000`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Documentos</p>
                  <p className="font-semibold">{agent.documentsProcessed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Eficiência</p>
                  <p className="font-semibold">{agent.efficiency}%</p>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Última atividade: {agent.lastActivity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 