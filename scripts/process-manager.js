#!/usr/bin/env node

/**
 * 🚀 GERENCIADOR DE PROCESSOS AUTOMÁTICO 100% IA
 * Sistema Tributário 100% IA - Agente de Gerenciamento de Processos
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ProcessManager {
  constructor() {
    this.processes = new Map();
    this.healthChecks = new Map();
    this.restartAttempts = new Map();
    this.maxRestartAttempts = 3;
    this.healthCheckInterval = 30000; // 30 segundos
    this.logFile = path.join(__dirname, '../logs/process-manager.log');
    
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
    
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(`${colors[type]}${logMessage}${colors.reset}`);
    
    // Salvar no arquivo de log
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async killProcessOnPort(port) {
    return new Promise((resolve) => {
      const platform = os.platform();
      let command;
      
      if (platform === 'win32') {
        command = `netstat -ano | findstr :${port}`;
      } else {
        command = `lsof -ti:${port}`;
      }
      
      exec(command, (error, stdout) => {
        if (stdout) {
          const pids = stdout.trim().split('\n').map(line => {
            if (platform === 'win32') {
              return line.split(/\s+/).pop();
            } else {
              return line.trim();
            }
          });
          
          pids.forEach(pid => {
            if (pid && pid !== 'PID') {
              try {
                if (platform === 'win32') {
                  exec(`taskkill /F /PID ${pid}`);
                } else {
                  exec(`kill -9 ${pid}`);
                }
                this.log(`🔪 Processo ${pid} na porta ${port} finalizado`, 'warning');
              } catch (e) {
                this.log(`⚠️ Erro ao finalizar processo ${pid}: ${e.message}`, 'warning');
              }
            }
          });
        }
        resolve();
      });
    });
  }

  async startBackend() {
    this.log('🚀 Iniciando backend...', 'info');
    
    // Matar processos na porta 3001
    await this.killProcessOnPort(3001);
    
    const backendProcess = spawn('npm', ['run', 'dev:backend'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      shell: true
    });

    backendProcess.on('spawn', () => {
      this.log('✅ Backend iniciado com sucesso!', 'success');
      this.processes.set('backend', backendProcess);
      this.restartAttempts.set('backend', 0);
    });

    backendProcess.on('error', (error) => {
      this.log(`❌ Erro no backend: ${error.message}`, 'error');
      this.handleProcessError('backend', error);
    });

    backendProcess.on('exit', (code) => {
      this.log(`⚠️ Backend encerrado com código ${code}`, 'warning');
      this.handleProcessExit('backend', code);
    });

    // Health check para backend
    this.setupHealthCheck('backend', 'http://localhost:3001/health');

    return backendProcess;
  }

  async startFrontend() {
    this.log('🚀 Iniciando frontend...', 'info');
    
    // Matar processos na porta 3000
    await this.killProcessOnPort(3000);
    
    const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      shell: true
    });

    frontendProcess.on('spawn', () => {
      this.log('✅ Frontend iniciado com sucesso!', 'success');
      this.processes.set('frontend', frontendProcess);
      this.restartAttempts.set('frontend', 0);
    });

    frontendProcess.on('error', (error) => {
      this.log(`❌ Erro no frontend: ${error.message}`, 'error');
      this.handleProcessError('frontend', error);
    });

    frontendProcess.on('exit', (code) => {
      this.log(`⚠️ Frontend encerrado com código ${code}`, 'warning');
      this.handleProcessExit('frontend', code);
    });

    // Health check para frontend
    this.setupHealthCheck('frontend', 'http://localhost:3000');

    return frontendProcess;
  }

  async handleProcessError(processName, error) {
    this.log(`🔄 Tentando reiniciar ${processName}...`, 'warning');
    
    const attempts = this.restartAttempts.get(processName) || 0;
    if (attempts < this.maxRestartAttempts) {
      this.restartAttempts.set(processName, attempts + 1);
      
      setTimeout(async () => {
        if (processName === 'backend') {
          await this.startBackend();
        } else if (processName === 'frontend') {
          await this.startFrontend();
        }
      }, 5000); // Aguardar 5 segundos antes de reiniciar
    } else {
      this.log(`💥 Máximo de tentativas de reinicialização atingido para ${processName}`, 'error');
    }
  }

  async handleProcessExit(processName, code) {
    if (code !== 0) {
      this.log(`🔄 Processo ${processName} encerrado com erro, tentando reiniciar...`, 'warning');
      this.handleProcessError(processName, new Error(`Exit code: ${code}`));
    }
  }

  setupHealthCheck(processName, url) {
    const checkHealth = async () => {
      try {
        const https = require('https');
        const http = require('http');
        
        const client = url.startsWith('https') ? https : http;
        
        const req = client.get(url, (res) => {
          if (res.statusCode === 200) {
            this.log(`✅ Health check ${processName}: OK`, 'success');
          } else {
            this.log(`⚠️ Health check ${processName}: Status ${res.statusCode}`, 'warning');
          }
        });
        
        req.on('error', (error) => {
          this.log(`❌ Health check ${processName} falhou: ${error.message}`, 'error');
        });
        
        req.setTimeout(5000, () => {
          req.destroy();
          this.log(`⏰ Health check ${processName} timeout`, 'warning');
        });
        
      } catch (error) {
        this.log(`❌ Erro no health check ${processName}: ${error.message}`, 'error');
      }
    };

    // Executar health check imediatamente
    setTimeout(checkHealth, 10000); // Aguardar 10 segundos para o processo inicializar
    
    // Configurar health check periódico
    const interval = setInterval(checkHealth, this.healthCheckInterval);
    this.healthChecks.set(processName, interval);
  }

  async startAll() {
    this.log('🚀 INICIANDO SISTEMA TRIBUTÁRIO 100% IA', 'info');
    this.log('=' * 50, 'info');
    
    try {
      // Iniciar backend primeiro
      await this.startBackend();
      
      // Aguardar um pouco e iniciar frontend
      setTimeout(async () => {
        await this.startFrontend();
      }, 5000);
      
      this.log('✅ Todos os processos iniciados!', 'success');
      this.log('🌐 Frontend: http://localhost:3000', 'info');
      this.log('🔧 Backend: http://localhost:3001', 'info');
      
    } catch (error) {
      this.log(`💥 Erro ao iniciar processos: ${error.message}`, 'error');
    }
  }

  async stopAll() {
    this.log('🛑 Parando todos os processos...', 'info');
    
    // Parar health checks
    this.healthChecks.forEach((interval, processName) => {
      clearInterval(interval);
      this.log(`🛑 Health check ${processName} parado`, 'info');
    });
    
    // Parar processos
    this.processes.forEach((process, processName) => {
      if (process && !process.killed) {
        process.kill('SIGTERM');
        this.log(`🛑 Processo ${processName} finalizado`, 'info');
      }
    });
    
    this.processes.clear();
    this.healthChecks.clear();
    this.restartAttempts.clear();
    
    this.log('✅ Todos os processos parados!', 'success');
  }

  getStatus() {
    const status = {
      processes: {},
      healthChecks: {},
      restartAttempts: {}
    };
    
    this.processes.forEach((process, name) => {
      status.processes[name] = {
        running: !process.killed,
        pid: process.pid
      };
    });
    
    this.healthChecks.forEach((interval, name) => {
      status.healthChecks[name] = {
        active: !!interval
      };
    });
    
    this.restartAttempts.forEach((attempts, name) => {
      status.restartAttempts[name] = attempts;
    });
    
    return status;
  }

  async monitor() {
    this.log('📊 Iniciando monitoramento contínuo...', 'info');
    
    setInterval(() => {
      const status = this.getStatus();
      
      this.log('📊 Status dos Processos:', 'info');
      Object.entries(status.processes).forEach(([name, info]) => {
        const statusIcon = info.running ? '✅' : '❌';
        this.log(`  ${statusIcon} ${name}: ${info.running ? 'Rodando' : 'Parado'} (PID: ${info.pid})`, 'info');
      });
      
      this.log('🔄 Tentativas de Reinicialização:', 'info');
      Object.entries(status.restartAttempts).forEach(([name, attempts]) => {
        this.log(`  ${name}: ${attempts}/${this.maxRestartAttempts}`, 'info');
      });
      
    }, 60000); // A cada minuto
  }
}

// Executar gerenciador
if (require.main === module) {
  const manager = new ProcessManager();
  
  // Capturar sinais de encerramento
  process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido sinal de encerramento...');
    await manager.stopAll();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido sinal de término...');
    await manager.stopAll();
    process.exit(0);
  });
  
  // Iniciar sistema
  manager.startAll();
  manager.monitor();
}

module.exports = ProcessManager; 