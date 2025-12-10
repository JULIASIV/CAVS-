import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

const TeachersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/teachers/');
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setTeachers(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setError('Unable to load teachers.');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.first_name && t.first_name.toLowerCase().includes(q)) ||
      (t.last_name && t.last_name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.teacher_code && t.teacher_code.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await api.delete(`/api/teachers/${id}/`);
      await fetchTeachers();
      alert('Teacher deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete teacher: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">View and manage all teachers</p>
        </div>
        <Link to="/manage/teachers/add" className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Teacher
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by name, email, or teacher code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading teachers...</div>
      ) : filteredTeachers.length === 0 ? (
        <div className="card text-center py-12">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No teachers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="card card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 text-lg font-semibold">
                      {((teacher.first_name || teacher.last_name)
                        ? (teacher.first_name || '').charAt(0) ||
                          (teacher.last_name || '').charAt(0)
                        : '?')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {teacher.first_name} {teacher.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                    {teacher.teacher_code && (
                      <div className="text-xs text-gray-400">
                        Code: {teacher.teacher_code}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/manage/teachers/${teacher.id}`}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    View
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachersList;
