# 💾 **SISTEMA DE BACKUP AUTOMÁTICO - SISTEMA TRIBUTÁRIO IA**

## 🎯 **Visão Geral**
Sistema de backup automatizado para preservar todos os dados críticos do primeiro sistema tributário 100% IA do mundo.

---

## 🛡️ **Estratégia de Backup**

### **📊 Backup 3-2-1**
- **3 cópias** dos dados (original + 2 backups)
- **2 mídias diferentes** (local + nuvem)  
- **1 cópia offsite** (cloud storage)

### **🔄 Frequência**
- **Crítico (Banco)**: A cada 4 horas
- **Agentes IA**: Diário (após treinamento)
- **Configurações**: Semanal
- **Logs**: Rotação diária
- **Código**: A cada commit (Git)

---

## 🗃️ **Dados para Backup**

### **🔥 CRÍTICO** (Recovery < 1h)
```bash
# PostgreSQL Database
- Esquemas e dados
- Configurações de usuários
- Índices e triggers

# Agentes IA Treinados  
- Modelos de ML salvos
- Configurações de treino
- Histórico de aprendizagem

# Configurações Sistema
- .env files
- Certificados SSL
- Chaves de API
```

### **🟡 IMPORTANTE** (Recovery < 4h)
```bash
# Documentos Processados
- XMLs originais
- Dados extraídos
- Relatórios gerados

# Logs do Sistema
- Logs de aplicação
- Logs de erro
- Métricas de performance

# Cache Redis
- Dados em cache
- Sessões ativas
```

### **🟢 NORMAL** (Recovery < 24h)
```bash
# Arquivos Temporários
- Uploads em processo
- Relatórios temporários
- Cache de build
```

---

## 🔧 **Scripts de Backup**

### **backup-database.sh**
```bash
#!/bin/bash
# Backup PostgreSQL automatizado

BACKUP_DIR="/backup/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="sistema_tributario"

echo "🗃️ Iniciando backup PostgreSQL..."

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup completo
pg_dump -h localhost -U postgres -d $DB_NAME \
  --no-password --verbose --clean --create \
  --format=custom \
  --file="$BACKUP_DIR/db_backup_$DATE.dump"

# Verificar se backup foi criado
if [ -f "$BACKUP_DIR/db_backup_$DATE.dump" ]; then
  echo "✅ Backup PostgreSQL criado: db_backup_$DATE.dump"
  
  # Comprimir backup antigo (> 7 dias)
  find $BACKUP_DIR -name "*.dump" -mtime +7 -exec gzip {} \;
  
  # Remover backups muito antigos (> 30 dias)
  find $BACKUP_DIR -name "*.dump.gz" -mtime +30 -delete
  
  echo "🧹 Limpeza de backups antigos concluída"
else
  echo "❌ ERRO: Falha ao criar backup PostgreSQL!"
  exit 1
fi
```

### **backup-ia-agents.sh**
```bash
#!/bin/bash
# Backup dos Agentes IA treinados

BACKUP_DIR="/backup/ai-agents"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="./backend/src/services/agents"

echo "🤖 Iniciando backup dos Agentes IA..."

# Criar diretório
mkdir -p $BACKUP_DIR

# Backup dos modelos e configurações
tar -czf "$BACKUP_DIR/ai_agents_$DATE.tar.gz" \
  --directory="./" \
  backend/src/services/agents/ \
  backend/models/ \
  backend/training-data/

# Verificar backup
if [ -f "$BACKUP_DIR/ai_agents_$DATE.tar.gz" ]; then
  echo "✅ Backup Agentes IA criado: ai_agents_$DATE.tar.gz"
  
  # Backup differential (apenas mudanças)
  rsync -av --link-dest="$BACKUP_DIR/latest" \
    "$SOURCE_DIR/" "$BACKUP_DIR/incremental_$DATE/"
  
  # Atualizar link para último backup
  ln -nfs "incremental_$DATE" "$BACKUP_DIR/latest"
  
  echo "🔄 Backup incremental criado"
else
  echo "❌ ERRO: Falha ao criar backup dos Agentes IA!"
  exit 1
fi
```

### **backup-config.sh**
```bash
#!/bin/bash
# Backup das configurações do sistema

BACKUP_DIR="/backup/config"
DATE=$(date +%Y%m%d_%H%M%S)

echo "⚙️ Iniciando backup das configurações..."

mkdir -p $BACKUP_DIR

# Backup de configurações
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
  .env \
  docker-compose.yml \
  docker-compose.prod.yml \
  backend/tsconfig.json \
  backend/package.json \
  frontend/next.config.js \
  frontend/package.json \
  monitoring/ \
  scripts/

echo "✅ Backup de configurações criado: config_$DATE.tar.gz"
```

---

## ☁️ **Backup para Nuvem**

### **sync-to-cloud.sh**
```bash
#!/bin/bash
# Sincronizar backups para AWS S3

BUCKET_NAME="sistema-tributario-backup"
LOCAL_BACKUP="/backup"

echo "☁️ Sincronizando backups para S3..."

# Upload para S3 com criptografia
aws s3 sync $LOCAL_BACKUP s3://$BUCKET_NAME/$(date +%Y/%m/%d)/ \
  --storage-class STANDARD_IA \
  --server-side-encryption AES256 \
  --exclude "*.tmp" \
  --delete

echo "✅ Sincronização S3 concluída"

# Backup para Google Cloud (redundância)
gsutil -m rsync -r -d $LOCAL_BACKUP gs://sistema-tributario-backup-gcp/

echo "✅ Sincronização Google Cloud concluída"
```

---

## 🔄 **Automação com Cron**

### **crontab -e**
```bash
# Backup PostgreSQL a cada 4 horas
0 */4 * * * /opt/sistema-tributario/scripts/backup-database.sh >> /var/log/backup.log 2>&1

# Backup Agentes IA diário às 2h
0 2 * * * /opt/sistema-tributario/scripts/backup-ia-agents.sh >> /var/log/backup.log 2>&1

# Backup configurações semanal (domingo 3h)
0 3 * * 0 /opt/sistema-tributario/scripts/backup-config.sh >> /var/log/backup.log 2>&1

# Sync para nuvem diário às 4h
0 4 * * * /opt/sistema-tributario/scripts/sync-to-cloud.sh >> /var/log/backup.log 2>&1

# Limpeza de logs antigos
0 5 * * * find /var/log -name "*.log" -mtime +30 -delete
```

---

## 🔧 **Scripts de Restore**

### **restore-database.sh**
```bash
#!/bin/bash
# Restaurar PostgreSQL do backup

BACKUP_FILE=$1
DB_NAME="sistema_tributario"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Uso: ./restore-database.sh <arquivo_backup>"
  exit 1
fi

echo "🔄 Restaurando PostgreSQL de $BACKUP_FILE..."

# Parar aplicação
docker-compose stop backend

# Restaurar database
pg_restore -h localhost -U postgres -d $DB_NAME \
  --verbose --clean --no-owner --no-privileges \
  $BACKUP_FILE

# Reiniciar aplicação
docker-compose start backend

# Verificar testes
cd backend && npm test

echo "✅ Restore concluído e testes executados"
```

### **restore-full-system.sh**
```bash
#!/bin/bash
# Restore completo do sistema

BACKUP_DATE=$1

if [ -z "$BACKUP_DATE" ]; then
  echo "❌ Uso: ./restore-full-system.sh YYYYMMDD_HHMMSS"
  exit 1
fi

echo "🔄 Restaurando sistema completo de $BACKUP_DATE..."

# Parar todos os serviços
docker-compose down

# Restaurar database
./restore-database.sh "/backup/postgres/db_backup_$BACKUP_DATE.dump"

# Restaurar agentes IA
tar -xzf "/backup/ai-agents/ai_agents_$BACKUP_DATE.tar.gz" -C ./

# Restaurar configurações  
tar -xzf "/backup/config/config_$BACKUP_DATE.tar.gz" -C ./

# Reiniciar sistema
docker-compose up -d

# Verificar saúde do sistema
sleep 30
curl -f http://localhost:3001/api/health

echo "✅ Sistema restaurado completamente"
```

---

## 📊 **Monitoramento de Backup**

### **Métricas Importantes**
```bash
# Tamanho dos backups
du -sh /backup/*

# Último backup bem-sucedido
ls -la /backup/postgres/ | head -5

# Status do cron
systemctl status cron

# Logs de backup
tail -f /var/log/backup.log
```

### **Alertas no Grafana**
```yaml
- alert: BackupFailed
  expr: time() - last_backup_timestamp > 14400  # 4 horas
  labels:
    severity: critical
  annotations:
    summary: "Backup não executado há mais de 4 horas!"

- alert: BackupSizeAbnormal
  expr: backup_size_bytes < 0.5 * avg_over_time(backup_size_bytes[7d])
  labels:
    severity: warning
  annotations:
    summary: "Tamanho do backup muito pequeno - possível problema"
```

---

## 🧪 **Testes de Disaster Recovery**

### **teste-restore-mensal.sh**
```bash
#!/bin/bash
# Teste mensal de restore (ambiente isolado)

echo "🧪 Iniciando teste de Disaster Recovery..."

# Criar ambiente de teste
docker-compose -f docker-compose.test.yml up -d

# Restaurar último backup
LATEST_BACKUP=$(ls -t /backup/postgres/*.dump | head -n1)
./restore-database.sh $LATEST_BACKUP

# Executar testes
cd backend && npm test

# Verificar integridade dos agentes IA
node scripts/test-ia-agents.js

# Limpar ambiente de teste
docker-compose -f docker-compose.test.yml down

echo "✅ Teste de Disaster Recovery concluído"
```

---

## 📋 **Checklist de Backup**

### **✅ Diário**
- [ ] Backup PostgreSQL executado
- [ ] Backup Agentes IA executado  
- [ ] Sincronização nuvem concluída
- [ ] Logs verificados sem erros
- [ ] Espaço em disco suficiente

### **✅ Semanal**
- [ ] Backup configurações executado
- [ ] Limpeza de backups antigos
- [ ] Verificação integridade dados
- [ ] Teste de restore pequeno

### **✅ Mensal**
- [ ] Teste completo de disaster recovery
- [ ] Auditoria de backups na nuvem
- [ ] Revisão de políticas de retenção
- [ ] Documentação atualizada

---

## 🚨 **Plano de Emergência**

### **Cenário 1: Perda do Servidor Principal**
1. Provisionar novo servidor
2. Instalar Docker e dependências
3. Baixar backup mais recente da nuvem
4. Executar restore completo
5. Verificar 165 testes passando
6. Redirecionar DNS
**RTO**: 2 horas | **RPO**: 4 horas

### **Cenário 2: Corrupção do Banco**
1. Parar aplicação imediatamente
2. Isolar banco corrompido
3. Restaurar do backup mais recente
4. Validar integridade dos dados
5. Reiniciar aplicação
**RTO**: 30 minutos | **RPO**: 4 horas

### **Cenário 3: Perda dos Agentes IA**
1. Restaurar modelos do backup
2. Verificar configurações de treino
3. Executar testes de validação
4. Re-treinar se necessário
**RTO**: 1 hora | **RPO**: 24 horas

---

**💾 Sistema de Backup - Proteção Total do Primeiro Sistema Tributário 100% IA!**  
**🛡️ Estratégia 3-2-1**: Local + Nuvem + Offsite  
**🔄 Automação Completa**: Backup, Restore, Monitoramento  
**⚡ Recovery Rápido**: RTO < 2h para todos os cenários
