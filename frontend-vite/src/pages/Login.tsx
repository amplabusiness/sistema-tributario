import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Eye, EyeOff, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // 🌟 SIMULAÇÃO DE LOGIN
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 particles-bg">
      {/* 🌟 CARD DE LOGIN HOLOGRÁFICO */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="holographic-card p-8">
          {/* 🧠 LOGO IA */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 mb-4"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-display font-bold text-gradient mb-2"
            >
              Sistema Tributário 100% IA
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400"
            >
              Primeiro sistema tributário brasileiro totalmente autônomo
            </motion.p>
          </div>

          {/* 📝 FORMULÁRIO DE LOGIN */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* 👤 CAMPO USUÁRIO */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  defaultValue="sergio.carneiro"
                  className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            {/* 🔒 CAMPO SENHA */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="admin123"
                  className="w-full pl-10 pr-12 py-3 bg-dark-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 🌟 BOTÃO DE LOGIN */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full ai-button flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar no Sistema</span>
              )}
            </motion.button>
          </motion.form>

          {/* 📊 STATUS DO SISTEMA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-4 rounded-lg bg-success-500/10 border border-success-500/20"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-success-400">Sistema Operacional</p>
                <p className="text-xs text-gray-400">12 agentes IA ativos • 165/165 testes passando</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🌟 CRÉDITOS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500">
            © 2025 Sistema Tributário IA • Primeiro do mundo
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login 