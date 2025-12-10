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
import api, { sessionsAPI } from '../services/api';

const CameraPage = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [recentCaptures, setRecentCaptures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    todayCaptures: 0,
    successRate: 0,
    pendingVerification: 0
  });

  useEffect(() => {
    fetchCourses();
    fetchSections();
    fetchRecentCaptures();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await api.get('/api/sections/');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
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
    if (!currentSessionId) {
      alert('No active session. Please open the camera first (step 1: select course & section, then click "Open Camera").');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedCourse) {
        formData.append('course_id', selectedCourse);
      }
      formData.append('session_id', currentSessionId);

      // Use sessionsAPI helper to upload capture
      await sessionsAPI.capture(currentSessionId, formData);

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

    if (!currentSessionId) {
      alert('No active session. Please open camera first (step 1: select course & section, then click "Open Camera").');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    if (selectedCourse) {
      formData.append('course_id', selectedCourse);
    }
    formData.append('session_id', currentSessionId);

    setIsLoading(true);
    try {
      await sessionsAPI.capture(currentSessionId, formData);

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
        
        {/* Step-by-step instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Instructions:</strong></p>
          <ol className="mt-2 text-sm text-gray-700 space-y-1 ml-4 list-decimal">
            <li>Select a Course from the dropdown (optional - will auto-select if not chosen)</li>
            <li>Select a Section for that course (required)</li>
            <li>Click "Start Camera Session" to begin automated face recognition</li>
            <li>The camera will automatically scan and register student faces</li>
            <li>Click "Close Session" when done to process attendance records</li>
          </ol>
        </div>
        
        {/* Course & Section Selection */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 1: Select Course (Required)
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedSection(''); // Reset section when course changes
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 2: Select Section (Required)
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose Section --</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {/* Sections are selectable independently so teachers can pick their section directly */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {!currentSessionId ? (
            <button
              onClick={async () => {
                // Create backend session first
                try {
                  setIsLoading(true);
                  if (!selectedSection) {
                    alert('Please select a section before opening camera.');
                    return;
                  }

                  // If no course selected, use first available course
                  let courseId = selectedCourse;
                  if (!courseId && courses.length > 0) {
                    courseId = courses[0].id;
                  }

                  if (!courseId) {
                    alert('No courses available. Please contact admin to assign courses.');
                    return;
                  }

                  const payload = {
                    course_id: courseId,
                    section: selectedSection
                  };

                  const res = await sessionsAPI.create(payload);
                  // sessionsAPI.create returns session object
                  setCurrentSessionId(res.id);
                  setShowCamera(true);
                } catch (err) {
                  console.error('Failed to start session:', err);
                  alert('Failed to start session. Ensure you are a teacher and try again.');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading || !selectedSection}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CameraIcon className="h-5 w-5" />
              Start Camera Session
            </button>
          ) : (
            <>
              <div className="px-4 py-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3">
                <div className="animate-pulse flex h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-green-900">Session Active</p>
                  <p className="text-sm text-green-700">Session #{currentSessionId} - Camera is capturing...</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!currentSessionId) return;
                  if (!window.confirm('Close current session? This will process and save all captured data.')) return;
                  try {
                    setIsLoading(true);
                    await sessionsAPI.close(currentSessionId);
                    setCurrentSessionId(null);
                    setShowCamera(false);
                    fetchRecentCaptures();
                    fetchStats();
                    alert('Session closed successfully. Attendance has been processed.');
                  } catch (err) {
                    console.error('Failed to close session:', err);
                    alert('Failed to close session');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close Session
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          <strong>Tips:</strong>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Ensure good lighting in the classroom for better face detection</li>
            <li>Have students face the camera directly and maintain proper distance</li>
            <li>Keep the session open for the full duration of the class</li>
            <li>Only close the session when all students have been scanned</li>
            <li>The system will automatically process attendance after closing the session</li>
          </ul>
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
          onClose={async () => {
            // Close session on modal close
            if (currentSessionId) {
              try {
                await sessionsAPI.close(currentSessionId);
              } catch (err) {
                console.error('Failed to close session:', err);
              }
              setCurrentSessionId(null);
            }
            setShowCamera(false);
          }}
          courseId={selectedCourse}
        />
      )}
    </div>
  );
};

export default CameraPage;

