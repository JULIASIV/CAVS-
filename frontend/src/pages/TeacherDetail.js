import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    teacher_code: '',
  });

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/teachers/${id}/`);
      setTeacher(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        teacher_code: response.data.teacher_code || '',
      });
      setError('');
    } catch (err) {
      console.error('Failed to fetch teacher:', err);
      setError('Unable to load teacher.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.patch(`/api/teachers/${id}/`, formData);
      setTeacher({ ...teacher, ...formData });
      setIsEditing(false);
      alert('Teacher updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update teacher: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      email: teacher.email || '',
      teacher_code: teacher.teacher_code || '',
    });
    setIsEditing(false);
  };

  if (loading && !teacher) {
    return <div className="text-center py-12 text-gray-500">Loading teacher...</div>;
  }

  if (error && !teacher) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/manage/teachers')}
          className="text-blue-600 hover:text-blue-900"
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/manage/teachers')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
          <p className="text-gray-600 mt-1">View and edit teacher information</p>
        </div>
      </div>

      {/* Teacher Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-3xl font-semibold">
              {(teacher?.first_name || '').charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {teacher?.first_name} {teacher?.last_name}
            </h2>
            <p className="text-gray-600">{teacher?.email}</p>
            {teacher?.teacher_code && (
              <p className="text-sm text-gray-500 mt-1">Code: {teacher.teacher_code}</p>
            )}
          </div>
        </div>

        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Code
              </label>
              <input
                type="text"
                name="teacher_code"
                value={formData.teacher_code}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-medium text-gray-900">{teacher?.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-medium text-gray-900">{teacher?.last_name}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{teacher?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Teacher Code</p>
              <p className="font-medium text-gray-900">{teacher?.teacher_code || 'N/A'}</p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Teacher
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetail;
