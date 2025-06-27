# 📊 **CONFIGURAÇÃO DE MONITORAMENTO - SISTEMA TRIBUTÁRIO IA**

## 🎯 **Visão Geral**
Sistema de monitoramento completo para o primeiro sistema tributário 100% IA do mundo.

---

## 📈 **Métricas Principais**

### 🎯 **KPIs Críticos** (conforme main_controller_v3.md)
- **Backend Tests**: DEVE MANTER 165/165 ✅
- **TypeScript Build**: DEVE MANTER 0 ERROS ✅  
- **API Response**: DEVE MANTER < 200ms ✅
- **Agentes IA**: DEVE MANTER 100% FUNCIONAL ✅

### 📊 **Métricas de Sistema**
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%
- **Disk Usage**: < 85%
- **Network Latency**: < 100ms

### 🤖 **Métricas dos Agentes IA**
- **Documentos Processados/hora**: Meta > 100
- **Taxa de Sucesso**: Meta > 95%
- **Confiança Média**: Meta > 90%
- **Tempo de Processamento**: Meta < 3s

### 🏢 **Métricas Multi-Empresa**
- **Empresas Ativas**: Monitoramento em tempo real
- **Documentos por Empresa**: Distribuição e volume
- **Status de Processamento**: Success/Error ratio

---

## 🔧 **Configuração Prometheus**

### Arquivo: `monitoring/prometheus.yml`
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'sistema-tributario-backend'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'sistema-tributario-frontend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 15s

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:6379']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - localhost:9093
```

---

## 🚨 **Alertas Configurados**

### Arquivo: `monitoring/alert_rules.yml`
```yaml
groups:
  - name: sistema_tributario_alerts
    rules:
      - alert: BackendTestsFailing
        expr: backend_tests_passing < 165
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "CRÍTICO: Testes do backend falhando!"
          description: "Apenas {{ $value }} de 165 testes passando. Sistema comprometido!"

      - alert: APIResponseTimeSlow
        expr: api_response_time_seconds > 0.2
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "API lenta: Tempo de resposta > 200ms"
          description: "API respondendo em {{ $value }}s, acima do limite de 200ms"

      - alert: AgentIADown
        expr: ia_agent_status == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "CRÍTICO: Agente IA inativo!"
          description: "Agente {{ $labels.agent_name }} está inativo há mais de 30s"

      - alert: DocumentProcessingError
        expr: rate(document_processing_errors[5m]) > 0.05
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Taxa de erro no processamento de documentos alta"
          description: "{{ $value }} erros por segundo nos últimos 5 minutos"

      - alert: DatabaseConnectionLost
        expr: postgres_up == 0
        for: 15s
        labels:
          severity: critical
        annotations:
          summary: "CRÍTICO: Conexão com PostgreSQL perdida!"
          description: "Banco de dados PostgreSQL inacessível"

      - alert: RedisConnectionLost
        expr: redis_up == 0
        for: 30s
        labels:
          severity: warning
        annotations:
          summary: "Cache Redis inacessível"
          description: "Conexão com Redis perdida, performance pode ser afetada"
```

---

## 📊 **Dashboard Grafana**

### 🎪 **Dashboard Principal - Sistema Tributário IA**

#### **Painel 1: Status Geral**
- Status dos 165 testes (Verde/Vermelho)
- Número de agentes IA ativos (12/12)
- APIs respondendo (Status code 200)
- Uptime do sistema

#### **Painel 2: Performance**
- Tempo de resposta da API (meta < 200ms)
- CPU e Memória do backend
- Throughput de requisições/segundo
- Latência de rede

#### **Painel 3: Agentes IA**
```json
{
  "title": "Agentes IA - Performance",
  "panels": [
    {
      "title": "Documentos Processados",
      "type": "stat",
      "query": "sum(rate(documents_processed[1h]))"
    },
    {
      "title": "Taxa de Sucesso por Agente",
      "type": "graph",
      "query": "rate(documents_success[5m]) / rate(documents_total[5m]) * 100"
    },
    {
      "title": "Confiança Média",
      "type": "gauge",
      "query": "avg(ia_confidence_score)"
    },
    {
      "title": "Tempo de Processamento",
      "type": "heatmap",
      "query": "histogram_quantile(0.95, rate(processing_duration_seconds_bucket[5m]))"
    }
  ]
}
```

#### **Painel 4: Multi-Empresa**
- Empresas ativas por região
- Volume de documentos por empresa
- Status de processamento em tempo real
- Ranking de empresas por volume

#### **Painel 5: Sistema**
- Status dos containers Docker
- Logs de erro em tempo real
- Espaço em disco disponível
- Conexões de rede ativas

---

## 🔔 **Notificações**

### **Slack Integration**
```yaml
slack_configs:
  - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
    channel: '#sistema-tributario-alerts'
    title: 'Sistema Tributário IA - Alerta'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

### **Email Alerts**
```yaml
email_configs:
  - to: 'admin@sistema-tributario-ia.com'
    from: 'monitoring@sistema-tributario-ia.com'
    subject: 'ALERTA: {{ .GroupLabels.alertname }}'
    body: |
      Sistema: Sistema Tributário 100% IA
      Severidade: {{ .GroupLabels.severity }}
      Descrição: {{ range .Alerts }}{{ .Annotations.description }}{{ end }}
```

---

## 📱 **Dashboard Mobile**

### **Métricas Essenciais para Smartphone**
- ✅ Status Verde/Vermelho do sistema
- 📊 Número de documentos processados hoje
- 🤖 Agentes IA ativos (12/12)
- ⚡ API response time atual
- 🏢 Empresas sendo monitoradas
- 🚨 Alertas críticos ativos

---

## 🛠️ **Scripts de Deploy**

### **start-monitoring.sh**
```bash
#!/bin/bash
echo "🚀 Iniciando monitoramento Sistema Tributário IA..."

# Criar diretórios
mkdir -p monitoring/data/prometheus
mkdir -p monitoring/data/grafana

# Subir Prometheus
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v $(pwd)/monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml \
  prom/prometheus

# Subir Grafana
docker run -d \
  --name grafana \
  -p 3001:3000 \
  -v $(pwd)/monitoring/data/grafana:/var/lib/grafana \
  grafana/grafana

echo "✅ Monitoramento ativo!"
echo "📊 Prometheus: http://localhost:9090"
echo "📈 Grafana: http://localhost:3001"
```

---

## 🎯 **Métricas de Sucesso**

### **SLA - Service Level Agreement**
- **Uptime**: 99.9% (máximo 8.76 horas de downtime por ano)
- **API Response**: 95% das requests < 200ms
- **Processamento IA**: 95% sucesso
- **Detecção de Problemas**: < 1 minuto

### **KPIs de Monitoramento**
- **MTTR** (Mean Time To Repair): < 15 minutos
- **MTBF** (Mean Time Between Failures): > 720 horas
- **Availability**: > 99.9%
- **Performance**: API p95 < 200ms

---

## 🔍 **Troubleshooting**

### **Problemas Comuns**
1. **API Lenta**: Verificar CPU/Memória, otimizar queries
2. **Agente IA Inativo**: Restart automático, verificar logs
3. **Postgres Lento**: Analizar queries, vacuum, reindex
4. **Redis Memory**: Limpeza de cache, configurar TTL

### **Comandos de Emergência**
```bash
# Verificar status geral
docker ps -a

# Logs do backend
docker logs sistema_tributario_backend

# Restart serviços críticos
docker-compose restart backend redis

# Verificar métricas
curl http://localhost:3001/metrics
```

---

**🏆 Sistema de Monitoramento - Primeiro Sistema Tributário 100% IA do Mundo!**  
**📊 Monitoramento Completo**: 12 Agentes IA + APIs + Performance  
**🚨 Alertas Inteligentes**: Detecção proativa de problemas  
**📈 Dashboards**: Visibilidade total do sistema
