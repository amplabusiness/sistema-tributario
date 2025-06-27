#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE DEPLOY AUTOMÁTICO 100% IA
 * Sistema Tributário 100% IA - Pipeline CI/CD Automatizado
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class AutoDeploy {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.frontendPath = path.join(this.projectRoot, 'frontend');
    this.backendPath = path.join(this.projectRoot, 'backend');
    this.deployLog = path.join(this.projectRoot, 'logs/deploy.log');
    
    // Garantir que o diretório de logs existe
    const logDir = path.dirname(this.deployLog);
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
    fs.appendFileSync(this.deployLog, logMessage + '\n');
  }

  async runCommand(command, cwd = this.projectRoot) {
    return new Promise((resolve, reject) => {
      this.log(`🔧 Executando: ${command}`, 'info');
      
      try {
        const result = execSync(command, {
          cwd,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        this.log(`✅ Comando executado com sucesso: ${command}`, 'success');
        resolve(result);
      } catch (error) {
        this.log(`❌ Erro no comando ${command}: ${error.message}`, 'error');
        reject(error);
      }
    });
  }

  async checkGitStatus() {
    this.log('🔍 Verificando status do Git...', 'info');
    
    try {
      const status = await this.runCommand('git status --porcelain');
      
      if (status.trim()) {
        this.log('📝 Mudanças detectadas no repositório', 'warning');
        this.log('📋 Mudanças:', 'info');
        status.split('\n').forEach(line => {
          if (line.trim()) {
            this.log(`  ${line}`, 'info');
          }
        });
        return true;
      } else {
        this.log('✅ Nenhuma mudança pendente', 'success');
        return false;
      }
    } catch (error) {
      this.log(`❌ Erro ao verificar status do Git: ${error.message}`, 'error');
      return false;
    }
  }

  async runTests() {
    this.log('🧪 Executando testes...', 'info');
    
    try {
      // Testes do backend
      this.log('🔧 Testes do Backend...', 'info');
      await this.runCommand('npm test', this.backendPath);
      
      // Testes do frontend (se existirem)
      if (fs.existsSync(path.join(this.frontendPath, 'package.json'))) {
        this.log('🎨 Testes do Frontend...', 'info');
        const packageJson = JSON.parse(fs.readFileSync(path.join(this.frontendPath, 'package.json'), 'utf8'));
        
        if (packageJson.scripts.test) {
          await this.runCommand('npm test', this.frontendPath);
        } else {
          this.log('⚠️ Script de teste não encontrado no frontend', 'warning');
        }
      }
      
      this.log('✅ Todos os testes passaram!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Testes falharam: ${error.message}`, 'error');
      return false;
    }
  }

  async buildProject() {
    this.log('🏗️ Construindo projeto...', 'info');
    
    try {
      // Build do backend
      this.log('🔧 Build do Backend...', 'info');
      await this.runCommand('npm run build', this.backendPath);
      
      // Build do frontend
      this.log('🎨 Build do Frontend...', 'info');
      await this.runCommand('npm run build', this.frontendPath);
      
      this.log('✅ Build concluído com sucesso!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro no build: ${error.message}`, 'error');
      return false;
    }
  }

  async deployToVercel() {
    this.log('🚀 Deployando para Vercel...', 'info');
    
    try {
      // Verificar se o Vercel CLI está instalado
      try {
        await this.runCommand('vercel --version');
      } catch (error) {
        this.log('📦 Instalando Vercel CLI...', 'info');
        await this.runCommand('npm install -g vercel');
      }
      
      // Deploy do frontend
      this.log('🎨 Deploy do Frontend...', 'info');
      await this.runCommand('vercel --prod', this.frontendPath);
      
      this.log('✅ Deploy para Vercel concluído!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro no deploy Vercel: ${error.message}`, 'error');
      return false;
    }
  }

  async deployToRailway() {
    this.log('🚂 Deployando para Railway...', 'info');
    
    try {
      // Verificar se o Railway CLI está instalado
      try {
        await this.runCommand('railway --version');
      } catch (error) {
        this.log('📦 Instalando Railway CLI...', 'info');
        await this.runCommand('npm install -g @railway/cli');
      }
      
      // Deploy do backend
      this.log('🔧 Deploy do Backend...', 'info');
      await this.runCommand('railway up', this.backendPath);
      
      this.log('✅ Deploy para Railway concluído!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro no deploy Railway: ${error.message}`, 'error');
      return false;
    }
  }

  async healthCheck() {
    this.log('🏥 Executando health check...', 'info');
    
    const endpoints = [
      { name: 'Frontend', url: 'http://localhost:3000' },
      { name: 'Backend', url: 'http://localhost:3001/health' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const result = await this.checkEndpoint(endpoint.url);
        results.push({ name: endpoint.name, status: result ? 'OK' : 'FAIL' });
        
        if (result) {
          this.log(`✅ ${endpoint.name}: OK`, 'success');
        } else {
          this.log(`❌ ${endpoint.name}: FAIL`, 'error');
        }
      } catch (error) {
        this.log(`❌ ${endpoint.name}: ERROR - ${error.message}`, 'error');
        results.push({ name: endpoint.name, status: 'ERROR' });
      }
    }
    
    const allOk = results.every(r => r.status === 'OK');
    
    if (allOk) {
      this.log('✅ Health check passou em todos os endpoints!', 'success');
    } else {
      this.log('⚠️ Health check falhou em alguns endpoints', 'warning');
    }
    
    return allOk;
  }

  async checkEndpoint(url) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  async commitAndPush() {
    this.log('📝 Commitando e enviando mudanças...', 'info');
    
    try {
      // Adicionar todas as mudanças
      await this.runCommand('git add .');
      
      // Commit com timestamp
      const timestamp = new Date().toISOString();
      await this.runCommand(`git commit -m "🚀 Deploy automático - ${timestamp}"`);
      
      // Push para o repositório
      await this.runCommand('git push origin main');
      
      this.log('✅ Mudanças commitadas e enviadas!', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Erro no commit/push: ${error.message}`, 'error');
      return false;
    }
  }

  async generateDeployReport() {
    this.log('📊 Gerando relatório de deploy...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      gitStatus: await this.checkGitStatus(),
      testsPassed: false,
      buildSuccess: false,
      deploySuccess: false,
      healthCheckPassed: false
    };
    
    try {
      report.testsPassed = await this.runTests();
    } catch (error) {
      this.log(`❌ Testes falharam: ${error.message}`, 'error');
    }
    
    if (report.testsPassed) {
      try {
        report.buildSuccess = await this.buildProject();
      } catch (error) {
        this.log(`❌ Build falhou: ${error.message}`, 'error');
      }
    }
    
    if (report.buildSuccess) {
      try {
        report.deploySuccess = await this.deployToVercel() && await this.deployToRailway();
      } catch (error) {
        this.log(`❌ Deploy falhou: ${error.message}`, 'error');
      }
    }
    
    if (report.deploySuccess) {
      try {
        report.healthCheckPassed = await this.healthCheck();
      } catch (error) {
        this.log(`❌ Health check falhou: ${error.message}`, 'error');
      }
    }
    
    // Salvar relatório
    const reportPath = path.join(this.projectRoot, 'logs/deploy-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log('📊 Relatório de deploy salvo!', 'success');
    
    return report;
  }

  async executeFullPipeline() {
    this.log('🚀 INICIANDO PIPELINE CI/CD 100% IA', 'info');
    this.log('=' * 50, 'info');
    
    const startTime = Date.now();
    
    try {
      // 1. Verificar status do Git
      const hasChanges = await this.checkGitStatus();
      
      if (!hasChanges) {
        this.log('✅ Nenhuma mudança detectada, pipeline finalizado', 'success');
        return;
      }
      
      // 2. Executar testes
      const testsPassed = await this.runTests();
      if (!testsPassed) {
        throw new Error('Testes falharam');
      }
      
      // 3. Build do projeto
      const buildSuccess = await this.buildProject();
      if (!buildSuccess) {
        throw new Error('Build falhou');
      }
      
      // 4. Deploy
      const deploySuccess = await this.deployToVercel() && await this.deployToRailway();
      if (!deploySuccess) {
        throw new Error('Deploy falhou');
      }
      
      // 5. Health check
      const healthOk = await this.healthCheck();
      if (!healthOk) {
        this.log('⚠️ Health check falhou, mas deploy foi realizado', 'warning');
      }
      
      // 6. Commit e push das mudanças
      await this.commitAndPush();
      
      // 7. Gerar relatório
      const report = await this.generateDeployReport();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      this.log('=' * 50, 'info');
      this.log('🎉 PIPELINE CI/CD CONCLUÍDO COM SUCESSO!', 'success');
      this.log(`⏱️ Duração: ${duration} segundos`, 'info');
      this.log('📊 Status Final:', 'info');
      this.log(`  ✅ Testes: ${report.testsPassed ? 'PASSOU' : 'FALHOU'}`, report.testsPassed ? 'success' : 'error');
      this.log(`  ✅ Build: ${report.buildSuccess ? 'PASSOU' : 'FALHOU'}`, report.buildSuccess ? 'success' : 'error');
      this.log(`  ✅ Deploy: ${report.deploySuccess ? 'PASSOU' : 'FALHOU'}`, report.deploySuccess ? 'success' : 'error');
      this.log(`  ✅ Health Check: ${report.healthCheckPassed ? 'PASSOU' : 'FALHOU'}`, report.healthCheckPassed ? 'success' : 'error');
      
    } catch (error) {
      this.log(`💥 Pipeline falhou: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Executar pipeline
if (require.main === module) {
  const deploy = new AutoDeploy();
  deploy.executeFullPipeline();
}

module.exports = AutoDeploy; 