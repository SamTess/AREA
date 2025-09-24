import axios from 'axios';

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || '';

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const res = await http.get<T>(path, { params });
  return res.data as T;
}

export async function apiPost<T, B = any>(path: string, body?: B): Promise<T> {
  const res = await http.post<T>(path, body);
  return res.data as T;
}

export async function apiPatch<T, B = any>(path: string, body?: B): Promise<T> {
  const res = await http.patch<T>(path, body);
  return res.data as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await http.delete<T>(path);
  return res.data as T;
}
