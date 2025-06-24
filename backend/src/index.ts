import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    message: 'Sistema Tributário funcionando!'
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Usar as rotas organizadas do sistema
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema Tributário 100% IA - Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      status: '/api/status',
      auth: '/api/auth',
      upload: '/api/upload',
      parsing: '/api/parsing',
      documents: '/api/v1/documents',
      multiEmpresa: '/api/multi-empresa',
      icms: '/api/icms',
      federal: '/api/federal',
      estoqueCiap: '/api/estoque-ciap',
      precificacao: '/api/precificacao',
      dashboard: '/api/dashboard',
      development: '/api/development'
    }
  });
});

// Middleware de tratamento de erro
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicialização do servidor
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
  });
}

export default app;