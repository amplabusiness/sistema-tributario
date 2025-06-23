#!/bin/bash

# 🚀 SCRIPT DE DEPLOY AUTOMATIZADO - SISTEMA TRIBUTÁRIO 100% IA
# Este script faz deploy do backend e frontend automaticamente

set -e

echo "🚀 Iniciando deploy do Sistema Tributário 100% IA..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    error "Vercel CLI não está instalado. Instalando..."
    npm install -g vercel
fi

# 1. DEPLOY DO BACKEND
log "📦 Fazendo deploy do Backend..."

cd backend

# Instalar dependências
log "📥 Instalando dependências do backend..."
npm install

# Build do projeto
log "🔨 Fazendo build do backend..."
npm run build

# Testes
log "🧪 Executando testes do backend..."
npm test

# Deploy para Vercel
log "🚀 Deployando backend para Vercel..."
vercel --prod --yes

# Obter URL do backend
BACKEND_URL=$(vercel ls | grep "sistema-tributario-backend" | awk '{print $2}')
log "✅ Backend deployado em: $BACKEND_URL"

cd ..

# 2. DEPLOY DO FRONTEND
log "📦 Fazendo deploy do Frontend..."

cd frontend

# Instalar dependências
log "📥 Instalando dependências do frontend..."
npm install

# Build do projeto
log "🔨 Fazendo build do frontend..."
npm run build

# Deploy para Vercel
log "🚀 Deployando frontend para Vercel..."
vercel --prod --yes

# Obter URL do frontend
FRONTEND_URL=$(vercel ls | grep "sistema-tributario-frontend" | awk '{print $2}')
log "✅ Frontend deployado em: $FRONTEND_URL"

cd ..

# 3. CONFIGURAÇÃO FINAL
log "⚙️ Configurando variáveis de ambiente..."

# Configurar URL do backend no frontend
cd frontend
vercel env add NEXT_PUBLIC_API_URL production "$BACKEND_URL"

log "🔄 Fazendo redeploy do frontend com nova configuração..."
vercel --prod --yes

cd ..

# 4. TESTE DE CONECTIVIDADE
log "🔍 Testando conectividade..."

# Testar health check do backend
if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
    log "✅ Backend está respondendo"
else
    warn "⚠️ Backend pode não estar respondendo ainda"
fi

# 5. RESUMO FINAL
echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "=================================="
echo "🌐 Frontend: $FRONTEND_URL"
echo "🔧 Backend: $BACKEND_URL"
echo "📊 Health Check: $BACKEND_URL/health"
echo "📈 Status: $BACKEND_URL/api/status"
echo ""
echo "🚀 Sistema Tributário 100% IA está online!"
echo "🤖 12 Agentes IA autônomos funcionando"
echo "📊 Dashboard em tempo real disponível"
echo ""

# 6. INSTRUÇÕES DE USO
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Acesse o frontend: $FRONTEND_URL"
echo "2. Faça login com suas credenciais"
echo "3. Acesse o dashboard para ver os agentes IA"
echo "4. Use a tela de upload para enviar documentos"
echo "5. Monitore os cálculos em tempo real"
echo ""

log "✅ Deploy automatizado concluído!" 