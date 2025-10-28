import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_ENDPOINTS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};

export const attendanceAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/attendance', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/attendance/${id}`);
    return response.data;
  },
  verify: async (id, data) => {
    const response = await api.patch(`/api/attendance/${id}/verify`, data);
    return response.data;
  },
  export: async (params = {}) => {
    const response = await api.get('/api/attendance/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export const studentsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/students', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/students', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/api/students/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },
};

export const statsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/api/stats/dashboard');
    return response.data;
  },
  getAttendanceStats: async (params = {}) => {
    const response = await api.get('/api/stats/attendance', { params });
    return response.data;
  },
};

export default api;

