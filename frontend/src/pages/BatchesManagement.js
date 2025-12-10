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

const BatchesManagement = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dep-batch/');
      setBatches(response.data);
    } catch (error) {
      showToast('Failed to fetch batches', 'error');
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
    
    if (!formData.name.trim() || !formData.year.trim()) {
      showToast('Batch name and year are required', 'error');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        year: parseInt(formData.year)
      };
      if (formData.start_date) payload.start_date = formData.start_date;
      if (formData.end_date) payload.end_date = formData.end_date;

      if (editingId) {
        await api.patch(`/api/dep-batch/${editingId}/`, payload);
        showToast('Batch updated successfully');
      } else {
        await api.post('/api/dep-batch/', payload);
        showToast('Batch created successfully');
      }
      resetForm();
      fetchBatches();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save batch', 'error');
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      name: batch.name,
      year: batch.year.toString(),
      start_date: batch.start_date || '',
      end_date: batch.end_date || ''
    });
    setEditingId(batch.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await api.delete(`/api/dep-batch/${id}/`);
        showToast('Batch deleted successfully');
        fetchBatches();
      } catch (error) {
        showToast('Failed to delete batch', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear().toString(),
      start_date: '',
      end_date: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.year.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage student batches by year and period</p>
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
          placeholder="Search batches by name or year..."
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
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Year 1 - Spring 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2000"
                  max="2100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
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

      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading batches...</div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No batches found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Batch Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{batch.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.start_date || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.end_date || 'N/A'}</td>
                  <td className="px-6 py-4 text-right text-sm flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(batch)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(batch.id)}
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

export default BatchesManagement;
