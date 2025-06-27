import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Layout from './components/Layout'
import { logInfo, captureError, captureMetric } from './utils/monitoring'
import './App.css'

// 🌟 CLIENTE REACT QUERY PARA CACHE INTELIGENTE
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

function App() {
  // 🌟 MONITORAMENTO DE INICIALIZAÇÃO
  React.useEffect(() => {
    logInfo('Application started', 'App')
    
    // 🌟 CAPTURAR MÉTRICAS DE INICIALIZAÇÃO
    const startTime = performance.now()
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime
      captureMetric('app_initialization', loadTime)
      logInfo(`App initialized in ${loadTime.toFixed(2)}ms`, 'App')
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleLoad)
    } else {
      handleLoad()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleLoad)
    }
  }, [])

  // 🌟 CAPTURAR ERROS DE RENDERIZAÇÃO
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      captureError(new Error(error.message), 'App')
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          {/* 🌟 TOASTER PARA NOTIFICAÇÕES */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* 🎯 ROTAS PRINCIPAIS */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* 🚀 FUTURAS ROTAS */}
            {/* <Route path="/upload" element={<Upload />} /> */}
            {/* <Route path="/reports" element={<Reports />} /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
