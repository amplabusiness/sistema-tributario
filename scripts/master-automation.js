#!/usr/bin/env node

/**
 * 🚀 SCRIPT MESTRE DE AUTOMAÇÃO 100% IA
 * Sistema Tributário 100% IA - Orquestrador Principal
 * 
 * Este script coordena todos os agentes de automação:
 * - Correção automática de imports
 * - Gerenciamento de processos
 * - Pipeline CI/CD
 * - Monitoramento contínuo
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class MasterAutomation {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.logFile = path.join(this.projectRoot, 'logs/master-automation.log');
    this.agents = new Map();
    this.isRunning = false;
    
    // Garantir que o diretório de logs existe
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    const logMessage = `[${timestamp}] [MASTER-${type.toUpperCase()}] ${message}`;
    console.log(`${colors[type]}${logMessage}${colors.reset}`);
    
    // Salvar no arquivo de log
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async runScript(scriptName, args = []) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, scriptName);
      
      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Script não encontrado: ${scriptName}`));
        return;
      }
      
      this.log(`🚀 Executando script: ${scriptName}`, 'info');
      
      const child = spawn('node', [scriptPath, ...args], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        shell: true
      });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
        process.stderr.write(data);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          this.log(`✅ Script ${scriptName} executado com sucesso`, 'success');
          resolve({ success: true, output, errorOutput });
        } else {
          this.log(`❌ Script ${scriptName} falhou com código ${code}`, 'error');
          reject(new Error(`Script ${scriptName} falhou: ${errorOutput}`));
        }
      });
      
      child.on('error', (error) => {
        this.log(`💥 Erro ao executar script ${scriptName}: ${error.message}`, 'error');
        reject(error);
      });
    });
  }

  async fixImports() {
    this.log('🔧 FASE 1: Correção Automática de Imports', 'info');
    
    try {
      await this.runScript('auto-fix-imports.js');
      this.log('✅ Correção de imports concluída!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro na correção de imports: ${error.message}`, 'error');
      return false;
    }
  }

  async startProcessManager() {
    this.log('🚀 FASE 2: Iniciando Gerenciador de Processos', 'info');
    
    try {
      const processManager = spawn('node', [path.join(__dirname, 'process-manager.js')], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        shell: true
      });
      
      this.agents.set('processManager', processManager);
      
      // Aguardar um pouco para o processo inicializar
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      this.log('✅ Gerenciador de processos iniciado!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro ao iniciar gerenciador de processos: ${error.message}`, 'error');
      return false;
    }
  }

  async runDeployPipeline() {
    this.log('🚀 FASE 3: Executando Pipeline CI/CD', 'info');
    
    try {
      await this.runScript('auto-deploy.js');
      this.log('✅ Pipeline CI/CD concluído!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro no pipeline CI/CD: ${error.message}`, 'error');
      return false;
    }
  }

  async setupContinuousMonitoring() {
    this.log('📊 FASE 4: Configurando Monitoramento Contínuo', 'info');
    
    try {
      // Criar script de monitoramento contínuo
      const monitoringScript = `
const ProcessManager = require('./process-manager');
const AutoDeploy = require('./auto-deploy');

class ContinuousMonitoring {
  constructor() {
    this.processManager = new ProcessManager();
    this.autoDeploy = new AutoDeploy();
    this.checkInterval = 300000; // 5 minutos
  }

  async start() {
    console.log('🔍 Iniciando monitoramento contínuo...');
    
    // Verificar status a cada 5 minutos
    setInterval(async () => {
      try {
        const status = this.processManager.getStatus();
        console.log('📊 Status atual:', status);
        
        // Se algum processo falhou, tentar reiniciar
        Object.entries(status.processes).forEach(([name, info]) => {
          if (!info.running) {
            console.log(\`🔄 Tentando reiniciar \${name}...\`);
            if (name === 'backend') {
              this.processManager.startBackend();
            } else if (name === 'frontend') {
              this.processManager.startFrontend();
            }
          }
        });
        
      } catch (error) {
        console.error('❌ Erro no monitoramento:', error.message);
      }
    }, this.checkInterval);
  }
}

const monitoring = new ContinuousMonitoring();
monitoring.start();
`;

      const monitoringPath = path.join(__dirname, 'continuous-monitoring.js');
      fs.writeFileSync(monitoringPath, monitoringScript);
      
      // Iniciar monitoramento em background
      const monitoringProcess = spawn('node', [monitoringPath], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        shell: true
      });
      
      this.agents.set('monitoring', monitoringProcess);
      
      this.log('✅ Monitoramento contínuo configurado!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro ao configurar monitoramento: ${error.message}`, 'error');
      return false;
    }
  }

  async createStartupScript() {
    this.log('📝 FASE 5: Criando Script de Inicialização', 'info');
    
    try {
      const startupScript = `#!/bin/bash

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
`;

      const startupPath = path.join(this.projectRoot, 'start.sh');
      fs.writeFileSync(startupPath, startupScript);
      
      // Tornar executável (Linux/Mac)
      if (process.platform !== 'win32') {
        fs.chmodSync(startupPath, '755');
      }
      
      this.log('✅ Script de inicialização criado!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro ao criar script de inicialização: ${error.message}`, 'error');
      return false;
    }
  }

  async createWindowsStartupScript() {
    this.log('📝 FASE 5.1: Criando Script de Inicialização Windows', 'info');
    
    try {
      const startupScript = `@echo off
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
node scripts\\master-automation.js

echo ✅ Sistema iniciado com sucesso!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001

pause
`;

      const startupPath = path.join(this.projectRoot, 'start.bat');
      fs.writeFileSync(startupPath, startupScript);
      
      this.log('✅ Script de inicialização Windows criado!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro ao criar script Windows: ${error.message}`, 'error');
      return false;
    }
  }

  async generateAutomationReport() {
    this.log('📊 Gerando relatório de automação...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      phases: {
        importsFixed: false,
        processManagerStarted: false,
        deployPipelineCompleted: false,
        monitoringConfigured: false,
        startupScriptsCreated: false
      },
      agents: Array.from(this.agents.keys()),
      status: 'running'
    };
    
    // Salvar relatório
    const reportPath = path.join(this.projectRoot, 'logs/automation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log('📊 Relatório de automação salvo!', 'success');
    return report;
  }

  async executeFullAutomation() {
    this.log('🚀 INICIANDO AUTOMAÇÃO COMPLETA 100% IA', 'info');
    this.log('=' * 60, 'info');
    
    const startTime = Date.now();
    this.isRunning = true;
    
    try {
      // FASE 1: Correção de Imports
      const importsFixed = await this.fixImports();
      if (!importsFixed) {
        throw new Error('Falha na correção de imports');
      }
      
      // FASE 2: Gerenciador de Processos
      const processManagerStarted = await this.startProcessManager();
      if (!processManagerStarted) {
        throw new Error('Falha ao iniciar gerenciador de processos');
      }
      
      // FASE 3: Pipeline CI/CD
      const deployCompleted = await this.runDeployPipeline();
      if (!deployCompleted) {
        this.log('⚠️ Pipeline CI/CD falhou, mas continuando...', 'warning');
      }
      
      // FASE 4: Monitoramento Contínuo
      const monitoringConfigured = await this.setupContinuousMonitoring();
      if (!monitoringConfigured) {
        this.log('⚠️ Monitoramento falhou, mas continuando...', 'warning');
      }
      
      // FASE 5: Scripts de Inicialização
      const startupScriptsCreated = await this.createStartupScript() && 
                                   await this.createWindowsStartupScript();
      if (!startupScriptsCreated) {
        this.log('⚠️ Scripts de inicialização falharam, mas continuando...', 'warning');
      }
      
      // Gerar relatório final
      const report = await this.generateAutomationReport();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      this.log('=' * 60, 'info');
      this.log('🎉 AUTOMAÇÃO COMPLETA CONCLUÍDA COM SUCESSO!', 'success');
      this.log(`⏱️ Duração total: ${duration} segundos`, 'info');
      this.log('📊 Status Final:', 'info');
      this.log(`  ✅ Imports: ${importsFixed ? 'CORRIGIDOS' : 'FALHOU'}`, importsFixed ? 'success' : 'error');
      this.log(`  ✅ Processos: ${processManagerStarted ? 'INICIADOS' : 'FALHOU'}`, processManagerStarted ? 'success' : 'error');
      this.log(`  ✅ Deploy: ${deployCompleted ? 'CONCLUÍDO' : 'FALHOU'}`, deployCompleted ? 'success' : 'error');
      this.log(`  ✅ Monitoramento: ${monitoringConfigured ? 'CONFIGURADO' : 'FALHOU'}`, monitoringConfigured ? 'success' : 'error');
      this.log(`  ✅ Scripts: ${startupScriptsCreated ? 'CRIADOS' : 'FALHOU'}`, startupScriptsCreated ? 'success' : 'error');
      
      this.log('🚀 Sistema 100% IA pronto para uso!', 'success');
      this.log('🌐 Acesse: http://localhost:3000', 'info');
      this.log('🔧 API: http://localhost:3001', 'info');
      
      // Manter o processo rodando
      this.log('🔄 Sistema em execução contínua...', 'info');
      this.log('🛑 Pressione Ctrl+C para parar', 'info');
      
    } catch (error) {
      this.log(`💥 Automação falhou: ${error.message}`, 'error');
      await this.cleanup();
      process.exit(1);
    }
  }

  async cleanup() {
    this.log('🧹 Limpando recursos...', 'info');
    
    // Parar todos os agentes
    this.agents.forEach((process, name) => {
      if (process && !process.killed) {
        process.kill('SIGTERM');
        this.log(`🛑 Agente ${name} finalizado`, 'info');
      }
    });
    
    this.agents.clear();
    this.isRunning = false;
    
    this.log('✅ Limpeza concluída!', 'success');
  }
}

// Executar automação mestre
if (require.main === module) {
  const master = new MasterAutomation();
  
  // Capturar sinais de encerramento
  process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido sinal de encerramento...');
    await master.cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido sinal de término...');
    await master.cleanup();
    process.exit(0);
  });
  
  // Iniciar automação completa
  master.executeFullAutomation();
}

module.exports = MasterAutomation; 