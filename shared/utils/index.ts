// Utilitários para validação
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Utilitários para formatação
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Utilitários para paginação
export const calculatePagination = (
  page: number,
  limit: number,
  total: number,
) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    total,
    totalPages,
    offset,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Utilitários para cache
export const generateCacheKey = (prefix: string, ...parts: string[]): string => {
  return `${prefix}:${parts.join(':')}`;
};

// Utilitários para logs
export const createLogEntry = (
  level: 'error' | 'warn' | 'info' | 'debug',
  message: string,
  metadata?: Record<string, any>,
): any => {
  return {
    level,
    message,
    timestamp: new Date(),
    metadata,
  };
};

// Utilitários para API responses
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string,
): any => {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date(),
  };
};

// Utilitários para validação de arquivos
export const isValidFileType = (mimeType: string): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/xml',
    'text/xml',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  return allowedTypes.includes(mimeType);
};

export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// Utilitários para strings
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}; 