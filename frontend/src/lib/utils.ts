import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação brasileira de valores monetários
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Formatação brasileira de percentuais
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

// Formatação brasileira de datas
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Formatação brasileira de números
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Formatação de CNPJ
export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

// Formatação de CPF
export function formatCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

// Formatação de telefone
export function formatPhone(phone: string): string {
  return phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
}

// Formatação de CEP
export function formatCEP(cep: string): string {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

// Validação de CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  if (cleanCNPJ.length !== 14) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  let weight = 2
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  sum = 0
  weight = 2
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return parseInt(cleanCNPJ[12]) === digit1 && parseInt(cleanCNPJ[13]) === digit2
}

// Validação de CPF
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/[^\d]/g, '')
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i)
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i)
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return parseInt(cleanCPF[9]) === digit1 && parseInt(cleanCPF[10]) === digit2
}

// Cores para gráficos fiscais
export const chartColors = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#16a34a',
  warning: '#ea580c',
  danger: '#dc2626',
  info: '#0891b2',
  light: '#f1f5f9',
  dark: '#1e293b',
}

// Status colors
export const statusColors = {
  success: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
} 