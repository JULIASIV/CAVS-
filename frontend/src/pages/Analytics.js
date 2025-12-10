import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { attendanceAPI, studentsAPI } from '../services/api';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalAttendance: 0,
    averageRate: 0,
    trend: 0,
    peakTime: 'N/A',
    mostActiveDay: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock attendance data for chart visualization (will be replaced with API data)
  const attendanceData = {
    week: [
      { day: 'Mon', present: 0, absent: 0 },
      { day: 'Tue', present: 0, absent: 0 },
      { day: 'Wed', present: 0, absent: 0 },
      { day: 'Thu', present: 0, absent: 0 },
      { day: 'Fri', present: 0, absent: 0 },
    ],
    month: [
      { week: 'Week 1', present: 0, absent: 0 },
      { week: 'Week 2', present: 0, absent: 0 },
      { week: 'Week 3', present: 0, absent: 0 },
      { week: 'Week 4', present: 0, absent: 0 },
    ]
  };

  const [topCourses, setTopCourses] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch attendance records
        const attendanceResponse = await attendanceAPI.getAll();
        const attendanceRecords = Array.isArray(attendanceResponse) 
          ? attendanceResponse 
          : attendanceResponse.results || [];
        
        // Fetch all students
        const studentsResponse = await studentsAPI.getAll();
        const studentsList = Array.isArray(studentsResponse) 
          ? studentsResponse 
          : studentsResponse.results || [];

        // Calculate stats
        const totalAttendance = attendanceRecords.length;
        const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
        const averageRate = totalAttendance > 0 
          ? Math.round((presentCount / totalAttendance) * 100)
          : 0;

        setStats({
          totalAttendance: totalAttendance,
          averageRate: averageRate,
          trend: 2.5, // Placeholder
          peakTime: '9:00 AM',
          mostActiveDay: 'Tuesday'
        });

        // Set placeholder courses (will need actual course data from API)
        setTopCourses([
          { name: 'Course 1', rate: averageRate, students: studentsList.length },
        ]);

        // Set placeholder departments
        setDepartmentStats([
          { name: 'General', rate: averageRate, color: 'bg-blue-500' },
        ]);

        setError('');
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const exportReport = (format) => {
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive attendance insights and statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>

          {/* Export Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export Report
            </button>
            
            {/* Export Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 hidden group-hover:block z-10">
              <button
                onClick={() => exportReport('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                Export as PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Export as Excel
              </button>
              <button
                onClick={() => exportReport('csv')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
              >
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAttendance}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.averageRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+{stats.trend}%</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.peakTime}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.mostActiveDay}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h2>
          
          <div className="space-y-3">
            {(timeRange === 'week' ? attendanceData.week : attendanceData.month).map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.day || item.week}</span>
                  <span className="text-gray-900 font-medium">{item.present}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500 transition-all duration-500"
                      style={{ width: `${item.present}%` }}
                    />
                    <div
                      className="bg-red-500 transition-all duration-500"
                      style={{ width: `${item.absent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h2>
          
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-900 font-medium">{dept.name}</span>
                  <span className="text-gray-600">{dept.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${dept.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Courses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">{course.rate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${course.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

