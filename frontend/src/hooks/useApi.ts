import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  baseURL?: string;
  headers?: Record<string, string>;
}

const useApi = <T>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const request = useCallback(
    async (
      endpoint: string,
      config: RequestInit = {}
    ): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const url = `${baseURL}${endpoint}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...config.headers,
          },
          ...config,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [baseURL, options.headers]
  );

  const get = useCallback((endpoint: string) => request(endpoint), [request]);
  
  const post = useCallback((endpoint: string, data?: any) => 
    request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }), [request]);
  
  const put = useCallback((endpoint: string, data?: any) => 
    request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }), [request]);
  
  const del = useCallback((endpoint: string) => 
    request(endpoint, { method: 'DELETE' }), [request]);

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
  };
};

export default useApi; 