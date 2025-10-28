import React, { useState } from 'react';
import { CogIcon, WifiIcon, CameraIcon, BellIcon } from '@heroicons/react/24/outline';

const DeviceSettings = () => {
  const [settings, setSettings] = useState({
    captureInterval: 5,
    imageQuality: 'high',
    motionDetection: true,
    nightMode: true,
    autoRestart: true,
    notifyOnOffline: true,
    maxRetries: 3,
    timeout: 30
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Device Settings</h1>
        <p className="text-gray-600 mt-1">Configure your IoT devices and capture settings</p>
      </div>

      {/* Capture Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <CameraIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Capture Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capture Interval (seconds)
            </label>
            <input
              type="number"
              value={settings.captureInterval}
              onChange={(e) => handleChange('captureInterval', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Quality
            </label>
            <select
              value={settings.imageQuality}
              onChange={(e) => handleChange('imageQuality', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low (Fast processing)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Best accuracy)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-medium text-gray-900">Motion Detection</p>
              <p className="text-sm text-gray-500">Only capture when motion is detected</p>
            </div>
            <button
              onClick={() => handleChange('motionDetection', !settings.motionDetection)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.motionDetection ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.motionDetection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Night Mode</p>
              <p className="text-sm text-gray-500">Enable IR mode for low-light conditions</p>
            </div>
            <button
              onClick={() => handleChange('nightMode', !settings.nightMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.nightMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.nightMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <WifiIcon className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Network Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Timeout (seconds)
            </label>
            <input
              type="number"
              value={settings.timeout}
              onChange={(e) => handleChange('timeout', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Retry Attempts
            </label>
            <input
              type="number"
              value={settings.maxRetries}
              onChange={(e) => handleChange('maxRetries', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-medium text-gray-900">Auto Restart on Failure</p>
              <p className="text-sm text-gray-500">Automatically restart device if connection fails</p>
            </div>
            <button
              onClick={() => handleChange('autoRestart', !settings.autoRestart)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.autoRestart ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.autoRestart ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <BellIcon className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Notify When Device Goes Offline</p>
              <p className="text-sm text-gray-500">Get alerts when device loses connection</p>
            </div>
            <button
              onClick={() => handleChange('notifyOnOffline', !settings.notifyOnOffline)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.notifyOnOffline ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notifyOnOffline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DeviceSettings;

