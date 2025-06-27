# GUIA COMPLETO PARA AMANHÃ - Sistema Tributário Claude IA

## 🎯 SITUAÇÃO ATUAL (25/01/2025)

**STATUS:** 70% concluído - Progresso substancial realizado
**TESTES:** 13/17 suites passando (119 testes) ✅
**BUILD:** 29 erros TypeScript restantes ⚠️
**DEPENDÊNCIAS:** 2 pacotes faltantes ⚠️

## 🚀 AÇÕES IMEDIATAS (30 minutos)

### 1️⃣ INSTALAR DEPENDÊNCIAS (5 min)
```powershell
cd d:\sistema-tributario\backend
npm install methods safer-buffer
```

### 2️⃣ VERIFICAR TESTES (5 min)
```powershell
npm test
```
**Expectativa:** 17/17 suites passando após instalação

### 3️⃣ CORRIGIR ERROS DE BUILD (20 min)
```powershell
npm run build
```

## 🔧 CORREÇÕES ESPECÍFICAS NECESSÁRIAS

### Schema Prisma - Campos Faltantes
**Arquivo:** `backend/prisma/schema.prisma`

Adicionar aos models existentes:
```prisma
model Documentos {
  // ... campos existentes ...
  aiResults     Json?     // Campo faltante
  documentId    String?   // Campo faltante  
}

model SpedFiscalApuracao {
  // ... campos existentes ...
  documentId    String?   // Campo faltante
}

model XMLDocument {
  // ... campos existentes ...
  documentId    String?   // Campo faltante
  dataEmissao   DateTime? // Campo faltante
}

model SpedFiscalItem {
  // ... campos existentes ...
  documento     String?   // Campo faltante (manter também documentId)
  data          DateTime? // Campo faltante
}
```

### Services - Correções de Métodos

**Arquivo:** `src/services/auto-watcher.ts`
```typescript
// Linha 69 - Corrigir construtor privado
this.documentAgent = DocumentParsingAgent.getInstance();

// Linha 402 - Corrigir argumentos do método
const result = await this.documentAgent.processDocument(filePath);
```

**Arquivo:** `src/services/document-indexer.ts`
```typescript
// Linha 76 - Corrigir nome do model
await prisma.xmlItem.create({  // era xMLItem

// Linha 134 - Corrigir campo
documentId: item.documento,  // trocar documento por documentId
```

**Arquivo:** `src/services/watchers/s3-watcher.ts`
```typescript
// Linha 237 - Adicionar método faltante
private isFiscalFile(fileName: string): boolean {
  const fiscalExtensions = ['.xml', '.txt', '.sped'];
  return fiscalExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}
```

### Routes - Adicionar Returns

**Arquivos:** `src/routes/upload.ts`, `src/routes/watcher.ts`
```typescript
// Adicionar return em todas as funções async que não retornam valor
// Exemplo:
async (req: Request, res: Response) => {
  try {
    // ... lógica existente ...
    return res.json({ success: true }); // ← Adicionar return
  } catch (error) {
    return res.status(500).json({ error }); // ← Adicionar return
  }
}
```

### Logger - Correção de Tipos

**Arquivo:** `src/utils/logger.ts`
```typescript
import DailyRotateFile from 'winston-daily-rotate-file';

// Corrigir instanciação:
new DailyRotateFile({
  filename: path.join('logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info'
}) as any  // ← Adicionar cast temporário
```

## 📝 COMANDOS DE VERIFICAÇÃO

Após cada correção, verificar:
```powershell
# Regenerar Prisma Client
npx prisma generate

# Verificar build
npm run build

# Verificar testes
npm test

# Verificar apenas os testes que falhavam
npm test -- tests/routes/documents.test.ts
npm test -- tests/multi-empresa.test.ts
npm test -- tests/routes/auth.test.ts  
npm test -- tests/services/watcher.test.ts
```

## 🎯 METAS DE SUCESSO

### ✅ Critério de Conclusão:
- [ ] `npm test` → 17/17 suites passando
- [ ] `npm run build` → 0 erros
- [ ] Todos os services funcionando
- [ ] Todos os routes retornando valores

### 📊 KPIs:
- Testes: 119 → 140+ testes passando
- Build: 29 → 0 erros
- Cobertura: Manter > 80%

## 🔄 APÓS CORREÇÕES - PRÓXIMOS PASSOS

### 1. Frontend Básico (60 min)
```powershell
cd d:\sistema-tributario\frontend
npm install
npm run dev
```

### 2. Deploy Preparation (30 min)
- Configurar variáveis de ambiente
- Testar build de produção
- Preparar Docker containers

### 3. Documentação Final (30 min)
- Atualizar README.md
- Documentar APIs
- Guias de deployment

## 🆘 TROUBLESHOOTING

### Se `npm install` falhar:
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Se Prisma der erro:
```powershell
npx prisma db reset --force
npx prisma migrate deploy
npx prisma generate
```

### Se testes falharem:
1. Verificar mocks em `tests/setup.ts`
2. Verificar imports/exports
3. Verificar variáveis de ambiente

## 📚 CONTEXTO PARA CLAUDE

**O que foi feito até agora:**
- Sistema 70% funcional
- 13/17 suites de teste passando
- Schema Prisma atualizado
- Mocks e validações corrigidos
- Agents de IA funcionando
- Parsers XML/SPED funcionando
- Cache e OpenAI integrados

**O que falta:**
- 2 dependências npm
- 29 erros de TypeScript
- 4 suites de teste
- Campos no schema Prisma
- Return statements em routes
- Tipos do logger

**Estratégia:**
1. Instalar dependências → 4 testes passarão
2. Corrigir schema → build melhorará
3. Corrigir services → funcionalidade completa
4. Corrigir routes → APIs funcionando
5. Frontend → interface pronta

## 🏁 RESULTADO ESPERADO

Ao final de amanhã:
- ✅ Sistema 100% funcional
- ✅ 17/17 testes passando
- ✅ Build limpo
- ✅ Frontend básico
- ✅ Deploy pronto

### **FASE 3: CORRIGIR SCHEMA PRISMA (30 min)**

**Problemas identificados:**
1. `aiResults` field faltando em `documentos`
2. `documentId` faltando em `SpedFiscalApuracao` e `SpedContribuicoesApuracao`

**Correções em `prisma/schema.prisma`:**

```prisma
model documentos {
  id              String    @id @default(cuid())
  userId          String
  empresaId       String?
  filename        String
  originalName    String
  size            Int
  mimeType        String
  path            String?
  status          DocumentStatus @default(PENDING)
  metadata        Json?
  tipo            String?
  conteudo        String?
  nome            String?
  dataEmissao     DateTime?
  aiResults       Json?     // ✅ ADICIONAR ESTA LINHA
  createdAt       DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt       DateTime  @updatedAt @db.Timestamptz(6)
  criado_em       DateTime? @default(now()) @db.Timestamptz(6)
  
  user            User      @relation(fields: [userId], references: [id])

  @@map("documentos")
}

model SpedFiscalApuracao {
  id                  String   @id @default(cuid())
  documentId          String?  // ✅ ADICIONAR ESTA LINHA
  empresaId           String?
  periodo             String?
  saldoAnterior       Decimal  @default(0) @db.Decimal(15,2)
  debitosPeriodo      Decimal  @default(0) @db.Decimal(15,2)
  creditosPeriodo     Decimal  @default(0) @db.Decimal(15,2)
  saldoApurado        Decimal  @default(0) @db.Decimal(15,2)
  saldoARecolher      Decimal  @default(0) @db.Decimal(15,2)
  observacoes         String?
  dataApuracao        DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("sped_fiscal_apuracoes")
}

model SpedContribuicoesApuracao {
  id                  String   @id @default(cuid())
  documentId          String?  // ✅ ADICIONAR ESTA LINHA
  empresaId           String?
  periodo             String?
  saldoAnteriorPis    Decimal  @default(0) @db.Decimal(15,2)
  debitosPeriodoPis   Decimal  @default(0) @db.Decimal(15,2)
  creditosPeriodoPis  Decimal  @default(0) @db.Decimal(15,2)
  saldoApuradoPis     Decimal  @default(0) @db.Decimal(15,2)
  saldoARecolherPis   Decimal  @default(0) @db.Decimal(15,2)
  saldoAnteriorCofins Decimal  @default(0) @db.Decimal(15,2)
  debitosPeriodoCofins Decimal @default(0) @db.Decimal(15,2)
  creditosPeriodoCofins Decimal @default(0) @db.Decimal(15,2)
  saldoApuradoCofins  Decimal  @default(0) @db.Decimal(15,2)
  saldoARecolherCofins Decimal @default(0) @db.Decimal(15,2)
  observacoes         String?
  dataApuracao        DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("sped_contribuicoes_apuracoes")
}
```

**Após mudanças:**
```bash
npx prisma generate
npm run build  # Verificar se erros diminuíram
```

### **FASE 4: CORRIGIR RETURN STATEMENTS (1 hora)**

**Buscar por "error TS7030" e adicionar return statements:**

Arquivos com problema:
- `src/routes/upload.ts`
- `src/routes/watcher.ts`

**Padrão de correção:**
```typescript
// ANTES (❌)
router.post('/path', async (req: Request, res: Response) => {
  try {
    // logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DEPOIS (✅)
router.post('/path', async (req: Request, res: Response) => {
  try {
    // logic
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
```

### **FASE 5: CORRIGIR LOGGER ISSUES (30 min)**

**Arquivo:** `src/utils/logger.ts`

**Problema:** DailyRotateFile type incompatibility

**Solução:** Instalar tipos corretos:
```bash
npm install --save-dev @types/winston-daily-rotate-file
```

Ou usar type assertion:
```typescript
new (DailyRotateFile as any)({
  // config
})
```

### **FASE 6: CORRIGIR AUTO-WATCHER (30 min)**

**Arquivo:** `src/services/auto-watcher.ts`

**Problemas:**
1. DocumentParsingAgent constructor private
2. processDocument arguments mismatch

**Soluções:**
1. Remover `private` do constructor ou criar factory method
2. Ajustar chamadas para match da signature

### **FASE 7: VERIFICAÇÃO FINAL BACKEND (15 min)**

```bash
npm run build  # Deve ter 0 erros
npm test       # Deve ter 17/17 suites passando
```

### **FASE 8: FRONTEND BÁSICO (3-4 horas)**

```bash
cd ../frontend
npm install
```

**Criar componentes básicos:**

1. **Dashboard principal** (`src/app/page.tsx`)
2. **Upload de documentos** (`src/app/upload/page.tsx`)
3. **Status dos agentes** (`src/app/agents/page.tsx`)
4. **Visualização de apurações** (`src/app/apuracoes/page.tsx`)

**Estrutura mínima:**
```typescript
// src/app/page.tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-8">
        Sistema Tributário 100% IA
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Cards de status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Documentos Processados</h3>
          <p className="text-3xl font-bold text-green-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">ICMS Apurado</h3>
          <p className="text-3xl font-bold text-blue-600">R$ 45.678</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Agentes Ativos</h3>
          <p className="text-3xl font-bold text-purple-600">2/3</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Status Sistema</h3>
          <p className="text-3xl font-bold text-green-600">✅ Online</p>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 **OBJETIVOS DO DIA**

### **MÍNIMO ACEITÁVEL:**
- ✅ 0 erros de build TypeScript
- ✅ 17/17 suites de teste passando
- ✅ Frontend básico rodando

### **IDEAL:**
- ✅ Tudo acima +
- ✅ Dashboard com dados reais do backend
- ✅ Upload funcionando via interface
- ✅ Visualização de apurações

### **EXCELENTE:**
- ✅ Tudo acima +
- ✅ Deploy local funcionando (Docker)
- ✅ Testes de integração frontend/backend

## 🚨 **COMANDOS DE VERIFICAÇÃO CONTÍNUA**

**Durante o desenvolvimento, execute frequentemente:**

```bash
# Backend
cd backend
npm run build      # Verificar erros TS
npm test          # Verificar testes
npx prisma studio # Verificar DB

# Frontend  
cd frontend
npm run dev       # Testar interface
npm run build     # Verificar build
```

## 📋 **CHECKLIST FINAL**

### **Backend (Deve estar 100% ✅)**
- [ ] Build sem erros TypeScript
- [ ] 17/17 suites de teste passando
- [ ] Prisma Client funcionando
- [ ] APIs respondendo corretamente
- [ ] Agentes IA operacionais

### **Frontend (Deve estar funcional ✅)**
- [ ] Next.js rodando sem erros
- [ ] Dashboard principal visível
- [ ] Navegação básica funcionando
- [ ] Conexão com backend estabelecida
- [ ] Upload de documentos básico

### **Integração (Bonus ✅)**
- [ ] Frontend consegue listar documentos do backend
- [ ] Upload realmente salva no banco
- [ ] Status dos agentes é exibido em tempo real
- [ ] Apurações são mostradas na interface

## 🎉 **RESULTADO ESPERADO**

Ao final do dia, devemos ter:

1. **Sistema backend 100% funcional** sem erros
2. **Frontend básico** rodando e conectado
3. **Demonstração end-to-end** funcionando
4. **Base sólida** para finalizar nos próximos dias

---

**Boa sorte e foco nos objetivos! 🚀**

*Este guia foi criado em 25/06/2025 com base no estado atual do projeto.*
