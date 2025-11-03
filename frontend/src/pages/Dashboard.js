import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingApproval: 0,
    attendanceRate: 0,
  });

  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalStudents: 150,
      todayAttendance: 132,
      pendingApproval: 8,
      attendanceRate: 88,
    });

    setRecentAttendance([
      {
        id: 1,
        studentName: 'Abenezer Markos',
        studentId: 'ASTU/1234/20',
        course: 'Machine Learning',
        time: new Date(),
        status: 'present',
      },
      {
        id: 2,
        studentName: 'Arsema Ayele',
        studentId: 'ASTU/1235/20',
        course: 'Data Structures',
        time: new Date(),
        status: 'present',
      },
      {
        id: 3,
        studentName: 'Melkamu Wako',
        studentId: 'ASTU/1236/20',
        course: 'Machine Learning',
        time: new Date(),
        status: 'pending',
      },
      {
        id: 4,
        studentName: 'Nigus Hagos',
        studentId: 'ASTU/1237/20',
        course: 'Database Systems',
        time: new Date(),
        status: 'present',
      },
      {
        id: 5,
        studentName: 'Bethlehem Tesfaye',
        studentId: 'ASTU/1238/20',
        course: 'Web Development',
        time: new Date(),
        status: 'pending',
      },
    ]);
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendance,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingApproval,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your attendance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
            <a href="/attendance" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </a>
          </div>
          <div className="space-y-3">
            {recentAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {record.studentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.studentName}</p>
                    <p className="text-sm text-gray-500">{record.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {record.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(record.time), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left flex items-center gap-3">
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              Verify Attendance Records
            </button>
            <button className="w-full btn-secondary text-left flex items-center gap-3">
              <UserGroupIcon className="h-5 w-5" />
              View All Students
            </button>
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

