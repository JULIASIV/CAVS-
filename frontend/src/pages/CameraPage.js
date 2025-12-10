import React, { useState, useEffect } from 'react';
import { 
  CameraIcon, 
  ClockIcon,
  CheckCircleIcon,
  StopCircleIcon
} from '@heroicons/react/24/outline';
import api, { sessionsAPI } from '../services/api';

const CameraPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    todayCaptures: 0,
    successRate: 0,
    pendingVerification: 0
  });

  useEffect(() => {
    fetchCourses();
    fetchSections();
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

  const fetchStats = async () => {
    try {
      const response = await api.get('/attendance/capture-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStartSession = async () => {
    try {
      setIsLoading(true);
      if (!selectedSection) {
        alert('Please select a section before starting the session.');
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
      setCurrentSessionId(res.id);
      alert(`✅ Attendance session started. Session ID: ${res.id}\n\nThe backend AI is now running and scanning for faces.`);
    } catch (err) {
      console.error('Failed to start session:', err);
      alert('Failed to start session. ' + (err.response?.data?.detail || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSession = async () => {
    try {
      setIsLoading(true);
      if (!window.confirm('Close current session? This will process and save all captured attendance data.')) {
        return;
      }

      await sessionsAPI.close(currentSessionId);
      setCurrentSessionId(null);
      fetchStats();
      alert('✅ Session closed successfully. Attendance has been processed and saved.');
    } catch (err) {
      console.error('Failed to close session:', err);
      alert('Failed to close session. ' + (err.response?.data?.detail || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Recognition</h1>
        <p className="mt-1 text-sm text-gray-500">
          Automated face recognition for student attendance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Recognitions</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Processing</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingVerification}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Session Control */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Control</h2>
        
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700"><strong>How to use:</strong></p>
          <ol className="mt-2 text-sm text-gray-700 space-y-1 ml-4 list-decimal">
            <li>Select a course (optional - will auto-select first available)</li>
            <li>Select a section (required)</li>
            <li>Click "Start Session" to activate the face recognition camera</li>
            <li>Keep the session running while students are in class</li>
            <li>Click "Stop Session" when done - attendance will be automatically processed</li>
          </ol>
        </div>

        {/* Course & Section Selection */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course (Optional)
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Auto-select first course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section (Required) <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Section --</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Session Status and Controls */}
        <div className="space-y-4">
          {currentSessionId ? (
            <>
              <div className="px-4 py-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3">
                <div className="animate-pulse flex h-4 w-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-green-900">Session Active</p>
                  <p className="text-sm text-green-700">Session #{currentSessionId} - AI is scanning faces and recognizing students</p>
                </div>
              </div>

              <button
                onClick={handleStopSession}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <StopCircleIcon className="h-5 w-5" />
                Stop Session & Process Attendance
              </button>
            </>
          ) : (
            <button
              onClick={handleStartSession}
              disabled={isLoading || !selectedSection}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CameraIcon className="h-5 w-5" />
              Start Session
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">💡 Tips:</p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Ensure good lighting and proper camera positioning</li>
            <li>Have students face the camera directly</li>
            <li>Keep the session open for the entire class period</li>
            <li>The backend AI will continuously scan and recognize faces</li>
            <li>When you close the session, all attendance data will be automatically saved</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
