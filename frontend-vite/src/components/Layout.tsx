import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Brain, 
  BarChart3, 
  Upload, 
  Settings, 
  LogOut,
  Home,
  FileText,
  Calculator,
  Database,
  Activity
} from 'lucide-react'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: Calculator, label: 'Apurações', path: '/calculations' },
    { icon: Database, label: 'Relatórios', path: '/reports' },
    { icon: Activity, label: 'Monitoramento', path: '/monitoring' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ]

  return (
    <div className="flex h-screen bg-dark-900">
      {/* 🌟 SIDEBAR HOLOGRÁFICA */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 holographic-card"
          >
            <div className="flex flex-col h-full">
              {/* 🧠 LOGO IA */}
              <div className="flex items-center justify-center h-16 border-b border-holographic-blue/20">
                <div className="flex items-center space-x-2">
                  <Brain className="w-8 h-8 text-holographic-blue animate-pulse" />
                  <span className="text-xl font-display font-bold text-gradient">
                    IA Tributário
                  </span>
                </div>
              </div>

              {/* 📋 MENU NAVEGAÇÃO */}
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-holographic-blue/10 transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* 👤 USUÁRIO */}
              <div className="p-4 border-t border-holographic-blue/20">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-bold">S</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Sérgio Carneiro</p>
                    <p className="text-xs text-gray-400">CEO Técnico</p>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 OVERLAY PARA MOBILE */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🎯 CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* 🌟 HEADER HOLOGRÁFICO */}
        <header className="h-16 holographic-card flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-holographic-blue/10 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
            
            <div className="hidden lg:flex items-center space-x-2">
              <Brain className="w-6 h-6 text-holographic-blue" />
              <span className="text-lg font-display font-bold text-gradient">
                Sistema Tributário 100% IA
              </span>
            </div>
          </div>

          {/* 🌟 STATUS DOS AGENTES IA */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-2 h-2 rounded-full bg-success-500 animate-pulse"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-300">12 Agentes Ativos</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-success-500/20 border border-success-500/30">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-sm text-success-400 font-medium">Sistema Online</span>
            </div>
          </div>
        </header>

        {/* 📊 CONTEÚDO DINÂMICO */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 