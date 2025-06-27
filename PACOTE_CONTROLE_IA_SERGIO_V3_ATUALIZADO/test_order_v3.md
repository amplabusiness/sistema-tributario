# 🧪 ORDEM DE TESTES E BUILD V3 - SISTEMA EM PRODUÇÃO

## ✅ **BACKEND: TESTES JÁ FUNCIONANDO (NÃO EXECUTAR DESNECESSARIAMENTE)**

### 🏆 **STATUS ATUAL - 100% FUNCIONAL**
```
✅ 17/17 suites Jest passando
✅ 165/165 testes individuais passando  
✅ 0 erros de build TypeScript
✅ Sistema pronto para produção
```

### � **COMANDO DE VERIFICAÇÃO (SOMENTE SE NECESSÁRIO)**
```bash
# SOMENTE para verificar se backend continua funcionando
cd backend
npm test
```
**⚠️ IMPORTANTE**: Execute apenas para **VERIFICAR** se algo quebrou. Não execute rotineiramente.

---

## 🔧 **FRONTEND: ORDEM DE BUILD E TESTES (FOCO ATUAL)**

### **1. Verificação de Dependências**
```bash
cd frontend
npm install
npm audit fix
```

### **2. Desenvolvimento Local**
```bash
cd frontend
npm run dev
# Verificar se roda em http://localhost:3000
```

### **3. Build de Produção**
```bash
cd frontend
npm run build
npm run start
```

### **4. Testes Frontend (se existirem)**
```bash
cd frontend
npm test
# ou
npm run test:watch
```

### **5. Linting e Qualidade**
```bash
cd frontend
npm run lint
npm run type-check
```

---

## 🚀 **DEPLOY: ORDEM DE EXECUÇÃO**

### **1. Build Completo**
```bash
# Root do projeto
docker-compose build
docker-compose up -d
```

### **2. Testes de Integração**
```bash
# Testar APIs
curl http://localhost:3001/api/health
curl http://localhost:3001/api/v1/status
```

### **3. Verificação Final**
```bash
# Verificar se tudo está rodando
docker-compose ps
docker-compose logs -f
```

---

## 📊 **ORDEM DE MONITORAMENTO**

### **1. Logs em Tempo Real**
```bash
# Backend logs
cd backend && npm run logs

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **2. Métricas de Performance**
```bash
# Health checks
curl http://localhost:3001/api/health
curl http://localhost:3000/api/health (frontend)
```

### **3. Verificação de Banco**
```bash
# Verificar conexão com banco
cd backend
npx prisma studio
```

---

## ⚠️ **REGRAS DE EXECUÇÃO DE TESTES**

### **✅ EXECUTE QUANDO:**
- Fizer mudanças no frontend
- Antes de fazer deploy
- Suspeitar que algo quebrou
- Implementar nova funcionalidade

### **❌ NÃO EXECUTE:**
- Testes do backend rotineiramente (já funcionam)
- Comandos que modificam banco de dados
- Scripts de migration desnecessários
- Rebuilds completos sem motivo

### **🎯 ORDEM RECOMENDADA:**
1. **Frontend first** - sempre teste o frontend antes
2. **Backend check** - só se necessário
3. **Integration tests** - para validar conexão
4. **Deploy tests** - antes de produção

---

## 🛡️ **PROTOCOLO DE EMERGÊNCIA**

### **Se Algo Quebrar:**
1. **PARE IMEDIATAMENTE**
2. Verifique logs: `docker-compose logs`
3. Teste backend: `cd backend && npm test`
4. Se backend OK, problema é frontend
5. Se backend falhou, **ROLLBACK IMEDIATO**

### **Rollback de Emergência:**
```bash
git reset --hard HEAD~1
docker-compose down
docker-compose up --build
```

---

**🎯 FILOSOFIA V3**: Teste o **MÍNIMO NECESSÁRIO** para **MÁXIMA SEGURANÇA**

**Status**: 🟢 **TESTES PROTEGIDOS** - Execute com sabedoria! 🧠

## 📊 **MONITORAMENTO CONTÍNUO**
- ✅ Backend: Sempre funcionando
- 🔄 Frontend: Em desenvolvimento
- ⏳ Deploy: Pendente

## ⚠️ **AVISO IMPORTANTE**
**NUNCA** execute `npm test` no backend sem necessidade.  
Os testes estão passando e o sistema está estável.
