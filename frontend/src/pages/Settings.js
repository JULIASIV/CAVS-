import React, { useState, useCallback, useEffect } from 'react';
import { BellIcon, KeyIcon, ShieldCheckIcon, ComputerDesktopIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { attendanceAPI } from '../services/api';  // Corrected import for the API

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    teacherCode: ''
  });

  // Load user profile data on mount
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        teacherCode: user.teacher_code || ''
      });
    }
  }, [user]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        email: profileForm.email
      };
      
      // PATCH to update current user
      await attendanceAPI.patch(`/api/users/${user.id}/`, payload);  // Corrected to use attendanceAPI
      showToast('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Settings saved successfully');
      if (theme === 'Dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer_checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
  );

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Code</label>
              <input 
                type="text" 
                className="input-field" 
                value={profileForm.teacherCode}
                onChange={(e) => setProfileForm({ ...profileForm, teacherCode: e.target.value })}
                readOnly
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Manage how you receive notifications</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications about attendance updates</p>
              </div>
              <Toggle checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Email Alerts</p>
                <p className="text-sm text-gray-500">Get email notifications for important updates</p>
              </div>
              <Toggle checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-500">Receive weekly attendance summaries</p>
              </div>
              <Toggle checked={weeklyReports} onChange={(e) => setWeeklyReports(e.target.checked)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-2 bg-primary-100 rounded-lg">
              <KeyIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-500">Manage your security settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                {twoFactorEnabled ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'} - Enhanced security for your account
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`text-sm font-medium px-4 py-2 rounded-lg ${twoFactorEnabled ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Retention Policy</p>
                <p className="text-sm text-gray-500">Automatically delete attendance records after 90 days</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View Policy</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ComputerDesktopIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Appearance</h3>
              <p className="text-sm text-gray-500">Customize the interface appearance</p>
            </div>
          </div>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">Choose your preferred theme</p>
              </div>
              <select 
                className="input-field w-48"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
              <select 
                className="input-field w-48"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Amharic</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Appearance Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
