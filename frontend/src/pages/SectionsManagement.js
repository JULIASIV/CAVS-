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

const SectionsManagement = () => {
  const [sections, setSections] = useState([]);
  const [depBatches, setDepBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dep_batch_id: ''
  });

  useEffect(() => {
    fetchSections();
    fetchDepBatches();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/sections/');
      setSections(response.data);
    } catch (error) {
      showToast('Failed to fetch sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepBatches = async () => {
    try {
      const response = await api.get('/api/dep-batch/');
      setDepBatches(response.data);
    } catch (error) {
      showToast('Failed to fetch batches', 'error');
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
    
    if (!formData.name.trim() || !formData.dep_batch_id) {
      showToast('Section name and batch are required', 'error');
      return;
    }

    try {
      const payload = { name: formData.name, dep_batch_id: parseInt(formData.dep_batch_id) };

      if (editingId) {
        await api.patch(`/api/sections/${editingId}/`, payload);
        showToast('Section updated successfully');
      } else {
        await api.post('/api/sections/', payload);
        showToast('Section created successfully');
      }
      resetForm();
      fetchSections();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save section', 'error');
    }
  };

  const handleEdit = (section) => {
    setFormData({
      name: section.name,
      dep_batch_id: section.dep_batch?.id || ''
    });
    setEditingId(section.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await api.delete(`/api/sections/${id}/`);
        showToast('Section deleted successfully');
        fetchSections();
      } catch (error) {
        showToast('Failed to delete section', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', dep_batch_id: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage class sections and capacity</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          New Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sections by name..."
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
                {editingId ? 'Edit Section' : 'New Section'}
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
                  Section Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Section A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch *
                </label>
                <select
                  name="dep_batch_id"
                  value={formData.dep_batch_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a batch...</option>
                  {depBatches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.dep} - {batch.batch}
                    </option>
                  ))}
                </select>
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

      {/* Sections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading sections...</div>
        ) : filteredSections.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No sections found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Section Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Batch</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSections.map(section => (
                <tr key={section.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{section.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{section.dep_batch?.dep} - {section.dep_batch?.batch}</td>
                  <td className="px-6 py-4 text-right text-sm flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
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

export default SectionsManagement;
