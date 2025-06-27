// 🌟 STORE DO DASHBOARD - ESTADO GLOBAL 100% IA

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { logInfo, logError, captureError } from '../utils/monitoring'
import { 
  getAgentsStatus, 
  getApuracoesStatus, 
  getSystemMetrics, 
  connectWebSocket,
  checkConnectivity 
} from '../services/api'

// 🌟 TIPOS DO STORE
interface AgentData {
  id: number
  name: string
  type: 'ICMS' | 'PIS' | 'COFINS' | 'IRPJ' | 'CSLL' | 'IPI'
  status: 'active' | 'processing' | 'error' | 'inactive'
  efficiency: number
  documentsProcessed: number
  lastActivity: string
  currentTask: string
  uptime: number
  memoryUsage: number
  cpuUsage: number
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
  startTime: string
  estimatedCompletion: string
}

interface SystemData {
  totalAgents: number
  activeAgents: number
  totalDocuments: number
  totalValue: number
  systemUptime: number
  averageEfficiency: number
  lastBackup: string
  databaseStatus: 'healthy' | 'warning' | 'error'
}

interface DashboardState {
  // 🌟 DADOS DOS AGENTES
  agents: AgentData[]
  selectedAgent: AgentData | null
  
  // 🌟 DADOS DAS APURAÇÕES
  apuracoes: ApuracaoData[]
  
  // 🌟 MÉTRICAS DO SISTEMA
  systemMetrics: SystemData | null
  
  // 🌟 ESTADO DE CARREGAMENTO
  loading: {
    agents: boolean
    apuracoes: boolean
    system: boolean
  }
  
  // 🌟 ESTADO DE CONECTIVIDADE
  connectivity: {
    isConnected: boolean
    lastCheck: string | null
    error: string | null
  }
  
  // 🌟 ESTADO DO WEBSOCKET
  websocket: {
    isConnected: boolean
    lastMessage: any | null
    error: string | null
  }
  
  // 🌟 AÇÕES
  fetchAgents: () => Promise<void>
  fetchApuracoes: () => Promise<void>
  fetchSystemMetrics: () => Promise<void>
  selectAgent: (agent: AgentData | null) => void
  updateAgentStatus: (agentId: number, updates: Partial<AgentData>) => void
  updateApuracaoStatus: (type: string, updates: Partial<ApuracaoData>) => void
  checkConnectivity: () => Promise<void>
  connectWebSocket: () => void
  disconnectWebSocket: () => void
  resetStore: () => void
}

// 🌟 DADOS MOCKADOS PARA FALLBACK
const mockAgents: AgentData[] = [
  {
    id: 1,
    name: 'Agente ICMS-01',
    type: 'ICMS',
    status: 'active',
    efficiency: 98.5,
    documentsProcessed: 1250,
    lastActivity: '2 min atrás',
    currentTask: 'Processando EFD ICMS 04/2025',
    uptime: 86400,
    memoryUsage: 75.2,
    cpuUsage: 45.8
  },
  {
    id: 2,
    name: 'Agente PIS-01',
    type: 'PIS',
    status: 'processing',
    efficiency: 95.2,
    documentsProcessed: 890,
    lastActivity: '1 min atrás',
    currentTask: 'Calculando créditos presumidos',
    uptime: 72000,
    memoryUsage: 68.4,
    cpuUsage: 52.1
  },
  {
    id: 3,
    name: 'Agente COFINS-01',
    type: 'COFINS',
    status: 'active',
    efficiency: 97.8,
    documentsProcessed: 1100,
    lastActivity: '30 seg atrás',
    currentTask: 'Validando alíquotas',
    uptime: 79200,
    memoryUsage: 71.6,
    cpuUsage: 48.3
  },
  {
    id: 4,
    name: 'Agente IRPJ-01',
    type: 'IRPJ',
    status: 'processing',
    efficiency: 92.1,
    documentsProcessed: 450,
    lastActivity: '45 seg atrás',
    currentTask: 'Calculando base de cálculo',
    uptime: 64800,
    memoryUsage: 82.3,
    cpuUsage: 61.7
  },
  {
    id: 5,
    name: 'Agente CSLL-01',
    type: 'CSLL',
    status: 'active',
    efficiency: 96.3,
    documentsProcessed: 380,
    lastActivity: '1 min atrás',
    currentTask: 'Aplicando adições/exclusões',
    uptime: 68400,
    memoryUsage: 69.8,
    cpuUsage: 43.2
  },
  {
    id: 6,
    name: 'Agente IPI-01',
    type: 'IPI',
    status: 'error',
    efficiency: 88.7,
    documentsProcessed: 220,
    lastActivity: '5 min atrás',
    currentTask: 'Erro na validação de NCM',
    uptime: 36000,
    memoryUsage: 95.1,
    cpuUsage: 78.9
  }
]

const mockApuracoes: ApuracaoData[] = [
  {
    type: 'ICMS',
    total: 1250,
    processed: 1180,
    pending: 45,
    error: 25,
    value: 45000.00,
    status: 'completed',
    lastUpdate: '2 min atrás',
    startTime: '2025-06-27T08:00:00Z',
    estimatedCompletion: '2025-06-27T10:30:00Z'
  },
  {
    type: 'PIS',
    total: 890,
    processed: 820,
    pending: 35,
    error: 35,
    value: 18000.00,
    status: 'processing',
    lastUpdate: '1 min atrás',
    startTime: '2025-06-27T08:15:00Z',
    estimatedCompletion: '2025-06-27T11:00:00Z'
  },
  {
    type: 'COFINS',
    total: 1100,
    processed: 1050,
    pending: 30,
    error: 20,
    value: 32000.00,
    status: 'completed',
    lastUpdate: '30 seg atrás',
    startTime: '2025-06-27T08:30:00Z',
    estimatedCompletion: '2025-06-27T10:45:00Z'
  },
  {
    type: 'IRPJ',
    total: 450,
    processed: 380,
    pending: 50,
    error: 20,
    value: 25000.00,
    status: 'processing',
    lastUpdate: '45 seg atrás',
    startTime: '2025-06-27T09:00:00Z',
    estimatedCompletion: '2025-06-27T12:00:00Z'
  },
  {
    type: 'CSLL',
    total: 380,
    processed: 320,
    pending: 40,
    error: 20,
    value: 15000.00,
    status: 'processing',
    lastUpdate: '1 min atrás',
    startTime: '2025-06-27T09:15:00Z',
    estimatedCompletion: '2025-06-27T11:30:00Z'
  },
  {
    type: 'IPI',
    total: 220,
    processed: 180,
    pending: 25,
    error: 15,
    value: 8000.00,
    status: 'error',
    lastUpdate: '5 min atrás',
    startTime: '2025-06-27T08:45:00Z',
    estimatedCompletion: '2025-06-27T10:15:00Z'
  }
]

const mockSystemMetrics: SystemData = {
  totalAgents: 12,
  activeAgents: 8,
  totalDocuments: 4290,
  totalValue: 143000.00,
  systemUptime: 86400,
  averageEfficiency: 94.7,
  lastBackup: '2025-06-27T06:00:00Z',
  databaseStatus: 'healthy'
}

// 🌟 STORE PRINCIPAL
export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // 🌟 ESTADO INICIAL
    agents: mockAgents,
    selectedAgent: null,
    apuracoes: mockApuracoes,
    systemMetrics: mockSystemMetrics,
    
    loading: {
      agents: false,
      apuracoes: false,
      system: false
    },
    
    connectivity: {
      isConnected: false,
      lastCheck: null,
      error: null
    },
    
    websocket: {
      isConnected: false,
      lastMessage: null,
      error: null
    },
    
    // 🌟 AÇÕES
    fetchAgents: async () => {
      set({ loading: { ...get().loading, agents: true } })
      
      try {
        const agents = await getAgentsStatus()
        set({ agents, loading: { ...get().loading, agents: false } })
        logInfo('Agents data fetched successfully', 'DashboardStore')
      } catch (error) {
        logError('Failed to fetch agents', 'DashboardStore', { error: (error as Error).message })
        set({ 
          agents: mockAgents, // 🌟 FALLBACK PARA DADOS MOCK
          loading: { ...get().loading, agents: false } 
        })
      }
    },
    
    fetchApuracoes: async () => {
      set({ loading: { ...get().loading, apuracoes: true } })
      
      try {
        const apuracoes = await getApuracoesStatus()
        set({ apuracoes, loading: { ...get().loading, apuracoes: false } })
        logInfo('Apuracoes data fetched successfully', 'DashboardStore')
      } catch (error) {
        logError('Failed to fetch apuracoes', 'DashboardStore', { error: (error as Error).message })
        set({ 
          apuracoes: mockApuracoes, // 🌟 FALLBACK PARA DADOS MOCK
          loading: { ...get().loading, apuracoes: false } 
        })
      }
    },
    
    fetchSystemMetrics: async () => {
      set({ loading: { ...get().loading, system: true } })
      
      try {
        const systemMetrics = await getSystemMetrics()
        set({ systemMetrics, loading: { ...get().loading, system: false } })
        logInfo('System metrics fetched successfully', 'DashboardStore')
      } catch (error) {
        logError('Failed to fetch system metrics', 'DashboardStore', { error: (error as Error).message })
        set({ 
          systemMetrics: mockSystemMetrics, // 🌟 FALLBACK PARA DADOS MOCK
          loading: { ...get().loading, system: false } 
        })
      }
    },
    
    selectAgent: (agent) => {
      set({ selectedAgent: agent })
      logInfo('Agent selected', 'DashboardStore', { agentId: agent?.id })
    },
    
    updateAgentStatus: (agentId, updates) => {
      set((state) => ({
        agents: state.agents.map(agent => 
          agent.id === agentId ? { ...agent, ...updates } : agent
        )
      }))
      logInfo('Agent status updated', 'DashboardStore', { agentId, updates })
    },
    
    updateApuracaoStatus: (type, updates) => {
      set((state) => ({
        apuracoes: state.apuracoes.map(apuracao => 
          apuracao.type === type ? { ...apuracao, ...updates } : apuracao
        )
      }))
      logInfo('Apuracao status updated', 'DashboardStore', { type, updates })
    },
    
    checkConnectivity: async () => {
      try {
        const isConnected = await checkConnectivity()
        set({
          connectivity: {
            isConnected,
            lastCheck: new Date().toISOString(),
            error: null
          }
        })
        logInfo('Connectivity check completed', 'DashboardStore', { isConnected })
      } catch (error) {
        set({
          connectivity: {
            isConnected: false,
            lastCheck: new Date().toISOString(),
            error: (error as Error).message
          }
        })
        logError('Connectivity check failed', 'DashboardStore', { error: (error as Error).message })
      }
    },
    
    connectWebSocket: () => {
      try {
        connectWebSocket((data) => {
          // 🌟 PROCESSAR MENSAGENS DO WEBSOCKET
          set({ websocket: { ...get().websocket, lastMessage: data } })
          
          // 🌟 ATUALIZAR DADOS BASEADO NO TIPO DE MENSAGEM
          if (data.type === 'agent_update') {
            get().updateAgentStatus(data.agentId, data.updates)
          } else if (data.type === 'apuracao_update') {
            get().updateApuracaoStatus(data.apuracaoType, data.updates)
          } else if (data.type === 'system_update') {
            set({ systemMetrics: data.metrics })
          }
          
          logInfo('WebSocket message received', 'DashboardStore', { messageType: data.type })
        })
        
        set({ websocket: { ...get().websocket, isConnected: true, error: null } })
        logInfo('WebSocket connected', 'DashboardStore')
      } catch (error) {
        set({ 
          websocket: { 
            ...get().websocket, 
            isConnected: false, 
            error: (error as Error).message 
          } 
        })
        logError('WebSocket connection failed', 'DashboardStore', { error: (error as Error).message })
      }
    },
    
    disconnectWebSocket: () => {
      set({ websocket: { ...get().websocket, isConnected: false } })
      logInfo('WebSocket disconnected', 'DashboardStore')
    },
    
    resetStore: () => {
      set({
        agents: mockAgents,
        selectedAgent: null,
        apuracoes: mockApuracoes,
        systemMetrics: mockSystemMetrics,
        loading: { agents: false, apuracoes: false, system: false },
        connectivity: { isConnected: false, lastCheck: null, error: null },
        websocket: { isConnected: false, lastMessage: null, error: null }
      })
      logInfo('Dashboard store reset', 'DashboardStore')
    }
  }))
)

// 🌟 SELECTORS PARA PERFORMANCE
export const useAgents = () => useDashboardStore((state) => state.agents)
export const useSelectedAgent = () => useDashboardStore((state) => state.selectedAgent)
export const useApuracoes = () => useDashboardStore((state) => state.apuracoes)
export const useSystemMetrics = () => useDashboardStore((state) => state.systemMetrics)
export const useLoading = () => useDashboardStore((state) => state.loading)
export const useConnectivity = () => useDashboardStore((state) => state.connectivity)
export const useWebSocket = () => useDashboardStore((state) => state.websocket)

// 🌟 COMPUTED VALUES
export const useActiveAgents = () => useDashboardStore((state) => 
  state.agents.filter(agent => agent.status === 'active')
)

export const useTotalProcessed = () => useDashboardStore((state) => 
  state.apuracoes.reduce((sum, apuracao) => sum + apuracao.processed, 0)
)

export const useTotalValue = () => useDashboardStore((state) => 
  state.apuracoes.reduce((sum, apuracao) => sum + apuracao.value, 0)
)

export const useAverageEfficiency = () => useDashboardStore((state) => 
  state.agents.length > 0 
    ? state.agents.reduce((sum, agent) => sum + agent.efficiency, 0) / state.agents.length
    : 0
)

// 🌟 INICIALIZAÇÃO AUTOMÁTICA
if (typeof window !== 'undefined') {
  // 🌟 CARREGAR DADOS INICIAIS
  setTimeout(() => {
    const store = useDashboardStore.getState()
    store.fetchAgents()
    store.fetchApuracoes()
    store.fetchSystemMetrics()
    store.checkConnectivity()
    store.connectWebSocket()
  }, 1000)
  
  // 🌟 ATUALIZAR DADOS A CADA 30 SEGUNDOS
  setInterval(() => {
    const store = useDashboardStore.getState()
    if (store.connectivity.isConnected) {
      store.fetchAgents()
      store.fetchApuracoes()
      store.fetchSystemMetrics()
    }
  }, 30000)
} 