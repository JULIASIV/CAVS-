import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CameraPage from './pages/CameraPage';
import AttendanceRecords from './pages/AttendanceRecords';
import Students from './pages/Students';
import EnrollStudent from './pages/EnrollStudent';
import Analytics from './pages/Analytics';
import IoTDashboard from './pages/IoTDashboard';
import DeviceSettings from './pages/DeviceSettings';
import Settings from './pages/Settings';
import CoursesManagement from './pages/CoursesManagement';
import SectionsManagement from './pages/SectionsManagement';
import DepartmentsManagement from './pages/DepartmentsManagement';
import BatchesManagement from './pages/BatchesManagement';
import TeachersList from './pages/TeachersList';
import TeacherDetail from './pages/TeacherDetail';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Private authenticated routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="camera" element={<CameraPage />} />
              <Route path="attendance" element={<AttendanceRecords />} />
              <Route path="students" element={<Students />} />
              <Route path="students/enroll" element={<EnrollStudent />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route path="/" element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="register" element={<Register />} />
              <Route path="iot-dashboard" element={<IoTDashboard />} />
              <Route path="device-settings" element={<DeviceSettings />} />
              <Route path="manage/courses" element={<CoursesManagement />} />
              <Route path="manage/sections" element={<SectionsManagement />} />
              <Route path="manage/departments" element={<DepartmentsManagement />} />
              <Route path="manage/batches" element={<BatchesManagement />} />
              <Route path="manage/teachers" element={<TeachersList />} />
              <Route path="manage/teachers/:id" element={<TeacherDetail />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
