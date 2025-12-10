import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token before every request
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

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ----------------------
// AUTH API
// ----------------------

export const authAPI = {
  register: async (data) => {
    const response = await api.post('/api/auth/register/', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },

  me: async () => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },
};

// ----------------------
// ATTENDANCE
// ----------------------

export const attendanceAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/attendance/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/attendance/${id}/`);
    return response.data;
  },

  verify: async (id, data) => {
    const response = await api.patch(`/api/attendance/${id}/verify/`, data);
    return response.data;
  },

  export: async (params = {}) => {
    const response = await api.get('/api/attendance/export/', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};

// ----------------------
// SESSIONS (Attendance)
// ----------------------

export const sessionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/sessions/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/sessions/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/sessions/', data);
    return response.data;
  },

  close: async (id) => {
    const response = await api.post(`/api/sessions/${id}/close/`);
    return response.data;
  },

  capture: async (id, formData) => {
    const response = await api.post(`/api/sessions/${id}/capture/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

// ----------------------
// STUDENTS
// ----------------------

export const studentsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/students/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/students/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/students/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/api/students/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}/`);
    return response.data;
  },
};

// ----------------------
// STATS
// ----------------------

export const statsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/api/stats/dashboard/');
    return response.data;
  },

  getAttendanceStats: async (params = {}) => {
    const response = await api.get('/api/stats/attendance/', { params });
    return response.data;
  },
};

// ----------------------
// DEVICES (IoT)
// ----------------------

export const devicesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/devices/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/devices/${id}/`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/devices/${id}/`, data);
    return response.data;
  },

  restart: async (id) => {
    const response = await api.post(`/api/devices/${id}/restart/`);
    return response.data;
  },

  metrics: async (id) => {
    const response = await api.get(`/api/devices/${id}/metrics/`);
    return response.data;
  },
};

// ----------------------
// COURSES
// ----------------------

export const coursesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/courses/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/courses/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/courses/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/courses/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/courses/${id}/`);
    return response.data;
  },
};

export default api;
