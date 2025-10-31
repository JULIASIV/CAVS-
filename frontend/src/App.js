import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendanceRecords from './pages/AttendanceRecords';
import Students from './pages/Students';
import IoTDashboard from './pages/IoTDashboard';
import DeviceSettings from './pages/DeviceSettings';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Public authenticated routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="attendance" element={<AttendanceRecords />} />
              <Route path="students" element={<Students />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route path="/" element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="iot-dashboard" element={<IoTDashboard />} />
              <Route path="device-settings" element={<DeviceSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

