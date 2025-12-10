import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { studentsAPI, attendanceAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingApproval: 0,
    attendanceRate: 0,
  });

  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all students
        const studentsResponse = await studentsAPI.getAll();
        const students = Array.isArray(studentsResponse)
          ? studentsResponse
          : studentsResponse.results || [];

        // Fetch today's attendance
        const today = new Date().toISOString().split('T')[0];
        const attendanceResponse = await attendanceAPI.getAll({ date: today });

        const attendanceRecords = Array.isArray(attendanceResponse)
          ? attendanceResponse
          : attendanceResponse.results || [];

        const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
        const pendingCount = attendanceRecords.filter(a => a.status === 'pending').length;

        const attendanceRate = students.length > 0
          ? Math.round((presentCount / students.length) * 100)
          : 0;

        setStats({
          totalStudents: students.length,
          todayAttendance: presentCount,
          pendingApproval: pendingCount,
          attendanceRate,
        });

        setRecentAttendance(attendanceRecords.slice(0, 5));
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendance,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingApproval,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your attendance overview.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT ATTENDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
            <a
              href="/attendance"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </a>
          </div>

          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading attendance records...
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No attendance records found for today.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttendance.map(record => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {record.student_name ? record.student_name.charAt(0) : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.student_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {record.course_name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'absent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {record.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {record.timestamp ? format(new Date(record.timestamp), 'HH:mm') : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/attendance" className="w-full btn-primary text-left flex items-center gap-3">
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              Verify Attendance Records
            </Link>
            <Link to="/students" className="w-full btn-secondary text-left flex items-center gap-3">
              <UserGroupIcon className="h-5 w-5" />
              View All Students
            </Link>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5" />
              Export Attendance Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
