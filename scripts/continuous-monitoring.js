
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
            console.log(`🔄 Tentando reiniciar ${name}...`);
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
