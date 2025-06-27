// 🌟 SERVIÇO DE API - INTEGRAÇÃO COM BACKEND 100% IA

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { logInfo, logError, captureError } from '../utils/monitoring'

// 🌟 TIPOS PARA INTEGRAÇÃO
interface AgentStatus {
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

interface ApuracaoStatus {
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

interface SystemMetrics {
  totalAgents: number
  activeAgents: number
  totalDocuments: number
  totalValue: number
  systemUptime: number
  averageEfficiency: number
  lastBackup: string
  databaseStatus: 'healthy' | 'warning' | 'error'
}

interface AuthResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user' | 'viewer'
  }
  expiresIn: number
}

// 🌟 CONFIGURAÇÃO DA API
class APIService {
  private api: AxiosInstance
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 5000

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'https://api.conttatax.com.br'
    
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // 🌟 INTERCEPTORS PARA LOGS E MONITORAMENTO
    this.setupInterceptors()
    
    logInfo('API Service initialized', 'APIService', { baseURL })
  }

  private setupInterceptors(): void {
    // 🌟 REQUEST INTERCEPTOR
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        logInfo(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 'APIService')
        return config
      },
      (error) => {
        logError('API Request Error', 'APIService', { error: error.message })
        return Promise.reject(error)
      }
    )

    // 🌟 RESPONSE INTERCEPTOR
    this.api.interceptors.response.use(
      (response) => {
        logInfo(`API Response: ${response.status} ${response.config.url}`, 'APIService')
        return response
      },
      async (error) => {
        if (error.response?.status === 401) {
          // 🌟 TOKEN EXPIRADO - TENTAR REFRESH
          const refreshed = await this.refreshToken()
          if (refreshed) {
            // 🌟 RETRY REQUEST
            const originalRequest = error.config
            originalRequest.headers.Authorization = `Bearer ${this.getToken()}`
            return this.api(originalRequest)
          }
        }
        
        logError('API Response Error', 'APIService', { 
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        })
        return Promise.reject(error)
      }
    )
  }

  // 🌟 AUTENTICAÇÃO
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password
      })
      
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
      
      logInfo('Login successful', 'APIService', { user: response.data.user.email })
      return response.data
    } catch (error) {
      captureError(error as Error, 'APIService')
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout')
      this.clearTokens()
      this.disconnectWebSocket()
      
      logInfo('Logout successful', 'APIService')
    } catch (error) {
      logError('Logout error', 'APIService', { error: (error as Error).message })
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false

      const response = await this.api.post<AuthResponse>('/auth/refresh', {
        refreshToken
      })
      
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
      
      logInfo('Token refreshed successfully', 'APIService')
      return true
    } catch (error) {
      logError('Token refresh failed', 'APIService', { error: (error as Error).message })
      this.clearTokens()
      return false
    }
  }

  // 🌟 AGENTES IA
  async getAgentsStatus(): Promise<AgentStatus[]> {
    try {
      const response = await this.api.get<AgentStatus[]>('/agents/status')
      return response.data
    } catch (error) {
      logError('Failed to fetch agents status', 'APIService', { error: (error as Error).message })
      throw error
    }
  }

  async getAgentDetails(agentId: number): Promise<AgentStatus> {
    try {
      const response = await this.api.get<AgentStatus>(`/agents/${agentId}`)
      return response.data
    } catch (error) {
      logError('Failed to fetch agent details', 'APIService', { agentId, error: (error as Error).message })
      throw error
    }
  }

  async restartAgent(agentId: number): Promise<void> {
    try {
      await this.api.post(`/agents/${agentId}/restart`)
      logInfo('Agent restarted', 'APIService', { agentId })
    } catch (error) {
      logError('Failed to restart agent', 'APIService', { agentId, error: (error as Error).message })
      throw error
    }
  }

  // 🌟 APURAÇÕES
  async getApuracoesStatus(): Promise<ApuracaoStatus[]> {
    try {
      const response = await this.api.get<ApuracaoStatus[]>('/apuracoes/status')
      return response.data
    } catch (error) {
      logError('Failed to fetch apuracoes status', 'APIService', { error: (error as Error).message })
      throw error
    }
  }

  async getApuracaoDetails(type: string): Promise<ApuracaoStatus> {
    try {
      const response = await this.api.get<ApuracaoStatus>(`/apuracoes/${type}`)
      return response.data
    } catch (error) {
      logError('Failed to fetch apuracao details', 'APIService', { type, error: (error as Error).message })
      throw error
    }
  }

  // 🌟 MÉTRICAS DO SISTEMA
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await this.api.get<SystemMetrics>('/system/metrics')
      return response.data
    } catch (error) {
      logError('Failed to fetch system metrics', 'APIService', { error: (error as Error).message })
      throw error
    }
  }

  // 🌟 WEBSOCKET PARA TEMPO REAL
  connectWebSocket(onMessage: (data: any) => void): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.conttatax.com.br/ws'
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        logInfo('WebSocket connected', 'APIService')
        this.reconnectAttempts = 0
        
        // 🌟 AUTENTICAR WEBSOCKET
        const token = this.getToken()
        if (token) {
          this.ws?.send(JSON.stringify({ type: 'auth', token }))
        }
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          logError('WebSocket message parse error', 'APIService', { error: (error as Error).message })
        }
      }
      
      this.ws.onclose = () => {
        logInfo('WebSocket disconnected', 'APIService')
        this.attemptReconnect(onMessage)
      }
      
      this.ws.onerror = (error) => {
        logError('WebSocket error', 'APIService', { error: error.toString() })
      }
      
    } catch (error) {
      logError('Failed to connect WebSocket', 'APIService', { error: (error as Error).message })
    }
  }

  private attemptReconnect(onMessage: (data: any) => void): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      logInfo(`Attempting WebSocket reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`, 'APIService')
      
      setTimeout(() => {
        this.connectWebSocket(onMessage)
      }, this.reconnectInterval)
    } else {
      logError('Max WebSocket reconnection attempts reached', 'APIService')
    }
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      logInfo('WebSocket disconnected manually', 'APIService')
    }
  }

  // 🌟 GESTÃO DE TOKENS
  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token)
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  // 🌟 VERIFICAÇÃO DE CONECTIVIDADE
  async checkConnectivity(): Promise<boolean> {
    try {
      await this.api.get('/health')
      return true
    } catch (error) {
      logError('Connectivity check failed', 'APIService', { error: (error as Error).message })
      return false
    }
  }

  // 🌟 DESTRUCTOR
  destroy(): void {
    this.disconnectWebSocket()
    this.clearTokens()
    logInfo('API Service destroyed', 'APIService')
  }
}

// 🌟 INSTÂNCIA GLOBAL
export const apiService = new APIService()

// 🌟 HELPERS PARA USO FÁCIL
export const login = (email: string, password: string) => apiService.login(email, password)
export const logout = () => apiService.logout()
export const getAgentsStatus = () => apiService.getAgentsStatus()
export const getApuracoesStatus = () => apiService.getApuracoesStatus()
export const getSystemMetrics = () => apiService.getSystemMetrics()
export const connectWebSocket = (onMessage: (data: any) => void) => apiService.connectWebSocket(onMessage)
export const checkConnectivity = () => apiService.checkConnectivity()

export default apiService 