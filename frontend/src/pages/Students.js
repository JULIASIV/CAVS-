import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    year: '',
  });

  const [students, setStudents] = useState([
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
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        year: student.year,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        studentId: '',
        email: '',
        department: '',
        year: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...formData, id: editingStudent.id, enrollmentDate: s.enrollmentDate, attendanceRate: s.attendanceRate }
          : s
      ));
    } else {
      const newStudent = {
        ...formData,
        id: Math.max(...students.map(s => s.id)) + 1,
        enrollmentDate: new Date().toISOString().split('T')[0],
        attendanceRate: 0,
      };
      setStudents([...students, newStudent]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage enrolled students</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
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
                <button 
                  onClick={() => handleOpenModal(student)}
                  className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="px-4 py-2 text-sm text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg font-medium"
                >
                  Delete
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

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="input-field"
                  placeholder="e.g., ASTU/1234/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="student@astu.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School & Department *
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select School/Department</option>
                  
                  <optgroup label="School of Applied Natural Sciences (SoANS)">
                    <option value="Applied Biology">Applied Biology</option>
                    <option value="Applied Chemistry">Applied Chemistry</option>
                    <option value="Applied Mathematics">Applied Mathematics</option>
                    <option value="Applied Physics">Applied Physics</option>
                    <option value="Applied Geology">Applied Geology</option>
                  </optgroup>
                  
                  <optgroup label="School of Civil Engineering & Architecture (SoCEA)">
                    <option value="Architecture">Architecture</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Construction Technology & Management">Construction Technology & Management</option>
                    <option value="Urban Planning & Design">Urban Planning & Design</option>
                    <option value="Geomatics Engineering">Geomatics Engineering</option>
                    <option value="Water Resources Engineering">Water Resources Engineering</option>
                  </optgroup>
                  
                  <optgroup label="School of Electrical Engineering & Computing (SoEEC)">
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering (ECE)</option>
                    <option value="Electrical Power & Control Engineering">Electrical Power & Control Engineering (EPCE)</option>
                  </optgroup>
                  
                  <optgroup label="School of Mechanical, Chemical & Materials Engineering (SoMCME)">
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Materials Science & Engineering">Materials Science & Engineering</option>
                  </optgroup>
                  
                  <optgroup label="School of Humanities & Social Sciences (CoHSS)">
                    <option value="Technology & Innovation Management">Technology & Innovation Management</option>
                    <option value="English Language & Literature">English Language & Literature</option>
                    <option value="Social Sciences">Social Sciences</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Year</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

