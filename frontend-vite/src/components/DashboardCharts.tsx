import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  Zap,
  Brain,
  Target
} from 'lucide-react'

// 🌟 TIPOS PARA OS GRÁFICOS
interface ChartData {
  label: string
  value: number
  color: string
  percentage: number
}

interface ChartProps {
  data: ChartData[]
  title: string
  type: 'bar' | 'pie' | 'line'
  height?: number
}

// 🌟 COMPONENTE DE GRÁFICO DE BARRAS 3D
const BarChart3D: React.FC<ChartProps> = ({ data, title, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 🌟 CONFIGURAÇÃO DO CANVAS
    canvas.width = canvas.offsetWidth * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    // 🌟 LIMPAR CANVAS
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 🌟 DIMENSÕES
    const width = canvas.offsetWidth
    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = (width - 40) / data.length - 10
    const barMaxHeight = height - 60

    // 🌟 DESENHAR GRÁFICO
    data.forEach((item, index) => {
      const x = 20 + index * (barWidth + 10)
      const barHeight = (item.value / maxValue) * barMaxHeight
      const y = height - 40 - barHeight

      // 🌟 SOMBRA 3D
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(x + 3, y + 3, barWidth, barHeight)

      // 🌟 BARRA PRINCIPAL
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      gradient.addColorStop(0, item.color)
      gradient.addColorStop(1, item.color + '80')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // 🌟 BORDA HOLOGRÁFICA
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, barWidth, barHeight)

      // 🌟 VALOR
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10)

      // 🌟 LABEL
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Inter'
      ctx.fillText(item.label, x + barWidth / 2, height - 20)
    })
  }, [data, height])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holographic-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <BarChart3 className="w-5 h-5 text-holographic-blue" />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </motion.div>
  )
}

// 🌟 COMPONENTE DE GRÁFICO PIZZA 3D
const PieChart3D: React.FC<ChartProps> = ({ data, title, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 🌟 CONFIGURAÇÃO DO CANVAS
    canvas.width = canvas.offsetWidth * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    // 🌟 LIMPAR CANVAS
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 🌟 DIMENSÕES
    const centerX = canvas.offsetWidth / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    // 🌟 CALCULAR TOTAL
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // 🌟 DESENHAR GRÁFICO PIZZA
    let currentAngle = -Math.PI / 2

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      // 🌟 DESENHAR FATIA
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()

      // 🌟 GRADIENTE
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )
      gradient.addColorStop(0, item.color + 'ff')
      gradient.addColorStop(1, item.color + '80')
      ctx.fillStyle = gradient
      ctx.fill()

      // 🌟 BORDA HOLOGRÁFICA
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2
      ctx.stroke()

      // 🌟 LABEL
      const labelAngle = currentAngle + sliceAngle / 2
      const labelRadius = radius + 20
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Inter'
      ctx.textAlign = 'center'
      ctx.fillText(item.label, labelX, labelY)

      // 🌟 PERCENTUAL
      const percentRadius = radius + 35
      const percentX = centerX + Math.cos(labelAngle) * percentRadius
      const percentY = centerY + Math.sin(labelAngle) * percentRadius

      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Inter'
      ctx.fillText(`${item.percentage.toFixed(1)}%`, percentX, percentY)

      currentAngle += sliceAngle
    })
  }, [data, height])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="holographic-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <PieChart className="w-5 h-5 text-holographic-blue" />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </motion.div>
  )
}

// 🌟 COMPONENTE DE MÉTRICAS EM TEMPO REAL
const RealTimeMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Processamento',
      value: '98.5%',
      icon: Activity,
      color: 'text-success-400',
      trend: 'up'
    },
    {
      title: 'Eficiência IA',
      value: '96.2%',
      icon: Brain,
      color: 'text-holographic-blue',
      trend: 'up'
    },
    {
      title: 'Precisão',
      value: '99.1%',
      icon: Target,
      color: 'text-warning-400',
      trend: 'up'
    },
    {
      title: 'Velocidade',
      value: '2.3s',
      icon: Zap,
      color: 'text-primary-400',
      trend: 'down'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-lg border border-gray-600/30 hover:border-holographic-blue/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{metric.title}</p>
              <p className="text-xl font-bold text-white">{metric.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-800/50">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </div>
          
          <div className="flex items-center mt-2">
            <TrendingUp 
              className={`w-4 h-4 mr-1 ${
                metric.trend === 'up' ? 'text-success-400' : 'text-danger-400'
              }`} 
            />
            <span className={`text-xs ${
              metric.trend === 'up' ? 'text-success-400' : 'text-danger-400'
            }`}>
              {metric.trend === 'up' ? '+2.1%' : '-0.5%'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// 🌟 COMPONENTE PRINCIPAL DE GRÁFICOS
const DashboardCharts: React.FC = () => {
  // 🌟 DADOS PARA OS GRÁFICOS
  const barChartData: ChartData[] = [
    { label: 'ICMS', value: 45000, color: '#10b981', percentage: 35.2 },
    { label: 'PIS', value: 18000, color: '#3b82f6', percentage: 14.1 },
    { label: 'COFINS', value: 32000, color: '#f59e0b', percentage: 25.0 },
    { label: 'IRPJ', value: 25000, color: '#ef4444', percentage: 19.5 },
    { label: 'CSLL', value: 15000, color: '#8b5cf6', percentage: 11.7 },
    { label: 'IPI', value: 8000, color: '#06b6d4', percentage: 6.3 }
  ]

  const pieChartData: ChartData[] = [
    { label: 'Concluído', value: 75, color: '#10b981', percentage: 75 },
    { label: 'Processando', value: 20, color: '#f59e0b', percentage: 20 },
    { label: 'Erro', value: 5, color: '#ef4444', percentage: 5 }
  ]

  return (
    <div className="space-y-6">
      {/* 🌟 MÉTRICAS EM TEMPO REAL */}
      <RealTimeMetrics />

      {/* 🌟 GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart3D
          data={barChartData}
          title="Apurações por Imposto (R$)"
          type="bar"
          height={300}
        />
        
        <PieChart3D
          data={pieChartData}
          title="Status do Processamento"
          type="pie"
          height={300}
        />
      </div>
    </div>
  )
}

export default DashboardCharts 