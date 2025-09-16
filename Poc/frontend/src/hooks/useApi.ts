import { useCallback } from 'react';
import apiService from '@/services/apiService';

export default function useApi() {
  const get = useCallback(<T,>(url: string, params?: Record<string, any>) => {
    return apiService.get<T>(url, params);
  }, []);

  const post = useCallback(<T, B = unknown>(url: string, body?: B) => {
    return apiService.post<T, B>(url, body);
  }, []);

  const put = useCallback(<T, B = unknown>(url: string, body?: B) => {
    return apiService.put<T, B>(url, body);
  }, []);

  const patch = useCallback(<T, B = unknown>(url: string, body?: B) => {
    return apiService.patch<T, B>(url, body);
  }, []);

  const del = useCallback(<T,>(url: string) => {
    return apiService.del<T>(url);
  }, []);

  return { get, post, put, patch, del } as const;
}
