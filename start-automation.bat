@echo off
REM 🚀 SISTEMA TRIBUTÁRIO 100% IA - INICIALIZAÇÃO AUTOMÁTICA
REM Script de inicialização completa para Windows

echo.
echo ========================================
echo 🚀 SISTEMA TRIBUTÁRIO 100% IA
echo ========================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📦 Instalando Node.js...
    powershell -Command "& { iwr https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi -OutFile nodejs.msi }"
    msiexec /i nodejs.msi /quiet
    del nodejs.msi
    echo ✅ Node.js instalado!
) else (
    echo ✅ Node.js encontrado!
)

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Instalando dependências do backend...
    cd backend
    npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Instalando dependências do frontend...
    cd frontend
    npm install
    cd ..
)

echo.
echo 🔧 Executando correção automática de imports...
node scripts\auto-fix-imports.js

echo.
echo 🚀 Iniciando sistema completo...
echo.

REM Iniciar o gerenciador de processos
start "Gerenciador de Processos" node scripts\process-manager.js

REM Aguardar um pouco
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo.
echo 📊 Monitoramento ativo
echo 🛑 Pressione qualquer tecla para parar
echo.

pause >nul

REM Parar todos os processos
taskkill /f /im node.exe >nul 2>&1

echo.
echo 🛑 Sistema parado!
echo. 