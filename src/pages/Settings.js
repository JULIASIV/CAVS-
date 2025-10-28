import React, { useState } from 'react';
import { BellIcon, KeyIcon, ShieldCheckIcon, GlobeAltIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const settings = [
    {
      icon: BellIcon,
      title: 'Notifications',
      description: 'Manage how you receive notifications',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications about attendance updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Alerts</p>
              <p className="text-sm text-gray-500">Get email notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      ),
    },
    {
      icon: KeyIcon,
      title: 'Change Password',
      description: 'Update your account password',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input type="password" className="input-field" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input type="password" className="input-field" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input type="password" className="input-field" placeholder="Confirm new password" />
          </div>
          <button className="btn-primary">Update Password</button>
        </div>
      ),
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Enable for enhanced security</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Retention Policy</p>
              <p className="text-sm text-gray-500">
                Automatically delete attendance records after 90 days
              </p>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Policy
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Appearance',
      description: 'Customize the interface appearance',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Theme</p>
              <p className="text-sm text-gray-500">Choose your preferred theme</p>
            </div>
            <select className="input-field w-48">
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-500">Select your preferred language</p>
            </div>
            <select className="input-field w-48">
              <option>English</option>
              <option>Amharic</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {settings.map((setting, index) => {
          const Icon = setting.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
              </div>
              {setting.content}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default Settings;

