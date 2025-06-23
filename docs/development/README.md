# 🛠️ Guia de Desenvolvimento

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker e Docker Compose
- PostgreSQL
- Redis

## 🚀 Setup Inicial

### 1. Clone o repositório
```bash
git clone <repository-url>
cd sistema-tributario
```

### 2. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Inicie os serviços com Docker
```bash
docker-compose up -d postgres redis
```

### 5. Execute as migrações
```bash
npm run migrate
```

### 6. Inicie o desenvolvimento
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
sistema-tributario/
├── frontend/          # Next.js app
│   ├── components/    # Componentes React
│   ├── pages/         # Páginas Next.js
│   ├── styles/        # Estilos CSS/Tailwind
│   └── utils/         # Utilitários do frontend
├── backend/           # Node.js API
│   ├── config/        # Configurações
│   ├── middleware/    # Middlewares Express
│   ├── models/        # Modelos de dados
│   ├── routes/        # Rotas da API
│   ├── services/      # Lógica de negócio
│   └── utils/         # Utilitários do backend
├── shared/            # Código compartilhado
│   ├── types/         # Tipos TypeScript
│   ├── constants/     # Constantes
│   └── utils/         # Utilitários compartilhados
├── docs/              # Documentação
├── scripts/           # Scripts de deploy
└── tests/             # Testes E2E
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
npm run test:backend
npm run test:frontend
```

### Executar testes com coverage
```bash
npm run test:coverage
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia desenvolvimento (frontend + backend)
- `npm run build` - Build para produção
- `npm run test` - Executa todos os testes
- `npm run lint` - Executa linting
- `npm run format` - Formata o código
- `npm run migrate` - Executa migrações do banco
- `npm run seed` - Popula o banco com dados de teste

## 📝 Padrões de Código

### TypeScript
- Use tipagem forte sempre que possível
- Evite `any` - use `unknown` quando necessário
- Use interfaces para objetos
- Use enums para valores constantes

### Nomenclatura
- **Arquivos**: kebab-case (`user-service.ts`)
- **Funções**: camelCase (`getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Interfaces**: PascalCase (`UserProfile`)
- **Enums**: PascalCase (`UserRole`)

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user authentication
fix: resolve file upload issue
docs: update API documentation
style: format code with prettier
refactor: improve error handling
test: add unit tests for user service
chore: update dependencies
```

## 🔍 Debugging

### Backend
```bash
# Com logs detalhados
DEBUG=* npm run dev:backend

# Com Node.js inspector
node --inspect backend/src/index.js
```

### Frontend
```bash
# Com logs detalhados
DEBUG=* npm run dev:frontend
```

## 📊 Monitoramento

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002 (admin/admin)
- **Health Check**: http://localhost:3001/health

## 🚀 Deploy

### Desenvolvimento
```bash
docker-compose up
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuição

1. Crie uma branch para sua feature
2. Faça suas alterações seguindo os padrões
3. Execute os testes
4. Faça commit seguindo Conventional Commits
5. Abra um Pull Request

## 📚 Recursos Úteis

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation) 