/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 PALETA DE CORES IA - REVOLUCIONÁRIA
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Azul IA principal
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Verde sucesso
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Amarelo processando
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Vermelho alerta
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 🌟 CORES HOLOGRÁFICAS
        holographic: {
          blue: '#00d4ff',
          purple: '#7c3aed',
          pink: '#ec4899',
          cyan: '#06b6d4',
          emerald: '#10b981',
        },
        // 🎭 TEMA ESCURO FUTURÍSTICO
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Fundo escuro principal
          950: '#020617',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'display': ['Orbitron', 'monospace'], // Fonte futurística
      },
      animation: {
        // 🌊 ANIMAÇÕES HOLOGRÁFICAS
        'holographic': 'holographic 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        holographic: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 1)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backgroundImage: {
        // 🌈 GRADIENTES HOLOGRÁFICOS
        'holographic-gradient': 'linear-gradient(45deg, #00d4ff, #7c3aed, #ec4899, #06b6d4)',
        'ai-gradient': 'linear-gradient(135deg, #2563eb, #1e40af, #1e3a8a)',
        'success-gradient': 'linear-gradient(135deg, #10b981, #059669, #047857)',
        'warning-gradient': 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
        'danger-gradient': 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
        'dark-gradient': 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        // 🌟 SOMBRAS HOLOGRÁFICAS
        'holographic': '0 0 20px rgba(0, 212, 255, 0.5)',
        'holographic-lg': '0 0 40px rgba(0, 212, 255, 0.8)',
        'ai-glow': '0 0 30px rgba(37, 99, 235, 0.6)',
        'success-glow': '0 0 30px rgba(16, 185, 129, 0.6)',
        'warning-glow': '0 0 30px rgba(245, 158, 11, 0.6)',
        'danger-glow': '0 0 30px rgba(239, 68, 68, 0.6)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      }
    },
  },
  plugins: [],
}

