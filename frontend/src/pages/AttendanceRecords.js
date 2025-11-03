import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const AttendanceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const attendanceData = [
    {
      id: 1,
      studentName: 'Abenezer Markos',
      studentId: 'ASTU/1234/20',
      course: 'Machine Learning',
      date: new Date('2024-01-15'),
      time: '09:30 AM',
      status: 'present',
      verified: true,
    },
    {
      id: 2,
      studentName: 'Arsema Ayele',
      studentId: 'ASTU/1235/20',
      course: 'Data Structures',
      date: new Date('2024-01-15'),
      time: '11:15 AM',
      status: 'present',
      verified: true,
    },
    {
      id: 3,
      studentName: 'Melkamu Wako',
      studentId: 'ASTU/1236/20',
      course: 'Machine Learning',
      date: new Date('2024-01-15'),
      time: '09:32 AM',
      status: 'pending',
      verified: false,
    },
    {
      id: 4,
      studentName: 'Nigus Hagos',
      studentId: 'ASTU/1237/20',
      course: 'Database Systems',
      date: new Date('2024-01-15'),
      time: '02:00 PM',
      status: 'present',
      verified: true,
    },
    {
      id: 5,
      studentName: 'Bethlehem Tesfaye',
      studentId: 'ASTU/1238/20',
      course: 'Web Development',
      date: new Date('2024-01-15'),
      time: '10:45 AM',
      status: 'pending',
      verified: false,
    },
    {
      id: 6,
      studentName: 'Dawit Haile',
      studentId: 'ASTU/1239/20',
      course: 'Operating Systems',
      date: new Date('2024-01-15'),
      time: '01:30 PM',
      status: 'present',
      verified: true,
    },
    {
      id: 7,
      studentName: 'Hanna Kebede',
      studentId: 'ASTU/1240/20',
      course: 'Algorithms',
      date: new Date('2024-01-15'),
      time: '03:15 PM',
      status: 'present',
      verified: true,
    },
    {
      id: 8,
      studentName: 'Yohannes Alemu',
      studentId: 'ASTU/1241/20',
      course: 'Computer Networks',
      date: new Date('2024-01-15'),
      time: '08:00 AM',
      status: 'pending',
      verified: false,
    },
  ];

  const filteredData = attendanceData.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !record.verified) ||
      (filterStatus === 'verified' && record.verified);

    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id) => {
    console.log('Approve:', id);
  };

  const handleReject = (id) => {
    console.log('Reject:', id);
  };

  const handleExport = () => {
    // Convert data to CSV format
    const headers = ['Student Name', 'Student ID', 'Course', 'Date', 'Time', 'Status', 'Verified'];
    const csvData = filteredData.map(record => [
      record.studentName,
      record.studentId,
      record.course,
      format(record.date, 'yyyy-MM-dd'),
      record.time,
      record.status,
      record.verified ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-600 mt-1">Manage and verify student attendance</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Records</option>
              <option value="pending">Pending Approval</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(record.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!record.verified ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(record.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(record.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;

