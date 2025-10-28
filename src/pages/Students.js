import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: 1,
      name: 'John Doe',
      studentId: 'ASTU/1234/20',
      email: 'john.doe@astu.edu',
      department: 'Material Science',
      year: '2020',
      enrollmentDate: '2020-09-01',
      attendanceRate: 92,
    },
    {
      id: 2,
      name: 'Jane Smith',
      studentId: 'ASTU/1235/20',
      email: 'jane.smith@astu.edu',
      department: 'Material Science',
      year: '2020',
      enrollmentDate: '2020-09-01',
      attendanceRate: 88,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      studentId: 'ASTU/1236/20',
      email: 'mike.johnson@astu.edu',
      department: 'Economics',
      year: '2019',
      enrollmentDate: '2019-09-01',
      attendanceRate: 95,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      studentId: 'ASTU/1237/20',
      email: 'sarah.wilson@astu.edu',
      department: 'Material Science',
      year: '2021',
      enrollmentDate: '2021-09-01',
      attendanceRate: 78,
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage enrolled students</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Student
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="card card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 text-xl font-semibold">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.studentId}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Department:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {student.department}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Year:</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">{student.year}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Attendance Rate:</span>
                  <span
                    className={`ml-2 text-sm font-semibold ${
                      student.attendanceRate >= 90
                        ? 'text-green-600'
                        : student.attendanceRate >= 75
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {student.attendanceRate}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium">
                  View Profile
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="card text-center py-12">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found</p>
        </div>
      )}
    </div>
  );
};

export default Students;

