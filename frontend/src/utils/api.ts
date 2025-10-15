import axios, { AxiosError, AxiosResponse } from 'axios';
import { showErrorToast, showSuccessToast, showInfoToast } from './toast';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Add request interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle success responses with messages
    if (response.data?.message) {
      showSuccessToast(response.data.message);
    }
    return response;
  },
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      const { status, data } = error.response;
      const errorData = data as any;

      switch (status) {
        case 400:
          errorMessage = errorData?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Session expired. Please login again.';
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = errorData?.message || 'The requested resource was not found.';
          break;
        case 409:
          errorMessage = errorData?.message || 'Conflict occurred. Please try again.';
          break;
        case 422:
          errorMessage = errorData?.message || 'Validation failed. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = errorData?.message || `Error ${status}: ${errorData?.error || 'Unknown error'}`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection and try again.';
    }

    // Show error toast for all errors except 401 (handled above)
    if (error.response?.status !== 401) {
      showErrorToast(errorMessage);
    }

    return Promise.reject(error);
  }
);

// API utility functions
export const api = {
  get: <T = any>(url: string, config?: any) => axios.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => axios.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => axios.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any) => axios.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: any) => axios.delete<T>(url, config),
};

export default api;
