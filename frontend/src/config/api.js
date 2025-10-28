// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REFRESH: `${API_BASE_URL}/api/auth/refresh`,

  // Attendance
  ATTENDANCE: `${API_BASE_URL}/api/attendance`,
  ATTENDANCE_BY_DATE: (date) => `${API_BASE_URL}/api/attendance/${date}`,
  ATTENDANCE_VERIFY: (id) => `${API_BASE_URL}/api/attendance/${id}/verify`,
  ATTENDANCE_EXPORT: `${API_BASE_URL}/api/attendance/export`,

  // Students
  STUDENTS: `${API_BASE_URL}/api/students`,
  STUDENT_BY_ID: (id) => `${API_BASE_URL}/api/students/${id}`,
  STUDENT_ENROLL: `${API_BASE_URL}/api/students/enroll`,

  // Statistics
  DASHBOARD_STATS: `${API_BASE_URL}/api/stats/dashboard`,
  ATTENDANCE_STATS: `${API_BASE_URL}/api/stats/attendance`,

  // Settings
  USER_SETTINGS: `${API_BASE_URL}/api/settings`,
  UPDATE_PASSWORD: `${API_BASE_URL}/api/settings/password`,
};

export default API_BASE_URL;

