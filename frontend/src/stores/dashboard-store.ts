import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface KPIMetric {
  nome: string
  valor: number
  unidade: string
  tendencia: 'crescente' | 'decrescente' | 'estavel'
  variacao: number
  meta: number
  status: 'acima' | 'abaixo' | 'dentro'
}

interface ChartData {
  label: string
  value: number
  color?: string
  percentual?: number
}

interface DashboardData {
  resumo: {
    totalDocumentos: number
    valorTotalOperacoes: number
    icmsDevido: number
    pisDevido: number
    cofinsDevido: number
    irpjDevido: number
    csllDevido: number
    estoqueValor: number
    margemMedia: number
    rentabilidadeMedia: number
  }
  graficos: {
    vendasPorPeriodo: ChartData[]
    impostosPorTipo: ChartData[]
    margemPorProduto: ChartData[]
    estoquePorCategoria: ChartData[]
    tendencias: ChartData[]
  }
  metricas: {
    kpis: KPIMetric[]
    indicadores: any[]
    comparativos: any[]
  }
  alertas: any[]
}

interface DashboardState {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  periodo: string
  empresaId: string | null
}

interface DashboardActions {
  fetchDashboard: (empresaId: string, periodo: string) => Promise<void>
  setPeriodo: (periodo: string) => void
  setEmpresaId: (empresaId: string) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type DashboardStore = DashboardState & DashboardActions

export const useDashboardStore = create<DashboardStore>()(
  immer((set, get) => ({
    // State
    data: null,
    isLoading: false,
    error: null,
    periodo: '01/2024',
    empresaId: null,

    // Actions
    fetchDashboard: async (empresaId: string, periodo: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await fetch(`/api/dashboard?empresaId=${empresaId}&periodo=${periodo}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar dashboard')
        }

        set((state) => {
          state.data = data.data.dashboard
          state.isLoading = false
          state.error = null
        })
      } catch (error) {
        set((state) => {
          state.isLoading = false
          state.error = error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    },

    setPeriodo: (periodo: string) => {
      set((state) => {
        state.periodo = periodo
      })
    },

    setEmpresaId: (empresaId: string) => {
      set((state) => {
        state.empresaId = empresaId
      })
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading
      })
    },
  }))
) 