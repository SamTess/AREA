import axiosInstance from '@/lib/axios';

type QueryParams = Record<string, any> | undefined;

const apiService = {
  get: async <T>(url: string, params?: QueryParams): Promise<T> => {
    const res = await axiosInstance.get<T>(url, { params });
    return res.data;
  },

  post: async <T, B = unknown>(url: string, body?: B): Promise<T> => {
    const res = await axiosInstance.post<T>(url, body);
    return res.data;
  },

  put: async <T, B = unknown>(url: string, body?: B): Promise<T> => {
    const res = await axiosInstance.put<T>(url, body);
    return res.data;
  },

  patch: async <T, B = unknown>(url: string, body?: B): Promise<T> => {
    const res = await axiosInstance.patch<T>(url, body);
    return res.data;
  },

  del: async <T>(url: string): Promise<T> => {
    const res = await axiosInstance.delete<T>(url);
    return res.data;
  },
};

export default apiService;
