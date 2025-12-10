import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Toast from '../components/Toast';
import api from '../services/api';

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    dep: '',
    batch: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dep-batch/');
      setDepartments(response.data);
    } catch (error) {
      showToast('Failed to fetch departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dep.trim() || !formData.batch.trim()) {
      showToast('Department and batch are required', 'error');
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/api/dep-batch/${editingId}/`, formData);
        showToast('Batch updated successfully');
      } else {
        await api.post('/api/dep-batch/', formData);
        showToast('Batch created successfully');
      }
      resetForm();
      fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save batch', 'error');
    }
  };

  const handleEdit = (department) => {
    setFormData({
      dep: department.dep,
      batch: department.batch
    });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await api.delete(`/api/dep-batch/${id}/`);
        showToast('Batch deleted successfully');
        fetchDepartments();
      } catch (error) {
        showToast('Failed to delete batch', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({ dep: '', batch: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.dep.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage department and batch combinations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          New Batch
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search batches by department or batch name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Batch' : 'New Batch'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  name="dep"
                  value={formData.dep}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch *
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024-2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading departments...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No departments found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Batch</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDepartments.map(department => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{department.dep}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{department.batch}</td>
                  <td className="px-6 py-4 text-right text-sm flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default DepartmentsManagement;
