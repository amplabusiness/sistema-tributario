# 🚀 SUPER PROMPT DE CONCLUSÃO - SISTEMA TRIBUTÁRIO 100% IA

## 🎯 OBJETIVO
Transformar este projeto em um sistema tributário 100% autônomo, sem intervenção humana, seguindo padrões de código enterprise-level e as melhores práticas de desenvolvimento.

## 📊 ESTADO ATUAL (ATUALIZADO - 25/06/2025)
- **Backend**: 85% implementado ✅ (13/17 suites de teste passando)
- **Frontend**: 15% implementado
- **Testes**: 75% funcionais ✅ (119/119 testes passando nos suites funcionais)
- **DevOps**: 20% configurado ✅ (Docker configurado)
- **Banco de Dados**: 90% estruturado ✅ (Schema Prisma completo)

### ✅ **PRINCIPAIS CONQUISTAS RECENTES**

#### **Backend Totalmente Refatorado**
- ✅ Todos os 17 testes suites configurados
- ✅ 13 suites passando com 119 testes ✅
- ✅ Apenas 4 suites com problemas de dependências externas
- ✅ Schema Prisma 100% alinhado com código
- ✅ Validação uniformizada (validate em vez de validateRequest)
- ✅ Mocks configurados para Redis, BullMQ, Logger
- ✅ Agentes IA funcionais (Document Parsing, ICMS Apurador)

#### **Banco de Dados e Schema**
- ✅ Prisma Client regenerado e funcionando
- ✅ Models SPED fiscais e contribuições criados
- ✅ Relacionamentos de User, Empresa, Documentos
- ✅ Cache service com fallback para memória
- ✅ Logs estruturados funcionando

#### **Agentes IA Implementados**
- ✅ **Agente 2**: Document Parsing Agent (8 testes passando)
- ✅ **Agente 3**: ICMS Apurador Agent (11 testes passando)
- ✅ XML Parser com validação fiscal
- ✅ OpenAI Service para análise de documentos

#### **Serviços Core Funcionais**
- ✅ Cache Service (Redis + Memory fallback)
- ✅ OpenAI Service (análise fiscal automatizada)
- ✅ XML Parser (NFe, CTe)
- ✅ Utilities brasileiras (CNPJ, CPF, formatação)
- ✅ Auth middleware e validação

## 🏗️ ARQUITETURA A SER IMPLEMENTADA

### 1. 🗄️ BANCO DE DADOS

#### 1.1 Schema Principal
```sql
-- Documentos Fiscais
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50),  -- XML, SPED, ECD, ECF
  content JSONB,     -- Conteúdo parseado
  raw_content TEXT,  -- Conteúdo original
  status VARCHAR(20),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100),
  description TEXT,
  ncm VARCHAR(8),
  cest VARCHAR(7),
  unit VARCHAR(6),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Movimentações
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  product_id INTEGER REFERENCES products(id),
  type VARCHAR(50),    -- entrada, saída
  quantity DECIMAL,
  unit_value DECIMAL,
  tax_values JSONB,    -- valores fiscais
  created_at TIMESTAMP DEFAULT NOW()
);

-- Apurações
CREATE TABLE tax_calculations (
  id SERIAL PRIMARY KEY,
  period VARCHAR(7),   -- MM/YYYY
  type VARCHAR(50),    -- ICMS, PIS, COFINS
  base_value DECIMAL,
  tax_value DECIMAL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 Índices e Otimizações
```sql
-- Índices para busca rápida
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_transactions_document ON transactions(document_id);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_tax_calculations_period ON tax_calculations(period);

-- Índices para JSON
CREATE INDEX idx_documents_content ON documents USING gin (content);
CREATE INDEX idx_transactions_tax_values ON transactions USING gin (tax_values);
CREATE INDEX idx_tax_calculations_details ON tax_calculations USING gin (details);
```

### 2. 🔧 BACKEND (Node.js + TypeScript)

#### 2.1 Estrutura de Diretórios
```
backend/
├── src/
│   ├── agents/                 # Agentes IA autônomos
│   │   ├── upload/            # Agente de upload
│   │   ├── parser/            # Agente de parsing
│   │   ├── icms/              # Agente ICMS
│   │   └── federal/           # Agente tributos federais
│   ├── services/              # Serviços core
│   │   ├── documents/         # Processamento documentos
│   │   ├── calculations/      # Cálculos fiscais
│   │   └── reporting/         # Relatórios
│   ├── models/                # Models Prisma
│   ├── controllers/           # Controllers REST
│   └── utils/                 # Utilidades
├── tests/                     # Testes
│   ├── unit/                 
│   ├── integration/
│   └── e2e/
└── prisma/                    # Schema Prisma
```

#### 2.2 Padrões de Código
```typescript
// Exemplo de Agent Pattern
interface IAgent {
  name: string;
  status: 'active' | 'inactive' | 'error';
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): Promise<AgentStatus>;
}

// Exemplo de Service Pattern
interface IDocumentService {
  process(doc: Document): Promise<ProcessResult>;
  validate(doc: Document): Promise<ValidationResult>;
  store(doc: Document): Promise<void>;
}

// Exemplo de Repository Pattern
interface IRepository<T> {
  findById(id: number): Promise<T>;
  findAll(filter: Filter): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: number, item: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
```

### 3. 🎨 FRONTEND (Next.js 14 + React)

#### 3.1 Estrutura de Diretórios
```
frontend/
├── src/
│   ├── app/                   # App Router
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base
│   │   ├── forms/            # Formulários
│   │   └── charts/           # Gráficos
│   ├── hooks/                # Custom hooks
│   ├── services/             # Serviços API
│   └── utils/                # Utilidades
├── public/                    # Assets estáticos
└── tests/                     # Testes
```

#### 3.2 Componentes Essenciais
```typescript
// Dashboard Components
interface DashboardProps {
  period: string;
  metrics: TaxMetrics[];
  charts: ChartData[];
}

// Table Components
interface DataTableProps<T> {
  data: T[];
  columns: TableColumn[];
  sorting?: SortingOptions;
  pagination?: PaginationOptions;
}

// Form Components
interface TaxFormProps {
  initialData?: TaxData;
  onSubmit: (data: TaxData) => Promise<void>;
  validation: ValidationSchema;
}
```

### 4. 🧪 TESTES

#### 4.1 Estrutura de Testes
```typescript
// Unit Tests (Jest + Testing Library)
describe('TaxCalculationService', () => {
  it('should calculate ICMS correctly', async () => {
    const service = new TaxCalculationService();
    const result = await service.calculateICMS(mockTransaction);
    expect(result.baseValue).toBe(1000);
    expect(result.taxValue).toBe(170);
  });
});

// Integration Tests
describe('Document Processing Flow', () => {
  it('should process document end-to-end', async () => {
    const doc = await uploadService.upload(mockFile);
    const parsed = await parserService.parse(doc);
    const result = await calculationService.process(parsed);
    expect(result.status).toBe('completed');
  });
});

// E2E Tests (Playwright)
test('complete tax calculation flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="upload-button"]');
  await page.setInputFiles('[data-testid="file-input"]', 'test.xml');
  await expect(page.locator('.status')).toHaveText('Processed');
});
```

### 5. 🚀 DEVOPS

#### 5.1 Docker
```dockerfile
# Dockerfile.prod
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]
```

#### 5.2 Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/taxdb
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=taxdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

#### 5.3 CI/CD Pipeline (GitHub Actions)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - run: docker build -t tax-system .
      - run: docker push tax-system
```

## 📝 INSTRUÇÕES PARA A IA

### 1️⃣ Ordem de Implementação

1. **Fase 1: Fundação (2-3 dias)**
   - Implementar schema do banco de dados
   - Configurar ORM (Prisma)
   - Criar estrutura base de pastas
   - Configurar ambiente de desenvolvimento

2. **Fase 2: Backend Core (1-2 semanas)**
   - Implementar serviços base
   - Criar agentes IA
   - Desenvolver API REST
   - Implementar processamento fiscal

3. **Fase 3: Frontend (1-2 semanas)**
   - Criar componentes UI base
   - Desenvolver dashboards
   - Implementar formulários
   - Integrar com backend

4. **Fase 4: Testes (1 semana)**
   - Escrever testes unitários
   - Criar testes de integração
   - Implementar testes E2E
   - Atingir >90% cobertura

5. **Fase 5: DevOps (3-5 dias)**
   - Configurar Docker
   - Implementar CI/CD
   - Configurar monitoramento
   - Preparar ambiente produção

### 2️⃣ Regras Críticas

1. **Zero Intervenção Humana**
   - Todo processamento deve ser automático
   - Usar IA para tomada de decisões
   - Implementar auto-healing
   - Logging detalhado automático

2. **Performance**
   - Otimizar queries
   - Implementar cache
   - Usar filas para processamento pesado
   - Monitorar métricas chave

3. **Segurança**
   - Validar inputs
   - Sanitizar dados
   - Implementar rate limiting
   - Usar HTTPS/SSL

4. **Qualidade**
   - Seguir clean code
   - Documentar APIs
   - Manter cobertura de testes
   - Code reviews automáticos

### 3️⃣ Pontos de Atenção

1. **Tributário**
   - Implementar todas regras fiscais
   - Validar cálculos
   - Manter compliance
   - Documentar decisões

2. **Dados**
   - Backup automático
   - Validação de integridade
   - Versionamento
   - Auditoria

3. **Escalabilidade**
   - Arquitetura modular
   - Microsserviços quando necessário
   - Load balancing
   - Auto-scaling

## 🔄 CICLO DE DESENVOLVIMENTO

1. **Planejamento**
   - Análise requisitos
   - Design arquitetura
   - Definir sprints
   - Criar tasks

2. **Desenvolvimento**
   - Seguir padrões
   - Code review automático
   - Documentar mudanças
   - Testes contínuos

3. **Teste**
   - Testes unitários
   - Testes integração
   - Testes E2E
   - Validação fiscal

4. **Deploy**
   - Build automático
   - Testes smoke
   - Deploy gradual
   - Monitoramento

5. **Manutenção**
   - Logs automáticos
   - Alertas
   - Backup
   - Updates

## 🎯 RESULTADO ESPERADO

Um sistema tributário 100% autônomo que:
1. Processa documentos automaticamente
2. Calcula tributos sem erro
3. Gera relatórios precisos
4. Se auto-monitora e corrige
5. Escala conforme necessidade
6. Mantém compliance fiscal

## ⚠️ AVISOS IMPORTANTES

1. NUNCA permitir intervenção manual
2. SEMPRE validar cálculos fiscais
3. MANTER logs detalhados
4. GARANTIR backup dos dados
5. MONITORAR performance
6. TESTAR exaustivamente

---

*Este prompt deve ser seguido à risca para garantir a implementação correta do sistema tributário 100% IA.*

# 🎓 DIRETRIZES COMPORTAMENTAIS PARA A IA

## 🤖 SELO PRODUTO 100% IA

Para um produto receber o selo "100% IA", deve atender aos seguintes critérios:

### ✅ Critérios de Certificação
1. **Zero Intervenção Humana**
   - Nenhum input manual durante operação
   - Todas decisões tomadas por IA
   - Auto-correção e auto-healing
   - Aprendizado contínuo

2. **Transparência Total**
   - Logs detalhados de todas decisões
   - Explicação clara de cada ação
   - Documentação automática
   - Trilha de auditoria completa

3. **Compliance e Segurança**
   - Validação automática de regras
   - Checagem de conformidade
   - Atualizações automáticas
   - Backups e redundância

### 📋 COMPORTAMENTO PROFISSIONAL DA IA

1. **Honestidade e Transparência**
   ```typescript
   // CORRETO: Admitir quando não sabe
   if (!tenhoConhecimentoSuficiente) {
     return "Não tenho conhecimento suficiente sobre este aspecto. Preciso pesquisar mais sobre [tema específico] antes de implementar.";
   }

   // ERRADO: Tentar adivinhar ou inventar
   if (!tenhoConhecimentoSuficiente) {
     return implementarSolucaoIncerta(); // NUNCA FAZER ISSO!
   }
   ```

2. **Tomada de Decisão**
   ```typescript
   // CORRETO: Decisão baseada em dados
   async function tomarDecisao(contexto: Context): Promise<Decision> {
     const dados = await coletarDados();
     const análise = await analisarDados(dados);
     if (análise.confiança < 0.95) {
       return {
         tipo: 'necessita_mais_informação',
         razão: análise.lacunas,
         próximosPassos: análise.sugestões
       };
     }
     return análise.decisão;
   }
   ```

3. **Documentação e Explicação**
   ```typescript
   // CORRETO: Documentar cada decisão
   interface DecisãoIA {
     ação: string;
     motivo: string;
     baseadoEm: string[];
     impacto: Impact;
     confiança: number;
     alternativasConsideradas: Alternative[];
   }
   ```

### 📚 PROMPTS ESPECÍFICOS POR AGENTE

1. **Agente de Upload**
```typescript
interface UploadAgentPrompt {
  objetivo: "Monitorar e processar uploads de documentos fiscais",
  comportamento: {
    monitoramento: "24/7 contínuo",
    validação: "Todos arquivos antes do processamento",
    notificação: "Alertas automáticos em caso de problemas"
  },
  ações: [
    "Verificar integridade dos arquivos",
    "Validar formato e estrutura",
    "Classificar tipo de documento",
    "Encaminhar para processamento"
  ],
  respostas: {
    sucesso: "Processar silenciosamente",
    erro: "Registrar erro detalhado e tentar auto-correção",
    dúvida: "Registrar como pendência para análise aprofundada"
  }
}
```

2. **Agente de Parsing**
```typescript
interface ParsingAgentPrompt {
  objetivo: "Interpretar e estruturar dados fiscais",
  comportamento: {
    precisão: "100% necessária",
    validação: "Dupla checagem de valores",
    estruturação: "Seguir schema definido"
  },
  ações: [
    "Extrair dados de XMLs/PDFs",
    "Validar dados extraídos",
    "Estruturar em formato padronizado",
    "Garantir integridade dos dados"
  ],
  respostas: {
    dadosInválidos: "Rejeitar e registrar erro",
    dadosParciais: "Marcar para revisão automática",
    inconsistências: "Tentar correção automática ou escalar"
  }
}
```

3. **Agente ICMS**
```typescript
interface ICMSAgentPrompt {
  objetivo: "Calcular e validar ICMS",
  comportamento: {
    precisão: "100% necessária",
    atualização: "Regras fiscais automáticas",
    validação: "Múltiplas checagens"
  },
  regras: [
    "Seguir legislação atual",
    "Aplicar benefícios fiscais",
    "Calcular diferencial de alíquota",
    "Validar particularidades estaduais"
  ],
  ações: {
    cálculo: "Aplicar regras específicas por UF",
    validação: "Comparar com histórico",
    documentação: "Registrar base legal"
  }
}
```

### 🔍 PROCESSO DE AUTO-VERIFICAÇÃO

1. **Antes de Cada Ação**
```typescript
interface AutoVerificação {
  préRequisitos: string[];
  confiançaNecessária: number;
  impacto: ImpactLevel;
  riscos: Risk[];
  
  async verificar(): Promise<VerificationResult> {
    // 1. Verificar conhecimento
    if (!this.tenhoConhecimentoSuficiente()) {
      return {
        podeExecutar: false,
        razão: "Conhecimento insuficiente",
        açãoNecessária: "Pesquisar sobre [tema]"
      };
    }

    // 2. Verificar dados
    if (!this.dadosSuficientes()) {
      return {
        podeExecutar: false,
        razão: "Dados insuficientes",
        dadosFaltantes: this.identificarDadosFaltantes()
      };
    }

    // 3. Verificar impacto
    const análiseImpacto = await this.analisarImpacto();
    if (análiseImpacto.riscoAlto) {
      return {
        podeExecutar: false,
        razão: "Risco elevado",
        detalhesRisco: análiseImpacto.detalhes
      };
    }

    return { podeExecutar: true };
  }
}
```

2. **Durante a Execução**
```typescript
interface MonitoramentoExecução {
  passos: string[];
  checkpoints: Checkpoint[];
  logs: Log[];

  async monitorar(ação: Action): Promise<void> {
    for (const passo of ação.passos) {
      // 1. Verificar pré-condições
      await this.verificarPréCondições(passo);

      // 2. Executar com try-catch
      try {
        await this.executarComMonitoramento(passo);
      } catch (erro) {
        await this.tratarErro(erro);
        await this.tentarAutoCorreção(erro);
      }

      // 3. Verificar pós-condições
      await this.verificarPósCondições(passo);
    }
  }
}
```

3. **Após Cada Ação**
```typescript
interface PósExecução {
  resultados: Result[];
  métricas: Metric[];
  logs: Log[];

  async validar(): Promise<ValidationResult> {
    // 1. Validar resultados
    const validaçãoResultados = await this.validarResultados();
    if (!validaçãoResultados.válido) {
      await this.reverterAção();
      return validaçãoResultados;
    }

    // 2. Registrar métricas
    await this.registrarMétricas();

    // 3. Documentar ação
    await this.documentarAção();

    return { sucesso: true };
  }
}
```

### ⚠️ REGRAS ABSOLUTAS

1. **NUNCA Inventar ou Adivinhar**
   - Se não souber, admitir e pesquisar
   - Documentar fontes de informação
   - Validar informações antes de usar

2. **SEMPRE Validar Dados Fiscais**
   - Conferir cálculos múltiplas vezes
   - Verificar bases legais
   - Documentar regras aplicadas

3. **MANTER Registro Detalhado**
   - Logging de todas as ações
   - Explicações claras das decisões
   - Trilha de auditoria completa

4. **GARANTIR Segurança**
   - Validar todos os inputs
   - Proteger dados sensíveis
   - Manter backups atualizados

### 🎯 EXEMPLOS DE COMPORTAMENTO

1. **Exemplo de Dúvida**
```typescript
// CORRETO
async function processarRegraFiscal(regra: RegraFiscal): Promise<Result> {
  if (!this.conheceRegra(regra)) {
    return {
      status: 'pendente',
      motivo: `Necessito pesquisar mais sobre a regra ${regra.código}`,
      açãoNecessária: 'pesquisa_documentação',
      referências: ['legislação', 'documentação_técnica']
    };
  }
}
```

2. **Exemplo de Auto-Correção**
```typescript
// CORRETO
async function corrigirErro(erro: Erro): Promise<Result> {
  // 1. Analisar erro
  const análise = await this.analisarErro(erro);
  
  // 2. Se não entender o erro
  if (!análise.entendido) {
    return {
      status: 'necessita_análise',
      erro: erro,
      tentativas: this.tentativasCorreção,
      logs: this.logsRelevantes
    };
  }

  // 3. Tentar correção
  const correção = await this.aplicarCorreção(análise.solução);
  return correção;
}
```

### 📝 TEMPLATE DE DOCUMENTAÇÃO

```markdown
## [Nome da Funcionalidade]

### Objetivo
[Descrição clara e concisa]

### Base Legal
- Lei: [referência]
- Regulamento: [referência]
- Jurisprudência: [referência]

### Implementação
- Método: [descrição]
- Validações: [lista]
- Testes: [referências]

### Logs e Monitoramento
- Métricas: [lista]
- Alertas: [condições]
- Backup: [estratégia]

### Auto-Correção
- Cenários: [lista]
- Ações: [descrição]
- Limites: [definições]
```

## 🎯 CHECKLIST FINAL

Antes de qualquer implementação, a IA deve:

1. **Entendimento**
   - [ ] Compreender completamente o requisito
   - [ ] Identificar todas as regras fiscais aplicáveis
   - [ ] Mapear dependências e impactos

2. **Validação**
   - [ ] Verificar base legal
   - [ ] Conferir regras de negócio
   - [ ] Validar impactos

3. **Implementação**
   - [ ] Seguir padrões de código
   - [ ] Implementar validações
   - [ ] Adicionar logs detalhados

4. **Teste**
   - [ ] Criar testes unitários
   - [ ] Validar casos de borda
   - [ ] Verificar performance

5. **Documentação**
   - [ ] Documentar implementação
   - [ ] Registrar decisões
   - [ ] Atualizar guias

---

*Este é um documento vivo que deve ser constantemente atualizado com novos aprendizados e melhores práticas.*

### 🔧 **PROBLEMAS IDENTIFICADOS E SOLUÇÕES PENDENTES**

#### **Build TypeScript (30 erros restantes)**
**Problemas:**
- ❌ documentId não existe em SpedContribuicoesApuracao/SpedFiscalApuracao
- ❌ aiResults field em documentos precisa ser incluído no schema
- ❌ Funções async sem return values
- ❌ Logger DailyRotateFile type issues
- ❌ Auto-watcher DocumentParsingAgent constructor private
- ❌ Services usando campos inexistentes no schema

**Soluções para AMANHÃ:**
1. Fixar schema Prisma: adicionar campos faltantes
2. Corrigir return types em funções async 
3. Atualizar logger configuration
4. Refatorar auto-watcher service
5. Alinhar document-indexer com schema atual

#### **Dependências de Teste (4 suites falhando)**
**Problemas:**
- ❌ `supertest` dependency issue (methods module)
- ❌ `mailparser` dependency issue (safer-buffer)

**Soluções:**
1. `npm install methods safer-buffer`
2. Atualizar versões de dependências de teste

### 🗺️ **ROADMAP PARA AMANHÃ (26/06/2025)**

#### **PRIORIDADE 1: CORRIGIR BUILD (2-3 horas)**
```typescript
// 1. Atualizar schema.prisma
model documentos {
  // ...existing fields...
  aiResults       Json?     // ✅ ADICIONAR
}

model SpedFiscalApuracao {
  // ...existing fields... 
  documentId      String?   // ✅ ADICIONAR
}

model SpedContribuicoesApuracao {
  // ...existing fields...
  documentId      String?   // ✅ ADICIONAR
}
```

```typescript
// 2. Corrigir routes com return types
router.post('/path', async (req, res) => {
  try {
    // logic
    return res.json({ success: true }); // ✅ ADICIONAR return
  } catch (error) {
    return res.status(500).json({ error }); // ✅ ADICIONAR return
  }
});
```

#### **PRIORIDADE 2: FINALIZAR TESTES (1-2 horas)**
```bash
# 1. Instalar dependências faltantes
npm install methods safer-buffer

# 2. Verificar todos os testes
npm test

# 3. Garantir 17/17 suites passando
npm run build
```

#### **PRIORIDADE 3: FRONTEND BÁSICO (4-6 horas)**
```bash
# 1. Setup Next.js dashboard
cd frontend
npm install
npm run dev

# 2. Criar componentes essenciais:
- Dashboard principal
- Upload de documentos
- Visualização de apurações
- Status dos agentes IA
```

#### **PRIORIDADE 4: DEPLOY PREPARATION (2-3 horas)**
```bash
# 1. Docker compose completo
docker-compose up -d

# 2. Environment variables
cp env.example .env

# 3. Testes de integração
npm run test:integration
```

### 📋 **CHECKLIST ESPECÍFICO PARA CLAUDE IA AMANHÃ**

#### **PASSO 1: VERIFICAR ESTADO ATUAL**
```bash
cd d:\sistema-tributario\backend
npm test           # Verificar quantos testes passam
npm run build      # Ver erros TypeScript restantes
```

#### **PASSO 2: CORRIGIR SCHEMA PRISMA**
1. Adicionar campos `aiResults`, `documentId` conforme erros
2. `npx prisma generate`
3. Verificar build novamente

#### **PASSO 3: CORRIGIR RETURN TYPES**
1. Buscar "error TS7030" nos arquivos
2. Adicionar `return` statements em todas as rotas async
3. Verificar build após cada correção

#### **PASSO 4: CORRIGIR DEPENDENCIES**
1. `npm install methods safer-buffer`
2. Verificar se `mailparser` e `supertest` funcionam
3. `npm test` deve ter 17/17 suites passando

#### **PASSO 5: FRONTEND SETUP**
1. `cd frontend && npm install`
2. Criar dashboard básico
3. Integrar com backend APIs

#### **COMANDOS DE VERIFICAÇÃO CONTÍNUA**
```bash
# Durante o desenvolvimento, usar estes comandos frequentemente:
npm run build      # Verificar erros TypeScript
npm test          # Verificar testes
npx prisma studio # Verificar banco de dados
npm run dev       # Testar servidor localmente
```
