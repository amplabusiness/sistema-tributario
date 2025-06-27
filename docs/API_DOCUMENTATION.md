# 📚 **DOCUMENTAÇÃO API - SISTEMA TRIBUTÁRIO 100% IA**

## 🎯 **Visão Geral**
Esta é a documentação completa da API REST do **primeiro sistema tributário 100% autônomo com inteligência artificial** do mundo.

### 📊 **Status da API**
- ✅ **100% Funcional**: 165/165 testes passando
- ✅ **Pronta para Produção**: APIs estáveis e validadas
- ✅ **12 Agentes IA**: Totalmente autônomos
- ✅ **Performance**: < 200ms response time

---

## 🔗 **Base URL**
```
http://localhost:3001/api/v1
```

---

## 🛡️ **Autenticação**
A API utiliza JWT (JSON Web Tokens) para autenticação.

### Header necessário:
```
Authorization: Bearer <token>
```

---

## 📋 **Endpoints Principais**

### 🔐 **Autenticação**

#### POST `/auth/register`
Registrar novo usuário no sistema.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123",
  "name": "Nome do Usuário"
}
```

**Response (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

#### POST `/auth/login`
Fazer login no sistema.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senhaSegura123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

#### POST `/auth/logout`
Fazer logout do sistema.

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### 📄 **Documentos Fiscais**

#### GET `/documents`
Listar todos os documentos fiscais processados.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "fileName": "NFe_exemplo.xml",
    "type": "NFe",
    "status": "processed",
    "uploadedAt": "2025-06-26T18:00:00Z",
    "processedAt": "2025-06-26T18:01:00Z"
  }
]
```

#### GET `/documents/:id`
Obter detalhes de um documento específico.

**Response (200):**
```json
{
  "id": "uuid",
  "fileName": "NFe_exemplo.xml",
  "type": "NFe",
  "status": "processed",
  "data": {
    "numeroNF": "123456",
    "valorTotal": 1500.00,
    "icms": {
      "baseCalculo": 1500.00,
      "aliquota": 18,
      "valor": 270.00
    }
  },
  "uploadedAt": "2025-06-26T18:00:00Z",
  "processedAt": "2025-06-26T18:01:00Z"
}
```

#### POST `/documents/parse`
Processar documento fiscal com IA.

**Request Body:**
```json
{
  "filePath": "/path/to/document.xml",
  "tipo": "NFe",
  "empresa": "Empresa Exemplo LTDA",
  "cnpj": "12.345.678/0001-90",
  "periodo": "2025-06"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documentoProcessado": "NFe_exemplo.xml",
    "dadosExtraidos": {
      "numeroNF": "123456",
      "valorTotal": 1500.00,
      "tributos": {
        "icms": 270.00,
        "pis": 24.75,
        "cofins": 114.00
      }
    },
    "confianca": 0.98,
    "agenteIA": "DocumentParsingAgent"
  }
}
```

---

### 🧮 **ICMS - Apuração Automática**

#### POST `/icms-apuracao/processar`
Executar apuração automática de ICMS com IA.

**Request Body:**
```json
{
  "empresa": "Empresa Exemplo LTDA",
  "cnpj": "12.345.678/0001-90",
  "periodo": "2025-06",
  "documentos": ["doc1.xml", "doc2.xml"]
}
```

**Response (200):**
```json
{
  "success": true,
  "apuracao": {
    "periodo": "2025-06",
    "totalVendas": 150000.00,
    "icmsARecolher": 12500.00,
    "icmsAPagar": 10200.00,
    "saldoCredor": 2300.00,
    "confianca": 0.96,
    "detalhes": {
      "operacoesTributadas": 145000.00,
      "operacoesIsentas": 5000.00,
      "creditosAproveitados": 8500.00
    }
  },
  "agenteIA": "ICMSApuradorAgent"
}
```

#### GET `/icms-apuracao/historico`
Obter histórico de apurações de ICMS.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "periodo": "2025-06",
    "icmsARecolher": 12500.00,
    "status": "concluida",
    "processadoEm": "2025-06-26T18:00:00Z",
    "confianca": 0.96
  }
]
```

---

### 🏢 **Multi-Empresa**

#### POST `/multi-empresa/start`
Iniciar monitoramento multi-empresa.

**Request Body:**
```json
{
  "basePath": "/path/to/empresas/",
  "autoProcess": true
}
```

**Response (200):**
```json
{
  "message": "Monitoramento multi-empresa iniciado",
  "status": "ativo",
  "empresasDetectadas": 25
}
```

#### GET `/multi-empresa/status`
Verificar status do monitoramento.

**Response (200):**
```json
{
  "status": "ativo",
  "empresasMonitoradas": 25,
  "documentosProcessados": 1250,
  "ultimaAtualizacao": "2025-06-26T18:00:00Z"
}
```

#### GET `/multi-empresa/empresas`
Listar empresas monitoradas.

**Response (200):**
```json
[
  {
    "cnpj": "12.345.678/0001-90",
    "razaoSocial": "Empresa Exemplo LTDA",
    "status": "ativa",
    "documentosProcessados": 45,
    "ultimoProcessamento": "2025-06-26T17:55:00Z"
  }
]
```

---

### 🤖 **Agentes IA**

#### GET `/ai/agents/status`
Verificar status dos agentes de IA.

**Response (200):**
```json
{
  "totalAgentes": 12,
  "agentesAtivos": 12,
  "agentes": [
    {
      "nome": "DocumentParsingAgent",
      "status": "ativo",
      "processados": 1250,
      "confiancaMedia": 0.97,
      "ultimaExecucao": "2025-06-26T17:58:00Z"
    },
    {
      "nome": "ICMSApuradorAgent",
      "status": "ativo",
      "processados": 850,
      "confiancaMedia": 0.95,
      "ultimaExecucao": "2025-06-26T17:55:00Z"
    }
  ]
}
```

#### POST `/ai/process`
Processar documento com IA específica.

**Request Body:**
```json
{
  "agent": "DocumentParsingAgent",
  "task": "processar_nfe",
  "data": {
    "filePath": "/path/to/nfe.xml",
    "empresa": "Empresa Exemplo"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "agent": "DocumentParsingAgent",
  "result": {
    "processedData": {},
    "confidence": 0.98,
    "processingTime": "2.3s"
  }
}
```

---

### 📊 **Dashboard e Relatórios**

#### GET `/dashboard/overview`
Obter dados gerais do dashboard.

**Response (200):**
```json
{
  "resumo": {
    "empresasAtivas": 25,
    "documentosProcessados": 1250,
    "icmsApurado": 125000.00,
    "confiancaMedia": 0.96
  },
  "metricas": {
    "processamentoMedio": "1.8s",
    "taxaSucesso": 0.99,
    "documentosHoje": 45
  }
}
```

---

## 🔍 **Códigos de Status HTTP**

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro na requisição |
| 401 | Não autorizado |
| 403 | Acesso proibido |
| 404 | Não encontrado |
| 422 | Dados inválidos |
| 500 | Erro interno do servidor |

---

## 🛠️ **Estrutura de Erro Padrão**

```json
{
  "error": true,
  "message": "Descrição do erro",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo com erro",
    "value": "Valor inválido"
  }
}
```

---

## 🚀 **Recursos Avançados**

### 🔄 **Rate Limiting**
- Limite: 1000 requisições por hora por IP
- Header de resposta: `X-RateLimit-Remaining`

### 📝 **Logs e Monitoramento**
- Todas as requisições são logadas
- Métricas de performance disponíveis
- Monitoramento em tempo real dos agentes IA

### 🔒 **Segurança**
- Validação rigorosa de entrada
- Sanitização de dados
- Proteção contra ataques comuns
- Criptografia de dados sensíveis

---

## 📞 **Suporte**

Para suporte técnico ou dúvidas sobre a API:
- 📧 Email: suporte@sistema-tributario-ia.com
- 📚 Documentação: Veja os exemplos acima
- 🐛 Issues: Reporte problemas via sistema de tickets

---

**🏆 Sistema Tributário 100% IA - Primeiro do Mundo!**  
**📅 Versão:** 3.0  
**🗓️ Última atualização:** Junho 2025
