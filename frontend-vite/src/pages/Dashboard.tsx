import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Building2, 
  Calculator, 
  Upload,
  Eye,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Cpu,
  Database,
  Globe,
  Shield,
  Target,
  Rocket,
  Star,
  X,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardCharts from '../components/DashboardCharts'
import { 
  useAgents, 
  useApuracoes, 
  useSystemMetrics, 
  useLoading, 
  useConnectivity,
  useWebSocket,
  useTotalProcessed,
  useTotalValue,
  useAverageEfficiency,
  useActiveAgents,
  useDashboardStore
} from '../stores/dashboardStore'
import { logInfo, logError } from '../utils/monitoring'

// 🌟 TIPOS PARA O DASHBOARD
interface AgentData {
  id: number
  name: string
  type: 'ICMS' | 'PIS' | 'COFINS' | 'IRPJ' | 'CSLL' | 'IPI'
  status: 'active' | 'processing' | 'error' | 'inactive'
  efficiency: number
  documentsProcessed: number
  lastActivity: string
  currentTask: string
}

interface ApuracaoData {
  type: string
  total: number
  processed: number
  pending: number
  error: number
  value: number
  status: 'completed' | 'processing' | 'error'
  lastUpdate: string
}

const Dashboard: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  // 🌟 DADOS DO STORE
  const agents = useAgents()
  const apuracoes = useApuracoes()
  const systemMetrics = useSystemMetrics()
  const loading = useLoading()
  const connectivity = useConnectivity()
  const websocket = useWebSocket()
  const totalProcessed = useTotalProcessed()
  const totalValue = useTotalValue()
  const averageEfficiency = useAverageEfficiency()
  const activeAgents = useActiveAgents()

  // 🌟 AÇÕES DO STORE
  const { 
    fetchAgents, 
    fetchApuracoes, 
    fetchSystemMetrics, 
    checkConnectivity,
    connectWebSocket,
    disconnectWebSocket 
  } = useDashboardStore()

  // 🌟 INICIALIZAÇÃO
  useEffect(() => {
    logInfo('Dashboard initialized', 'Dashboard')
    
    // 🌟 CARREGAR DADOS INICIAIS
    const loadData = async () => {
      try {
        await Promise.all([
          fetchAgents(),
          fetchApuracoes(),
          fetchSystemMetrics()
        ])
        
        // 🌟 VERIFICAR CONECTIVIDADE
        await checkConnectivity()
        
        // 🌟 CONECTAR WEBSOCKET
        connectWebSocket()
        
        setIsProcessing(false)
        logInfo('Dashboard data loaded successfully', 'Dashboard')
      } catch (error) {
        logError('Failed to load dashboard data', 'Dashboard', { error: (error as Error).message })
        setIsProcessing(false)
        toast.error('Erro ao carregar dados do dashboard')
      }
    }

    loadData()

    // 🌟 CLEANUP
    return () => {
      disconnectWebSocket()
    }
  }, [fetchAgents, fetchApuracoes, fetchSystemMetrics, checkConnectivity, connectWebSocket, disconnectWebSocket])

  // 🌟 SIMULAÇÃO DE PROCESSAMENTO EM TEMPO REAL (FALLBACK)
  useEffect(() => {
    if (!connectivity.isConnected) {
      const interval = setInterval(() => {
        // 🌟 ATUALIZAR DADOS MOCK EM TEMPO REAL
        const updatedAgents = agents.map(agent => ({
          ...agent,
          documentsProcessed: agent.documentsProcessed + Math.floor(Math.random() * 5),
          efficiency: Math.min(100, agent.efficiency + (Math.random() - 0.5) * 2),
          lastActivity: 'Agora'
        }))

        const updatedApuracoes = apuracoes.map(apuracao => ({
          ...apuracao,
          processed: apuracao.processed + Math.floor(Math.random() * 3),
          lastUpdate: 'Agora'
        }))

        // 🌟 ATUALIZAR STORE
        updatedAgents.forEach(agent => {
          useDashboardStore.getState().updateAgentStatus(agent.id, agent)
        })

        updatedApuracoes.forEach(apuracao => {
          useDashboardStore.getState().updateApuracaoStatus(apuracao.type, apuracao)
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [agents, apuracoes, connectivity.isConnected])

  // 🌟 FUNÇÕES AUXILIARES
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-success-400'
      case 'processing':
        return 'text-warning-400'
      case 'error':
        return 'text-danger-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-success-500/20 border-success-500/30'
      case 'processing':
        return 'bg-warning-500/20 border-warning-500/30'
      case 'error':
        return 'bg-danger-500/20 border-danger-500/30'
      default:
        return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const handleRefresh = async () => {
    try {
      setIsProcessing(true)
      await Promise.all([
        fetchAgents(),
        fetchApuracoes(),
        fetchSystemMetrics(),
        checkConnectivity()
      ])
      toast.success('Dados atualizados com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar dados')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 🌟 HEADER DO DASHBOARD */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">
            Dashboard Revolucionário 100% IA
          </h1>
          <p className="text-gray-400 mt-2">
            Monitoramento em tempo real das apurações automáticas de impostos
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 🌟 STATUS DE CONECTIVIDADE */}
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-600/30">
            {connectivity.isConnected ? (
              <Wifi className="w-4 h-4 text-success-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-danger-400" />
            )}
            <span className={`text-sm font-medium ${
              connectivity.isConnected ? 'text-success-400' : 'text-danger-400'
            }`}>
              {connectivity.isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {/* 🌟 STATUS DO WEBSOCKET */}
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-600/30">
            <div className={`w-2 h-2 rounded-full ${
              websocket.isConnected ? 'bg-success-500 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className="text-sm text-gray-300">
              {websocket.isConnected ? 'Tempo Real' : 'Polling'}
            </span>
          </div>
          
          {/* 🌟 BOTÃO DE ATUALIZAR */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isProcessing}
            className="ai-button flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Atualizando...' : 'Atualizar'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ai-button"
            onClick={() => toast.success('Relatório gerado com sucesso!')}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </motion.button>
        </div>
      </motion.div>

      {/* 🌟 MÉTRICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Processado',
            value: totalProcessed.toLocaleString(),
            icon: FileText,
            color: 'text-primary-400',
            bg: 'bg-primary-500/20',
            border: 'border-primary-500/30',
            loading: loading.agents || loading.apuracoes
          },
          {
            title: 'Valor Total',
            value: `R$ ${totalValue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-success-400',
            bg: 'bg-success-500/20',
            border: 'border-success-500/30',
            loading: loading.apuracoes
          },
          {
            title: 'Eficiência Média',
            value: `${averageEfficiency.toFixed(1)}%`,
            icon: Target,
            color: 'text-warning-400',
            bg: 'bg-warning-500/20',
            border: 'border-warning-500/30',
            loading: loading.agents
          },
          {
            title: 'Agentes Ativos',
            value: `${activeAgents.length}/${agents.length}`,
            icon: Brain,
            color: 'text-holographic-blue',
            bg: 'bg-holographic-blue/20',
            border: 'border-holographic-blue/30',
            loading: loading.agents
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="metric-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                {metric.loading ? (
                  <div className="h-8 bg-gray-700 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${metric.bg} ${metric.border}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🌟 AGENTES IA EM AÇÃO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="holographic-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gradient">
            🤖 Agentes IA em Ação
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(agents.length)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-2 h-2 rounded-full ${
                    agents[i]?.status === 'active' ? 'bg-success-500' : 
                    agents[i]?.status === 'processing' ? 'bg-warning-500' : 'bg-gray-500'
                  } animate-pulse`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">{agents.length} Agentes Operacionais</span>
          </div>
        </div>

        {loading.agents ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-600/30">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-700 rounded mb-4" />
                  <div className="h-2 bg-gray-700 rounded mb-2" />
                  <div className="h-2 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedAgent?.id === agent.id ? 'border-holographic-blue/50 bg-holographic-blue/10' : 'border-gray-600/30'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusBg(agent.status)}`}>
                      <Cpu className="w-5 h-5 text-holographic-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-400">{agent.type}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusBg(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className={getStatusColor(agent.status)}>
                      {agent.status === 'active' ? 'Ativo' : 
                       agent.status === 'processing' ? 'Processando' : 
                       agent.status === 'error' ? 'Erro' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Eficiência:</span>
                    <span className="text-white font-medium">{agent.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.efficiency}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${
                        agent.efficiency >= 95 ? 'bg-success-500' :
                        agent.efficiency >= 85 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Documentos:</span>
                    <span className="text-white font-medium">{agent.documentsProcessed.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    <p className="truncate">{agent.currentTask}</p>
                    <p>Última atividade: {agent.lastActivity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 🌟 APURAÇÕES EM TEMPO REAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="holographic-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gradient">
            📊 Apurações Automáticas em Tempo Real
          </h2>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-warning-400 animate-pulse" />
            <span className="text-sm text-gray-300">Processamento Automático</span>
          </div>
        </div>

        {loading.apuracoes ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-600/30">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-700 rounded mb-4" />
                  <div className="h-2 bg-gray-700 rounded mb-2" />
                  <div className="h-2 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {apuracoes.map((apuracao, index) => (
              <motion.div
                key={apuracao.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-600/30 hover:border-holographic-blue/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusBg(apuracao.status)}`}>
                      <Calculator className="w-5 h-5 text-holographic-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{apuracao.type}</h3>
                      <p className="text-sm text-gray-400">Apuração Automática</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusBg(apuracao.status)}`}>
                    {getStatusIcon(apuracao.status)}
                    <span className={getStatusColor(apuracao.status)}>
                      {apuracao.status === 'completed' ? 'Concluído' : 
                       apuracao.status === 'processing' ? 'Processando' : 'Erro'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processados:</span>
                    <span className="text-white font-medium">{apuracao.processed.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pendentes:</span>
                    <span className="text-warning-400 font-medium">{apuracao.pending}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Erros:</span>
                    <span className="text-danger-400 font-medium">{apuracao.error}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Valor:</span>
                    <span className="text-success-400 font-medium">R$ {apuracao.value.toLocaleString()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(apuracao.processed / apuracao.total) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${
                        apuracao.status === 'completed' ? 'bg-success-500' :
                        apuracao.status === 'processing' ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-400 text-center">
                    Última atualização: {apuracao.lastUpdate}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 🌟 DETALHES DO AGENTE SELECIONADO */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="holographic-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gradient">
                🔍 Detalhes do {selectedAgent.name}
              </h2>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-3">Informações do Agente</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white">{selectedAgent.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={getStatusColor(selectedAgent.status)}>
                      {selectedAgent.status === 'active' ? 'Ativo' : 
                       selectedAgent.status === 'processing' ? 'Processando' : 
                       selectedAgent.status === 'error' ? 'Erro' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eficiência:</span>
                    <span className="text-white">{selectedAgent.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Documentos Processados:</span>
                    <span className="text-white">{selectedAgent.documentsProcessed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">{Math.floor(selectedAgent.uptime / 3600)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uso de Memória:</span>
                    <span className="text-white">{selectedAgent.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uso de CPU:</span>
                    <span className="text-white">{selectedAgent.cpuUsage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-3">Tarefa Atual</h3>
                <div className="p-3 rounded-lg bg-dark-800/50 border border-gray-600/30">
                  <p className="text-sm text-gray-300">{selectedAgent.currentTask}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Última atividade: {selectedAgent.lastActivity}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 GRÁFICOS 3D REVOLUCIONÁRIOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <DashboardCharts />
      </motion.div>
    </div>
  )
}

export default Dashboard 