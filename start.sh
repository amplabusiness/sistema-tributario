#!/bin/bash

# 🚀 SCRIPT DE INICIALIZAÇÃO AUTOMÁTICA 100% IA
# Sistema Tributário 100% IA

echo "🚀 Iniciando Sistema Tributário 100% IA..."

# Navegar para o diretório do projeto
cd "$(dirname "$0")"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Executar automação mestre
echo "🤖 Executando automação 100% IA..."
node scripts/master-automation.js

echo "✅ Sistema iniciado com sucesso!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
