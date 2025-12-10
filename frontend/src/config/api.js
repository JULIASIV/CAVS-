// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login/`,      // note the trailing slash
  REGISTER: `${API_BASE_URL}/api/auth/register/`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout/`,    // frontend-only logout
  REFRESH: `${API_BASE_URL}/api/auth/refresh/`,

  // Attendance
  ATTENDANCE: `${API_BASE_URL}/api/attendance/`,
  ATTENDANCE_BY_ID: (id) => `${API_BASE_URL}/api/attendance/${id}/`,
  ATTENDANCE_VERIFY: (id) => `${API_BASE_URL}/api/attendance/${id}/verify/`, // frontend-only
  ATTENDANCE_EXPORT: `${API_BASE_URL}/api/attendance/export/`,                // frontend-only

  // Students
  STUDENTS: `${API_BASE_URL}/api/students/`,
  STUDENT_BY_ID: (id) => `${API_BASE_URL}/api/students/${id}/`,
  STUDENT_ENROLL: `${API_BASE_URL}/api/students/enroll/`,                     // if you have it

  // Teachers
  TEACHERS: `${API_BASE_URL}/api/teachers/`,
  TEACHER_BY_ID: (id) => `${API_BASE_URL}/api/teachers/${id}/`,

  // Courses
  COURSES: `${API_BASE_URL}/api/courses/`,
  COURSE_BY_ID: (id) => `${API_BASE_URL}/api/courses/${id}/`,

  // Departments & Sections
  DEP_BATCHES: `${API_BASE_URL}/api/dep-batch/`,
  SECTIONS: `${API_BASE_URL}/api/sections/`,

  // Statistics (frontend-only placeholders)
  DASHBOARD_STATS: `${API_BASE_URL}/api/stats/dashboard/`,
  ATTENDANCE_STATS: `${API_BASE_URL}/api/stats/attendance/`,

  // User profile/settings
  USER_SETTINGS: `${API_BASE_URL}/api/settings/`,
  UPDATE_PASSWORD: `${API_BASE_URL}/api/settings/password/`,
};

export default API_BASE_URL;
