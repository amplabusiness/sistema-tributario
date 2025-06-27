// 🌟 SISTEMA DE MONITORAMENTO FRONTEND - PRODUÇÃO

interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

interface LogData {
  level: string
  message: string
  timestamp: string
  component?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: string
}

interface ErrorData {
  message: string
  stack?: string
  component: string
  timestamp: string
  userId?: string
  sessionId?: string
}

class FrontendMonitor {
  private sessionId: string
  private userId?: string
  private logs: LogData[] = []
  private errors: ErrorData[] = []
  private metrics: PerformanceMetric[] = []
  private isProduction: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isProduction = import.meta.env.PROD
    this.initializeMonitoring()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeMonitoring(): void {
    // 🌟 CAPTURAR ERROS GLOBAIS
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        component: 'Global',
        timestamp: new Date().toISOString()
      })
    })

    // 🌟 CAPTURAR PROMISES REJEITADAS
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        component: 'Promise',
        timestamp: new Date().toISOString()
      })
    })

    // 🌟 MONITORAR PERFORMANCE
    this.monitorPerformance()

    // 🌟 LOG DE INICIALIZAÇÃO
    this.log('info', 'Frontend Monitor initialized', 'Monitor')
  }

  // 🌟 LOGGING
  public log(level: keyof LogLevel, message: string, component?: string, metadata?: Record<string, any>): void {
    const logData: LogData = {
      level,
      message,
      timestamp: new Date().toISOString(),
      component,
      userId: this.userId,
      sessionId: this.sessionId,
      metadata
    }

    this.logs.push(logData)

    // 🌟 CONSOLE EM DESENVOLVIMENTO
    if (!this.isProduction) {
      console.log(`[${level.toUpperCase()}] ${component || 'App'}: ${message}`, metadata || '')
    }

    // 🌟 ENVIAR PARA SERVIDOR EM PRODUÇÃO
    if (this.isProduction) {
      this.sendToServer('log', logData)
    }
  }

  // 🌟 CAPTURA DE ERROS
  public captureError(errorData: Omit<ErrorData, 'sessionId' | 'userId'>): void {
    const fullErrorData: ErrorData = {
      ...errorData,
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.errors.push(fullErrorData)

    // 🌟 CONSOLE EM DESENVOLVIMENTO
    if (!this.isProduction) {
      console.error(`[ERROR] ${errorData.component}: ${errorData.message}`, errorData.stack || '')
    }

    // 🌟 ENVIAR PARA SERVIDOR EM PRODUÇÃO
    if (this.isProduction) {
      this.sendToServer('error', fullErrorData)
    }
  }

  // 🌟 MÉTRICAS DE PERFORMANCE
  public captureMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString()
    }

    this.metrics.push(metric)

    // 🌟 ENVIAR PARA SERVIDOR EM PRODUÇÃO
    if (this.isProduction) {
      this.sendToServer('metric', metric)
    }
  }

  // 🌟 MONITORAMENTO DE PERFORMANCE
  private monitorPerformance(): void {
    // 🌟 PERFORMANCE DE CARREGAMENTO
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (perfData) {
          this.captureMetric('page_load_time', perfData.loadEventEnd - perfData.loadEventStart)
          this.captureMetric('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
          this.captureMetric('first_paint', perfData.responseStart - perfData.requestStart)
        }
      })
    }

    // 🌟 MONITORAR INTERAÇÕES
    this.monitorUserInteractions()
  }

  // 🌟 MONITORAMENTO DE INTERAÇÕES
  private monitorUserInteractions(): void {
    let lastInteraction = Date.now()

    // 🌟 DETECTAR INATIVIDADE
    const events = ['click', 'scroll', 'keypress', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, () => {
        lastInteraction = Date.now()
      })
    })

    // 🌟 REPORTAR INATIVIDADE A CADA 5 MINUTOS
    setInterval(() => {
      const inactiveTime = Date.now() - lastInteraction
      if (inactiveTime > 300000) { // 5 minutos
        this.log('info', `User inactive for ${Math.round(inactiveTime / 1000)}s`, 'UserActivity')
      }
    }, 300000)
  }

  // 🌟 ENVIAR DADOS PARA SERVIDOR
  private async sendToServer(type: 'log' | 'error' | 'metric', data: any): Promise<void> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.conttatax.com.br'
      
      await fetch(`${apiUrl}/monitoring/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      // 🌟 FALLBACK: SALVAR LOCALMENTE
      this.saveLocally(type, data)
    }
  }

  // 🌟 SALVAMENTO LOCAL COMO FALLBACK
  private saveLocally(type: string, data: any): void {
    try {
      const key = `monitoring_${type}_${Date.now()}`
      localStorage.setItem(key, JSON.stringify(data))
      
      // 🌟 LIMPAR DADOS ANTIGOS (manter só últimos 100)
      const keys = Object.keys(localStorage).filter(k => k.startsWith('monitoring_'))
      if (keys.length > 100) {
        keys.slice(0, keys.length - 100).forEach(k => localStorage.removeItem(k))
      }
    } catch (error) {
      console.warn('Failed to save monitoring data locally:', error)
    }
  }

  // 🌟 SETAR USUÁRIO
  public setUser(userId: string): void {
    this.userId = userId
    this.log('info', `User session started: ${userId}`, 'Auth')
  }

  // 🌟 OBTER ESTATÍSTICAS
  public getStats(): {
    totalLogs: number
    totalErrors: number
    totalMetrics: number
    sessionId: string
    userId?: string
  } {
    return {
      totalLogs: this.logs.length,
      totalErrors: this.errors.length,
      totalMetrics: this.metrics.length,
      sessionId: this.sessionId,
      userId: this.userId
    }
  }

  // 🌟 EXPORTAR DADOS PARA DEBUG
  public exportData(): {
    logs: LogData[]
    errors: ErrorData[]
    metrics: PerformanceMetric[]
  } {
    return {
      logs: [...this.logs],
      errors: [...this.errors],
      metrics: [...this.metrics]
    }
  }
}

// 🌟 INSTÂNCIA GLOBAL
export const monitor = new FrontendMonitor()

// 🌟 HELPERS PARA USO FÁCIL
export const logInfo = (message: string, component?: string, metadata?: Record<string, any>) => {
  monitor.log('info', message, component, metadata)
}

export const logWarn = (message: string, component?: string, metadata?: Record<string, any>) => {
  monitor.log('warn', message, component, metadata)
}

export const logError = (message: string, component?: string, metadata?: Record<string, any>) => {
  monitor.log('error', message, component, metadata)
}

export const captureError = (error: Error, component: string) => {
  monitor.captureError({
    message: error.message,
    stack: error.stack,
    component,
    timestamp: new Date().toISOString()
  })
}

export const captureMetric = (name: string, value: number, unit?: string) => {
  monitor.captureMetric(name, value, unit)
}

export const setUser = (userId: string) => {
  monitor.setUser(userId)
}

export const getMonitoringStats = () => {
  return monitor.getStats()
}

export default monitor 