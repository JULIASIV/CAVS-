import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import api, { studentsAPI } from '../services/api';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    student_code: '',
    department: '',
    year: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchSections();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentsAPI.getAll();
      const list = Array.isArray(res) ? res : res.results || [];
      setStudents(list);
      setError('');
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Unable to load students.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get('/api/sections/');
      const data = res.data;
      setSections(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      setSections([]);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.first_name && s.first_name.toLowerCase().includes(q)) ||
      (s.last_name && s.last_name.toLowerCase().includes(q)) ||
      (s.student_code && s.student_code.toLowerCase().includes(q))
    );
  });

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({ first_name: '', last_name: '', student_code: '', department: '', year: '', section_id: '' });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      student_code: student.student_code || '',
      department: student.department || '',
      year: student.year || '',
      section_id: student.section?.id || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
      } else {
        await studentsAPI.create(formData);
      }
      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error('Save student error:', err);
      setError('Failed to save student.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentsAPI.delete(id);
      await fetchStudents();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete student.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage registered students.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <div className="card mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Search by name or student code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="card text-center py-12">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((s) => (
            <div key={s.id} className="card card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-lg font-semibold">
                      {((s.first_name || s.last_name) ? (s.first_name || '').charAt(0) || (s.last_name || '').charAt(0) : '?')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{s.first_name} {s.last_name}</div>
                    <div className="text-sm text-gray-500">{s.student_code || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(s)} className="px-3 py-1 text-sm text-primary-600">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="px-3 py-1 text-sm text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First Name</label>
                <input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Student Code</label>
                <input value={formData.student_code} onChange={(e) => setFormData({ ...formData, student_code: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Section</label>
                <select value={formData.section_id} onChange={(e) => setFormData({ ...formData, section_id: e.target.value })} className="w-full px-3 py-2 border rounded" required>
                  <option value="">-- Select Section --</option>
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>
              {/* Email field removed as requested */}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{editingStudent ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

