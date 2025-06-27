@echo off
REM 🚀 SCRIPT DE INICIALIZAÇÃO AUTOMÁTICA 100% IA - WINDOWS
REM Sistema Tributário 100% IA

echo 🚀 Iniciando Sistema Tributário 100%% IA...

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instalando...
    powershell -Command "& { iwr https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi -OutFile nodejs.msi }"
    msiexec /i nodejs.msi /quiet
    del nodejs.msi
)

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
)

REM Executar automação mestre
echo 🤖 Executando automação 100%% IA...
node scripts\master-automation.js

echo ✅ Sistema iniciado com sucesso!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001

pause
