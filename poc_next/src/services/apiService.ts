import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // url d'exemple
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service class
class ApiService {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

// singelton
export const apiService = new ApiService();