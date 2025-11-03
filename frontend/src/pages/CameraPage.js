import React, { useState, useEffect } from 'react';
import { 
  CameraIcon, 
  PhotoIcon, 
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CameraCapture from '../components/CameraCapture';
import api from '../services/api';

const CameraPage = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [recentCaptures, setRecentCaptures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    todayCaptures: 0,
    successRate: 0,
    pendingVerification: 0
  });

  useEffect(() => {
    fetchCourses();
    fetchRecentCaptures();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchRecentCaptures = async () => {
    try {
      const response = await api.get('/attendance/recent-captures');
      setRecentCaptures(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent captures:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/attendance/capture-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCapture = async (formData) => {
    setIsLoading(true);
    try {
      if (selectedCourse) {
        formData.append('course_id', selectedCourse);
      }
      
      const response = await api.post('/attendance/capture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh data
      fetchRecentCaptures();
      fetchStats();
      
      // Show success message
      alert('Photo captured and uploaded successfully!');
    } catch (error) {
      console.error('Error uploading capture:', error);
      alert('Failed to upload photo. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    if (selectedCourse) {
      formData.append('course_id', selectedCourse);
    }

    setIsLoading(true);
    try {
      await api.post('/attendance/capture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchRecentCaptures();
      fetchStats();
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Camera Capture</h1>
        <p className="mt-1 text-sm text-gray-500">
          Capture student photos for attendance verification
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Captures</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayCaptures}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <CameraIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.successRate}%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingVerification}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Capture Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capture Options</h2>
        
        {/* Course Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course (Optional)
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} - {course.code}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowCamera(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CameraIcon className="h-5 w-5" />
            Open Camera
          </button>

          <label className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <PhotoIcon className="h-5 w-5" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          <strong>Tip:</strong> Make sure students are well-lit and facing the camera directly for best results.
        </p>
      </div>

      {/* Recent Captures */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Captures</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCaptures.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No recent captures. Start by capturing a photo!
                  </td>
                </tr>
              ) : (
                recentCaptures.map((capture, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(capture.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {capture.student?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {capture.student?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {capture.student?.student_id || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {capture.course?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        capture.confidence >= 0.9 ? 'text-green-600' :
                        capture.confidence >= 0.7 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(capture.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {capture.status === 'verified' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          courseId={selectedCourse}
        />
      )}
    </div>
  );
};

export default CameraPage;

