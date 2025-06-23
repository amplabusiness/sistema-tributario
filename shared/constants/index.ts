// Constantes de configuração
export const APP_CONFIG = {
  NAME: 'Sistema Tributário IA',
  VERSION: '1.0.0',
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Constantes de IA
export const AI_CONFIG = {
  MAX_TOKENS: 8000,
  BATCH_SIZE: 10,
  RATE_LIMIT: 3, // requests per second
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms
  MODELS: {
    PRIMARY: 'gpt-4',
    FALLBACK: 'gpt-3.5-turbo',
    CLAUDE: 'claude-3-sonnet',
  },
} as const;

// Constantes de cache
export const CACHE_CONFIG = {
  TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 3600, // 1 hour
    LONG: 86400, // 24 hours
  },
  PREFIXES: {
    USER: 'user:',
    DOCUMENT: 'doc:',
    AI_RESULT: 'ai:',
    SESSION: 'session:',
  },
} as const;

// Constantes de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
  FILE_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/xml',
    'text/xml',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
} as const;

// Constantes de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Constantes de status HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Constantes de mensagens
export const MESSAGES = {
  SUCCESS: {
    DOCUMENT_UPLOADED: 'Documento enviado com sucesso',
    DOCUMENT_PROCESSED: 'Documento processado com sucesso',
    USER_CREATED: 'Usuário criado com sucesso',
    USER_UPDATED: 'Usuário atualizado com sucesso',
    USER_DELETED: 'Usuário removido com sucesso',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Credenciais inválidas',
    UNAUTHORIZED: 'Acesso não autorizado',
    NOT_FOUND: 'Recurso não encontrado',
    VALIDATION_ERROR: 'Erro de validação',
    INTERNAL_ERROR: 'Erro interno do servidor',
    RATE_LIMIT_EXCEEDED: 'Limite de requisições excedido',
    FILE_TOO_LARGE: 'Arquivo muito grande',
    INVALID_FILE_TYPE: 'Tipo de arquivo não suportado',
  },
} as const;

// Constantes de logs
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// Constantes de segurança
export const SECURITY = {
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 12,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const; 